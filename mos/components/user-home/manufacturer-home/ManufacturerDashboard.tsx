"use client";

import React, { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getManufacturerDashboardData } from "@/data-acess/DAO/subOrderDAO";
import {
  Loader2,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Package,
} from "lucide-react";

const chartConfig = {
  total: {
    label: "Total Orders",
    color: "#2563eb", // Blue
  },
  accepted: {
    label: "Accepted",
    color: "#16a34a", // Green
  },
  rejected: {
    label: "Rejected",
    color: "#dc2626", // Red
  },
} satisfies ChartConfig;

export default function ManufacturerDashboard({
  manufacturerId,
}: {
  manufacturerId: string;
}) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const chartData = await getManufacturerDashboardData(manufacturerId);
        // Format date for display
        const formattedData = chartData.map((d) => ({
          ...d,
          displayDate: new Date(d.date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          }),
        }));
        setData(formattedData);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [manufacturerId]);

  if (loading) {
    return (
      <Card className='w-full h-[400px] flex items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </Card>
    );
  }

  const totals = data.reduce(
    (acc, curr) => ({
      accepted: acc.accepted + curr.accepted,
      rejected: acc.rejected + curr.rejected,
      total: acc.total + curr.total,
    }),
    { accepted: 0, rejected: 0, total: 0 },
  );

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card className='bg-card border-primary/10 shadow-sm'>
          <CardContent className='p-6 flex items-center gap-4'>
            <div className='p-3 rounded-2xl bg-blue-500/10 text-primary '>
              <Package className='w-5 h-5 text-blue-500' />
            </div>
            <div>
              <p className='text-xs font-bold uppercase text-muted-foreground tracking-widest'>
                Total Assigned
              </p>
              <h3 className='text-2xl font-bold'>{totals.total}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className='bg-card border-emerald-500/10 shadow-sm'>
          <CardContent className='p-6 flex items-center gap-4'>
            <div className='p-3 rounded-2xl bg-emerald-500/10 text-emerald-600'>
              <CheckCircle2 className='w-5 h-5' />
            </div>
            <div>
              <p className='text-xs font-bold uppercase text-muted-foreground tracking-widest'>
                Accepted
              </p>
              <h3 className='text-2xl font-bold text-emerald-600'>
                {totals.accepted}
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card className='bg-card border-destructive/10 shadow-sm'>
          <CardContent className='p-6 flex items-center gap-4'>
            <div className='p-3 rounded-2xl bg-destructive/10 text-destructive'>
              <XCircle className='w-5 h-5' />
            </div>
            <div>
              <p className='text-xs font-bold uppercase text-muted-foreground tracking-widest'>
                Rejected
              </p>
              <h3 className='text-2xl font-bold text-destructive'>
                {totals.rejected}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className='w-full bg-card shadow-lg border-primary/10'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-7'>
          <div className='space-y-1.5'>
            <CardTitle className='text-xl font-bold flex items-center gap-2'>
              <TrendingUp className='h-5 w-5 text-primary' />
              Volume Distribution
            </CardTitle>
            <CardDescription>
              Orders overview per day for the last 30 days
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
          <ChartContainer
            config={chartConfig}
            className='aspect-auto h-[300px] w-full'
          >
            <BarChart
              data={data}
              margin={{
                left: 12,
                right: 12,
                bottom: 12,
              }}
            >
              <CartesianGrid
                vertical={true}
                strokeDasharray='3 3'
                className='stroke-muted/30'
              />
              <XAxis
                dataKey='displayDate'
                tickLine={true}
                axisLine={true}
                tickMargin={12}
                minTickGap={32}
                tickFormatter={(value) => value}
              />
              <YAxis
                tickLine={true}
                axisLine={true}
                tickMargin={8}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => value}
                    indicator='dot'
                  />
                }
              />
              <Bar
                dataKey='total'
                fill='var(--color-total)'
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey='accepted'
                fill='var(--color-accepted)'
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey='rejected'
                fill='var(--color-rejected)'
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
