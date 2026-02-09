"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getManufacturers,
  deleteManufacturer,
  updateManufacturerRank,
} from "@/data-acess/DAO/manDAO";
import { getRanks } from "@/data-acess/DAO/rankDAO";
import { useUser } from "@/providers/user-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Factory,
  MapPin,
  Phone,
  Trophy,
  Layers,
  PhoneCall,
  Search,
  Filter,
  Info,
  Trash2,
  Loader2,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Custom Badge component
const CustomBadge = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all",
      className,
    )}
  >
    {children}
  </div>
);

export default function ManufacturersPage() {
  const { user } = useUser();
  const [manufacturers, setManufacturers] = useState<any[]>([]);
  const [ranks, setRanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isRankDialogOpen, setIsRankDialogOpen] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] = useState<any | null>(
    null,
  );
  const [newRankId, setNewRankId] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [manData, ranksData] = await Promise.all([
          getManufacturers(),
          getRanks(),
        ]);
        setManufacturers(manData);
        setRanks(ranksData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleUpdateRank = async () => {
    if (!selectedManufacturer || !newRankId) return;

    setActionLoading("updating-rank");
    try {
      await updateManufacturerRank(selectedManufacturer.id, newRankId);
      setManufacturers((prev) =>
        prev.map((m) =>
          m.id === selectedManufacturer.id
            ? {
                ...m,
                rankId: newRankId,
                rank: ranks.find((r) => r.id === newRankId),
              }
            : m,
        ),
      );
      setIsRankDialogOpen(false);
      setSelectedManufacturer(null);
      toast.success("Rank updated successfully");
    } catch (error) {
      console.error("Failed to update rank:", error);
      toast.error("Failed to update rank");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteManufacturer = async (manId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this manufacturer? This will also remove ALL their associated sub-orders. This action cannot be undone.",
      )
    )
      return;

    setActionLoading(manId);
    try {
      await deleteManufacturer(manId);
      setManufacturers((prev) => prev.filter((m) => m.id !== manId));
      toast.success("Manufacturer deleted successfully");
    } catch (error) {
      console.error("Failed to delete manufacturer:", error);
      toast.error("Failed to delete manufacturer");
    } finally {
      setActionLoading(null);
    }
  };

  const getRankStyles = (rankName: string) => {
    switch (rankName.toUpperCase()) {
      case "PLATINUM":
        return "bg-slate-50 text-slate-600 border-slate-300 dark:bg-slate-900/40 dark:text-slate-200";
      case "GOLD":
        return "bg-amber-50 text-amber-600 border-amber-300 dark:bg-amber-900/40 dark:text-amber-200";
      case "SILVER":
        return "bg-zinc-50 text-zinc-600 border-zinc-300 dark:bg-zinc-900/40 dark:text-zinc-200";
      case "BRONZE":
        return "bg-orange-50 text-orange-600 border-orange-300 dark:bg-orange-900/40 dark:text-orange-200";
      default:
        return "bg-primary/5 text-primary border-primary/20";
    }
  };

  if (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") {
    return <div className='p-8'>Access Denied</div>;
  }

  return (
    <div className='p-8 space-y-10 max-w-7xl mx-auto min-h-screen'>
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
        <div className='space-y-2'>
          <div className='flex items-center gap-2 text-primary font-medium text-sm'>
            <Factory className='w-4 h-4' />
            <span>Partners</span>
          </div>
          <h1 className='text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70'>
            Manufacturers
          </h1>
          <p className='text-muted-foreground text-lg'>
            Discover and connect with certified production facilities.
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <div className='relative group'>
            <Search className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary' />
            <input
              type='text'
              placeholder='Search facilities...'
              className='pl-9 pr-4 py-2 rounded-xl bg-muted/40 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 text-sm transition-all'
            />
          </div>
          <button className='p-2 rounded-xl border border-border/50 bg-background hover:bg-muted transition-colors'>
            <Filter className='w-4 h-4' />
          </button>
        </div>
      </div>

      <Separator className='opacity-50' />

      {loading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className='h-64 w-full animate-pulse bg-muted rounded-2xl border border-border/50'
            />
          ))}
        </div>
      ) : manufacturers.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {manufacturers.map((man) => (
            <div key={man.id} className='group relative'>
              <Card className='overflow-hidden border-border/50 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary/20 bg-card rounded-2xl flex flex-col h-full'>
                <CardHeader className='pb-4'>
                  <div className='flex items-start justify-between'>
                    <div className='p-3 rounded-2xl bg-primary/5 group-hover:bg-primary/10 transition-colors'>
                      <Factory className='w-6 h-6 text-primary' />
                    </div>
                    <button
                      onClick={() => {
                        setSelectedManufacturer(man);
                        setNewRankId(man.rankId);
                        setIsRankDialogOpen(true);
                      }}
                      className='transition-all hover:scale-105 active:scale-95'
                    >
                      <CustomBadge
                        className={cn(
                          "flex items-center gap-1.5 shadow-sm cursor-pointer hover:shadow-md",
                          getRankStyles(man.rank.name),
                        )}
                      >
                        <Trophy className='w-3 h-3' />
                        {man.rank.name}
                      </CustomBadge>
                    </button>
                  </div>
                  <div className='mt-4 space-y-1'>
                    <CardTitle className='text-xl font-bold'>
                      {man.user?.name || "Facility Info"}
                    </CardTitle>
                    <CardDescription className='font-mono text-[10px] uppercase tracking-widest'>
                      ID: {man.id.slice(0, 16)}...
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className='grow space-y-6 pt-0'>
                  <div className='flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/20 group-hover:bg-muted/50 transition-colors'>
                    <Mail className='w-4 h-4 text-muted-foreground' />
                    <span className='text-sm font-medium truncate'>
                      {man.user?.email || "No email provided"}
                    </span>
                  </div>
                  <div className='space-y-4'>
                    <div className='flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/20 group-hover:bg-muted/50 transition-colors'>
                      <MapPin className='w-4 h-4 text-muted-foreground mt-0.5' />
                      <div className='space-y-1'>
                        <span className='text-[10px] font-bold uppercase text-muted-foreground leading-none'>
                          Factory Address
                        </span>
                        <p className='text-xs leading-relaxed font-medium'>
                          {man.factoryAddress}
                        </p>
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-3'>
                      <div className='p-3 rounded-xl bg-muted/30 border border-border/20'>
                        <div className='flex items-center gap-2 mb-1'>
                          <Layers className='w-3 h-3 text-primary' />
                          <span className='text-[9px] font-bold uppercase text-muted-foreground mt-0.5'>
                            Capacity
                          </span>
                        </div>
                        <p className='text-sm font-bold'>{man.limitPerOrder}</p>
                        <p className='text-[9px] text-muted-foreground'>
                          units per order
                        </p>
                      </div>

                      <div className='p-3 rounded-xl bg-muted/30 border border-border/20'>
                        <div className='flex items-center gap-2 mb-1'>
                          <PhoneCall className='w-3 h-3 text-primary' />
                          <span className='text-[9px] font-bold uppercase text-muted-foreground mt-0.5'>
                            Support
                          </span>
                        </div>
                        <p className='text-sm font-bold truncate'>
                          {man.contactNo1}
                        </p>
                        <p className='text-[9px] text-muted-foreground'>
                          Primary Line
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='pt-4 border-t border-border/40 flex items-center justify-between'>
                    <div className='flex flex-col gap-2 w-full'>
                      <div className='flex items-center justify-between'>
                        <span className='text-xs text-muted-foreground flex items-center gap-1.5'>
                          <Info className='w-3.5 h-3.5' />
                          Verified Production Partner
                        </span>
                        <button className='text-xs font-bold text-primary flex items-center gap-1 hover:underline'>
                          View Details
                          <Search className='w-3 h-3' />
                        </button>
                      </div>

                      {(user?.role === "ADMIN" ||
                        user?.role === "SUPER_ADMIN") && (
                        <div className='flex gap-2 w-full mt-2'>
                          <div className='grow' />
                          <Button
                            size='sm'
                            variant='ghost'
                            className='text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-100'
                            onClick={() => handleDeleteManufacturer(man.id)}
                            disabled={actionLoading === man.id}
                          >
                            {actionLoading === man.id ? (
                              <Loader2 className='w-3.5 h-3.5 animate-spin' />
                            ) : (
                              <Trash2 className='w-3.5 h-3.5' />
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center p-24 border-2 border-dashed rounded-3xl bg-muted/20 text-center space-y-6'>
          <div className='p-6 rounded-full bg-background shadow-xl border border-border/50'>
            <Factory className='w-12 h-12 text-muted-foreground' />
          </div>
          <div className='space-y-2'>
            <h3 className='text-2xl font-bold tracking-tight'>
              No manufacturers found
            </h3>
            <p className='text-muted-foreground max-w-sm mx-auto'>
              We couldn't find any production facilities at the moment. Please
              check back later.
            </p>
          </div>
        </div>
      )}
      <Dialog open={isRankDialogOpen} onOpenChange={setIsRankDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Change Manufacturer Rank</DialogTitle>
            <DialogDescription>
              Assign a new rank to this production partner.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Select Rank</label>
              <Select value={newRankId} onValueChange={setNewRankId}>
                <SelectTrigger>
                  <SelectValue placeholder='Select a rank' />
                </SelectTrigger>
                <SelectContent>
                  {ranks.map((rank) => (
                    <SelectItem key={rank.id} value={rank.id}>
                      {rank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsRankDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateRank}
              disabled={actionLoading === "updating-rank"}
            >
              {actionLoading === "updating-rank" ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Updating...
                </>
              ) : (
                "Update Rank"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
