"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAdmins, createAdmin, deleteAdmin } from "@/data-acess/DAO/adminDAO";
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
  ShieldAlert,
  UserPlus,
  Trash2,
  Loader2,
  Mail,
  User as UserIcon,
  ShieldCheck,
  Search,
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
import { createAdminSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type CreateAdminFormValues = z.infer<typeof createAdminSchema>;

export default function AdminsPage() {
  const { user } = useUser();
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<CreateAdminFormValues>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  useEffect(() => {
    async function fetchAdmins() {
      try {
        const data = await getAdmins();
        setAdmins(data);
      } catch (error) {
        console.error("Failed to fetch admins:", error);
      } finally {
        setLoading(false);
      }
    }
    if (user?.role === "SUPER_ADMIN") {
      fetchAdmins();
    }
  }, [user]);

  const onSubmit = async (data: CreateAdminFormValues) => {
    setErrorMessage(null);
    setActionLoading("creating");
    try {
      await createAdmin(data);
      setIsCreateDialogOpen(false);
      form.reset();
      // Refresh list
      const updatedAdmins = await getAdmins();
      setAdmins(updatedAdmins);
      toast.success("Admin created successfully");
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to create admin");
      toast.error("Failed to create admin");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteAdmin = async (id: string, name: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete admin "${name}"? This will also remove their Supabase Auth account. This action cannot be undone.`,
      )
    )
      return;

    setActionLoading(id);
    try {
      await deleteAdmin(id);
      setAdmins((prev) => prev.filter((a) => a.user.id !== id));
      toast.success("Admin deleted successfully");
    } catch (error) {
      console.error("Failed to delete admin:", error);
      toast.error("Failed to delete admin");
    } finally {
      setActionLoading(null);
    }
  };

  if (user?.role !== "SUPER_ADMIN") {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center space-y-4'>
          <ShieldAlert className='w-16 h-16 text-rose-500 mx-auto' />
          <h1 className='text-2xl font-bold'>Access Denied</h1>
          <p className='text-muted-foreground'>
            Only Super Admins can access this page.
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
            <ShieldCheck className='w-4 h-4' />
            <span>Core Administration</span>
          </div>
          <h1 className='text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70'>
            Admin Management
          </h1>
          <p className='text-muted-foreground text-lg'>
            Control system access by managing administrator accounts.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className='flex items-center gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95'
        >
          <UserPlus className='w-4 h-4' />
          Create New Admin
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
      ) : admins.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {admins.map((admin) => (
            <Card
              key={admin.id}
              className='group relative border-border/50 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 bg-card rounded-2xl'
            >
              <div className='absolute top-2 right-2'>
                <ShieldCheck className='w-5 h-5 text-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity' />
              </div>
              <CardHeader>
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary'>
                    <UserIcon className='w-6 h-6' />
                  </div>
                  <div className='space-y-1'>
                    <CardTitle className='text-xl font-bold'>
                      {admin.user.name || "Administrator"}
                    </CardTitle>
                    <CardDescription className='font-mono text-[10px] uppercase tracking-widest'>
                      ID: {admin.user.id.slice(0, 16)}...
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className='space-y-6'>
                <div className='flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/20 group-hover:bg-muted/50 transition-colors'>
                  <Mail className='w-4 h-4 text-muted-foreground' />
                  <span className='text-sm font-medium truncate'>
                    {admin.user.email}
                  </span>
                </div>

                <div className='pt-4 border-t border-border/40 flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
                    <span className='text-[10px] font-bold uppercase text-muted-foreground'>
                      Status: Active
                    </span>
                  </div>

                  <Button
                    size='sm'
                    variant='ghost'
                    className='text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-100 h-8 px-2'
                    onClick={() =>
                      handleDeleteAdmin(admin.user.id, admin.user.name)
                    }
                    disabled={actionLoading === admin.user.id}
                  >
                    {actionLoading === admin.user.id ? (
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
          <ShieldAlert className='w-12 h-12 text-muted-foreground mb-4' />
          <h3 className='text-2xl font-bold'>No admins found</h3>
          <p className='text-muted-foreground max-w-sm mx-auto mt-2'>
            There are currently no additional administrators in the system.
          </p>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            variant='outline'
            className='mt-6'
          >
            Create the first Admin
          </Button>
        </div>
      )}

      {/* Create Admin Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className='sm:max-w-[425px] overflow-hidden rounded-3xl'>
          <DialogHeader>
            <DialogTitle className='text-2xl font-bold'>
              Register New Admin
            </DialogTitle>
            <DialogDescription>
              Create a new administrator account. They will have full access to
              manage orders and partners.
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
                  Full Name
                </Label>
                <div className='relative'>
                  <UserIcon className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                  <Input
                    id='name'
                    placeholder='John Doe'
                    className='pl-10 h-11 rounded-xl bg-muted/40 border-border/50 focus:ring-primary/20 transition-all font-medium'
                    {...form.register("name")}
                  />
                </div>
                {form.formState.errors.name && (
                  <p className='text-xs text-rose-500 font-bold uppercase'>
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='email'
                  className='text-sm font-bold uppercase tracking-wider text-muted-foreground'
                >
                  Email Address
                </Label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                  <Input
                    id='email'
                    type='email'
                    placeholder='admin@khonsu.mos'
                    className='pl-10 h-11 rounded-xl bg-muted/40 border-border/50 focus:ring-primary/20 transition-all font-medium'
                    {...form.register("email")}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className='text-xs text-rose-500 font-bold uppercase'>
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='password'
                  className='text-sm font-bold uppercase tracking-wider text-muted-foreground'
                >
                  Temporary Password
                </Label>
                <Input
                  id='password'
                  type='password'
                  placeholder='••••••••'
                  className='h-11 rounded-xl bg-muted/40 border-border/50 focus:ring-primary/20 transition-all font-medium'
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className='text-xs text-rose-500 font-bold uppercase'>
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className='pt-4'>
              <Button
                type='button'
                variant='ghost'
                onClick={() => setIsCreateDialogOpen(false)}
                className='rounded-xl'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={actionLoading === "creating"}
                className='min-w-[120px] shadow-lg shadow-primary/20 rounded-xl h-10'
              >
                {actionLoading === "creating" ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin mr-2' />
                    Creating...
                  </>
                ) : (
                  "Create Admin"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
