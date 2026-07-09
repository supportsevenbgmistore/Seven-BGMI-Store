"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartPoint } from "@/types/account";

export function DashboardCharts({
  dailyPosts,
  monthlyPosts,
  monthlySales,
  revenueTrend
}: {
  dailyPosts: ChartPoint[];
  monthlyPosts: ChartPoint[];
  monthlySales: ChartPoint[];
  revenueTrend: ChartPoint[];
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <ChartCard title="Daily Posts">
        <BarChart data={dailyPosts}>
          <defs>
            <linearGradient id="fillDailyPosts" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
              <stop offset="100%" stopColor="#7f1d1d" stopOpacity={0.9} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="name" stroke="#8a8a8a" tickLine={false} axisLine={false} />
          <YAxis stroke="#8a8a8a" tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip accent="#ef4444" />} cursor={{ fill: "rgba(239,68,68,0.08)" }} />
          <Bar dataKey="posts" fill="url(#fillDailyPosts)" radius={[8, 8, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ChartCard>
      <ChartCard title="Monthly Posts">
        <AreaChart data={monthlyPosts}>
          <defs>
            <linearGradient id="fillMonthlyPosts" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#f87171" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="name" stroke="#8a8a8a" tickLine={false} axisLine={false} />
          <YAxis stroke="#8a8a8a" tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip accent="#f87171" />} cursor={{ stroke: "#f87171", strokeWidth: 1 }} />
          <Area type="monotone" dataKey="posts" stroke="#f87171" strokeWidth={2.5} fill="url(#fillMonthlyPosts)" dot={false} />
        </AreaChart>
      </ChartCard>
      <ChartCard title="Monthly Sales">
        <BarChart data={monthlySales}>
          <defs>
            <linearGradient id="fillMonthlySales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb923c" stopOpacity={1} />
              <stop offset="100%" stopColor="#9a3412" stopOpacity={0.9} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="name" stroke="#8a8a8a" tickLine={false} axisLine={false} />
          <YAxis stroke="#8a8a8a" tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip accent="#fb923c" />} cursor={{ fill: "rgba(251,146,60,0.08)" }} />
          <Bar dataKey="sold" fill="url(#fillMonthlySales)" radius={[8, 8, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ChartCard>
      <ChartCard title="Revenue Trend">
        <AreaChart data={revenueTrend}>
          <defs>
            <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="name" stroke="#8a8a8a" tickLine={false} axisLine={false} />
          <YAxis stroke="#8a8a8a" tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip accent="#fbbf24" />} cursor={{ stroke: "#fbbf24", strokeWidth: 1 }} />
          <Area type="monotone" dataKey="revenue" stroke="#fbbf24" strokeWidth={2.5} fill="url(#fillRevenue)" dot={false} />
        </AreaChart>
      </ChartCard>
    </div>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
  accent
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
  accent: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-lg border bg-black/90 px-3 py-2 text-xs shadow-lg backdrop-blur-sm"
      style={{ borderColor: `${accent}55` }}
    >
      <p className="font-semibold text-slate-300">{label}</p>
      <p className="mt-1 font-bold" style={{ color: accent }}>
        {payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
