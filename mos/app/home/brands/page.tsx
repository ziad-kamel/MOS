"use client";

import React, { useEffect, useState } from "react";
import {
  getBrands,
  deleteBrand,
  updateBrandRank,
} from "@/data-acess/DAO/brandDAO";
import { getRanks } from "@/data-acess/DAO/rankDAO";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  UserCircle,
  MapPin,
  Phone,
  Trophy,
  Search,
  Filter,
  Trash2,
  Loader2,
  Package,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
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

export default function BrandsPage() {
  const { user } = useUser();
  const [brands, setBrands] = useState<any[]>([]);
  const [ranks, setRanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isRankDialogOpen, setIsRankDialogOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any | null>(null);
  const [newRankId, setNewRankId] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [brandsData, ranksData] = await Promise.all([
          getBrands(),
          getRanks(),
        ]);
        setBrands(brandsData);
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
    if (!selectedBrand || !newRankId) return;

    setActionLoading("updating-rank");
    try {
      await updateBrandRank(selectedBrand.id, newRankId);
      setBrands((prev) =>
        prev.map((b) =>
          b.id === selectedBrand.id
            ? {
                ...b,
                rankId: newRankId,
                rank: ranks.find((r) => r.id === newRankId),
              }
            : b,
        ),
      );
      setIsRankDialogOpen(false);
      setSelectedBrand(null);
    } catch (error) {
      console.error("Failed to update rank:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteBrand = async (brandId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this brand? This will also remove ALL their orders. This action cannot be undone.",
      )
    )
      return;

    setActionLoading(brandId);
    try {
      await deleteBrand(brandId);
      setBrands((prev) => prev.filter((b) => b.id !== brandId));
    } catch (error) {
      console.error("Failed to delete brand:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const getRankStyles = (rankName: string) => {
    switch (rankName.toUpperCase()) {
      case "PLATINUM":
        return "bg-slate-50 text-slate-600 border-slate-300";
      case "GOLD":
        return "bg-amber-50 text-amber-600 border-amber-300";
      case "SILVER":
        return "bg-zinc-50 text-zinc-600 border-zinc-300";
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
            <UserCircle className='w-4 h-4' />
            <span>Brand Registry</span>
          </div>
          <h1 className='text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70'>
            Partners & Brands
          </h1>
          <p className='text-muted-foreground text-lg'>
            Manage brand partnerships and their system access.
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <div className='relative group'>
            <Search className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' />
            <input
              type='text'
              placeholder='Search brands...'
              className='pl-9 pr-4 py-2 rounded-xl bg-muted/40 border border-border/50 focus:outline-none w-64 text-sm transition-all'
            />
          </div>
        </div>
      </div>

      <Separator className='opacity-50' />

      {loading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[1, 2].map((i) => (
            <div
              key={i}
              className='h-64 w-full animate-pulse bg-muted rounded-2xl border border-border/50'
            />
          ))}
        </div>
      ) : brands.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {brands.map((brand) => (
            <Card
              key={brand.id}
              className='group relative border-border/50 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 bg-card rounded-2xl flex flex-col h-full'
            >
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <div className='p-3 rounded-2xl bg-primary/5 group-hover:bg-primary/10 transition-colors'>
                    <Package className='w-6 h-6 text-primary' />
                  </div>
                  <button
                    onClick={() => {
                      setSelectedBrand(brand);
                      setNewRankId(brand.rankId);
                      setIsRankDialogOpen(true);
                    }}
                    className='transition-all hover:scale-105 active:scale-95'
                  >
                    <CustomBadge
                      className={cn(
                        "flex items-center gap-1.5 shadow-sm cursor-pointer hover:shadow-md",
                        getRankStyles(brand.rank.name),
                      )}
                    >
                      <Trophy className='w-3 h-3' />
                      {brand.rank.name}
                    </CustomBadge>
                  </button>
                </div>
                <div className='mt-4 space-y-1'>
                  <CardTitle className='text-xl font-bold'>
                    {brand.user?.name || "Brand Partner"}
                  </CardTitle>
                  <CardDescription className='font-mono text-[10px] uppercase tracking-widest'>
                    ID: {brand.id.slice(0, 16)}...
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className='grow space-y-4 pt-0'>
                <div className='flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/20 group-hover:bg-muted/50 transition-colors'>
                  <Mail className='w-4 h-4 text-muted-foreground' />
                  <span className='text-sm font-medium truncate'>
                    {brand.user?.email || "No email provided"}
                  </span>
                </div>
                <div className='flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/20'>
                  <MapPin className='w-4 h-4 text-muted-foreground mt-0.5' />
                  <div className='space-y-1'>
                    <span className='text-[10px] font-bold uppercase text-muted-foreground'>
                      Warehouse Address
                    </span>
                    <p className='text-xs font-medium'>
                      {brand.warehouseAddress}
                    </p>
                  </div>
                </div>

                <div className='p-3 rounded-xl bg-muted/30 border border-border/20'>
                  <div className='flex items-center gap-2 mb-1'>
                    <Phone className='w-3 h-3 text-primary' />
                    <span className='text-[9px] font-bold uppercase text-muted-foreground'>
                      Contact
                    </span>
                  </div>
                  <p className='text-sm font-bold'>{brand.contactNo1}</p>
                </div>

                <div className='pt-4 border-t border-border/40 flex items-center justify-between gap-2'>
                  <div className='grow' />
                  <Button
                    size='sm'
                    variant='ghost'
                    className='text-rose-500 hover:text-rose-700 hover:bg-rose-50'
                    onClick={() => handleDeleteBrand(brand.id)}
                    disabled={actionLoading === brand.id}
                  >
                    {actionLoading === brand.id ? (
                      <Loader2 className='w-3.5 h-3.5 animate-spin' />
                    ) : (
                      <Trash2 className='w-3.5 h-3.5' />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center p-24 bg-muted/20 text-center rounded-3xl border-2 border-dashed'>
          <UserCircle className='w-12 h-12 text-muted-foreground' />
          <h3 className='text-2xl font-bold mt-4'>No brands registered</h3>
        </div>
      )}
      <Dialog open={isRankDialogOpen} onOpenChange={setIsRankDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Change Brand Rank</DialogTitle>
            <DialogDescription>
              Assign a new rank to this brand partner.
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
