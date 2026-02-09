"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getRanks,
  createRank,
  deleteRank,
  updateRank,
} from "@/data-acess/DAO/rankDAO";
import { useUser } from "@/providers/user-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Plus,
  Trash2,
  Loader2,
  Trophy,
  ShieldCheck,
  AlertCircle,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { rankSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type RankFormValues = z.infer<typeof rankSchema>;

export default function RanksPage() {
  const { user } = useUser();
  const [ranks, setRanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRank, setEditingRank] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<RankFormValues>({
    resolver: zodResolver(rankSchema),
    defaultValues: {
      name: "",
      amount: 0,
    },
  });

  useEffect(() => {
    async function fetchRanks() {
      try {
        const data = await getRanks();
        setRanks(data);
      } catch (error) {
        console.error("Failed to fetch ranks:", error);
      } finally {
        setLoading(false);
      }
    }
    if (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") {
      fetchRanks();
    }
  }, [user]);

  useEffect(() => {
    if (editingRank) {
      form.reset({
        name: editingRank.name,
        amount: editingRank.amount,
      });
    } else {
      form.reset({
        name: "",
        amount: 0,
      });
    }
  }, [editingRank, form]);

  const onSubmit = async (data: RankFormValues) => {
    setErrorMessage(null);
    setActionLoading(editingRank ? "updating" : "creating");
    try {
      if (editingRank) {
        await updateRank(editingRank.id, data);
      } else {
        await createRank(data);
      }
      setIsDialogOpen(false);
      setEditingRank(null);
      form.reset();
      const updatedRanks = await getRanks();
      setRanks(updatedRanks);
      toast.success(`Rank ${editingRank ? "updated" : "created"} successfully`);
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to save rank");
      toast.error(`Failed to ${editingRank ? "update" : "create"} rank`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteRank = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete rank "${name}"?`))
      return;

    setActionLoading(id);
    try {
      await deleteRank(id);
      setRanks((prev) => prev.filter((r) => r.id !== id));
      toast.success("Rank deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete rank");
    } finally {
      setActionLoading(null);
    }
  };

  if (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center space-y-4'>
          <AlertCircle className='w-16 h-16 text-rose-500 mx-auto' />
          <h1 className='text-2xl font-bold'>Access Denied</h1>
          <p className='text-muted-foreground'>
            Only admins can access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='p-8 space-y-10 max-w-7xl mx-auto min-h-screen'>
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
        <div className='space-y-2'>
          <div className='flex items-center gap-2 text-primary font-medium text-sm'>
            <Trophy className='w-4 h-4' />
            <span>Classification System</span>
          </div>
          <h1 className='text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70'>
            Rank Management
          </h1>
          <p className='text-muted-foreground text-lg'>
            Define and manage tiers for brands and manufacturers.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingRank(null);
            setIsDialogOpen(true);
          }}
          className='flex items-center gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95'
        >
          <Plus className='w-4 h-4' />
          Add New Rank
        </Button>
      </div>

      <Separator className='opacity-50' />

      {loading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='h-48 w-full animate-pulse bg-muted rounded-2xl border border-border/50'
            />
          ))}
        </div>
      ) : ranks.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {ranks.map((rank) => (
            <Card
              key={rank.id}
              className='group relative border-border/50 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 bg-card rounded-2xl'
            >
              <div className='absolute top-4 right-4'>
                <ShieldCheck className='w-5 h-5 text-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity' />
              </div>
              <CardHeader>
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary'>
                    <Trophy className='w-6 h-6' />
                  </div>
                  <div className='space-y-1'>
                    <CardTitle className='text-xl font-bold'>
                      {rank.name}
                    </CardTitle>
                    <CardDescription className='font-mono text-[10px] uppercase tracking-widest'>
                      ID: {rank.id.slice(0, 16)}...
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className='space-y-6'>
                <div className='flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/20 group-hover:bg-muted/50 transition-colors'>
                  <Hash className='w-4 h-4 text-muted-foreground' />
                  <span className='text-sm font-medium'>
                    Amount:{" "}
                    <span className='text-primary font-bold'>
                      {rank.amount}
                    </span>
                  </span>
                </div>

                <div className='pt-4 border-t border-border/40 flex items-center justify-between'>
                  <Button
                    size='sm'
                    variant='ghost'
                    className='text-primary hover:bg-primary/10'
                    onClick={() => {
                      setEditingRank(rank);
                      setIsDialogOpen(true);
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    size='sm'
                    variant='ghost'
                    className='text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-100 h-8 px-2'
                    onClick={() => handleDeleteRank(rank.id, rank.name)}
                    disabled={actionLoading === rank.id}
                  >
                    {actionLoading === rank.id ? (
                      <Loader2 className='w-3.5 h-3.5 animate-spin' />
                    ) : (
                      <>
                        <Trash2 className='w-3.5 h-3.5 mr-1.5' />
                        Remove
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center p-24 bg-muted/20 text-center rounded-3xl border-2 border-dashed'>
          <Trophy className='w-12 h-12 text-muted-foreground mb-4' />
          <h3 className='text-2xl font-bold'>No ranks found</h3>
          <p className='text-muted-foreground max-w-sm mx-auto mt-2'>
            There are currently no ranks defined in the system.
          </p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            variant='outline'
            className='mt-6'
          >
            Create the first Rank
          </Button>
        </div>
      )}

      {/* Rank Dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingRank(null);
        }}
      >
        <DialogContent className='sm:max-w-[425px] overflow-hidden rounded-3xl'>
          <DialogHeader>
            <DialogTitle className='text-2xl font-bold'>
              {editingRank ? "Edit Rank" : "Add New Rank"}
            </DialogTitle>
            <DialogDescription>
              {editingRank
                ? "Update the details of the existing rank."
                : "Create a new rank category for users."}
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6 py-4'
          >
            {errorMessage && (
              <div className='p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium animate-in fade-in slide-in-from-top-2'>
                {errorMessage}
              </div>
            )}

            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label
                  htmlFor='name'
                  className='text-sm font-bold uppercase tracking-wider text-muted-foreground'
                >
                  Rank Name
                </Label>
                <Input
                  id='name'
                  placeholder='e.g. Gold, Tier 1'
                  className='h-11 rounded-xl bg-muted/40 border-border/50 focus:ring-primary/20 transition-all font-medium'
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <p className='text-xs text-rose-500 font-bold uppercase'>
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='amount'
                  className='text-sm font-bold uppercase tracking-wider text-muted-foreground'
                >
                  Amount (Threshold/Value)
                </Label>
                <Input
                  id='amount'
                  type='number'
                  placeholder='0'
                  className='h-11 rounded-xl bg-muted/40 border-border/50 focus:ring-primary/20 transition-all font-medium'
                  {...form.register("amount", { valueAsNumber: true })}
                />
                {form.formState.errors.amount && (
                  <p className='text-xs text-rose-500 font-bold uppercase'>
                    {form.formState.errors.amount.message}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className='pt-4'>
              <Button
                type='button'
                variant='ghost'
                onClick={() => {
                  setIsDialogOpen(false);
                  setEditingRank(null);
                }}
                className='rounded-xl'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={!!actionLoading}
                className='min-w-[120px] shadow-lg shadow-primary/20 rounded-xl h-10'
              >
                {actionLoading === "creating" ||
                actionLoading === "updating" ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin mr-2' />
                    Saving...
                  </>
                ) : editingRank ? (
                  "Update Rank"
                ) : (
                  "Create Rank"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
