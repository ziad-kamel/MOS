"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getManufacturers } from "@/data-acess/DAO/manDAO";

interface Manufacturer {
  id: string;
  factoryAddress: string;
  limitPerOrder: number;
  rank: {
    name: string;
  };
}

export default function ManufacturerSelector({
  value,
  onValueChange,
  onSelect,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  onSelect?: (manufacturer: Manufacturer) => void;
}) {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = async (open: boolean) => {
    if (open && manufacturers.length === 0) {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getManufacturers();
        // The DAO returns the data directly. We cast it to our interface.
        setManufacturers(data as unknown as Manufacturer[]);
      } catch (err) {
        console.error("Failed to fetch manufacturers:", err);
        setError("Failed to load");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Select
      onOpenChange={handleOpenChange}
      value={value}
      onValueChange={(val) => {
        onValueChange?.(val);
        const selected = manufacturers.find((m) => m.id === val);
        if (selected) {
          onSelect?.(selected);
        }
      }}
      name='manufacturerId'
    >
      <SelectTrigger className='w-full max-w-48'>
        <SelectValue placeholder='Select a manufacturer' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Manufacturers</SelectLabel>
          {isLoading && (
            <SelectItem value='loading' disabled>
              Loading...
            </SelectItem>
          )}
          {error && (
            <SelectItem value='error' disabled>
              {error}
            </SelectItem>
          )}
          {!isLoading && !error && manufacturers.length === 0 && (
            <SelectItem value='none' disabled>
              No manufacturers found
            </SelectItem>
          )}
          {manufacturers.map((m) => (
            <SelectItem key={m.id} value={m.id}>
              {m.factoryAddress} ({m.rank.name}) - Limit: {m.limitPerOrder}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
