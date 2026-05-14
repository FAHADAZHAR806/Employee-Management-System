"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { AttendanceCard } from "@/components/dashboard/attendance-card";
import {
  Users,
  Building2,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  Activity,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Types for better safety
interface DashboardStats {
  totalEmployees: number;
  totalDepartments: number;
  monthlyPayroll: number;
  performanceAvg: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("/api/stats/summary");
        setStats(data);
      } catch (error) {
        console.error("Stats fetch failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // useMemo prevents re-calculation on every render
  const statConfig = useMemo(
    () => [
      {
        title: "Total Employees",
        value: stats?.totalEmployees ?? 0,
        description: "+4 new this month",
        icon: Users,
        trend: "up",
      },
      {
        title: "Departments",
        value: stats?.totalDepartments ?? 0,
        description: "Active units",
        icon: Building2,
        trend: "neutral",
      },
      {
        title: "Monthly Payroll",
        value: `$${(stats?.monthlyPayroll ?? 0).toLocaleString()}`,
        description: "Projected cost",
        icon: CreditCard,
        trend: "up",
      },
      {
        title: "Avg Performance",
        value: `${stats?.performanceAvg ?? 0}%`,
        description: "Company health",
        icon: TrendingUp,
        trend: "up",
      },
    ],
    [stats],
  );

  return (
    <div className="flex-1 space-y-8 bg-transparent">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
            Overview
          </h2>
          <div className="flex items-center text-zinc-500 text-xs font-medium mt-1 uppercase tracking-widest">
            <Calendar className="mr-2 h-3 w-3" />
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-32 w-full rounded-3xl bg-zinc-200/50 dark:bg-zinc-800/50"
                />
              ))
          : statConfig.map((stat, i) => (
              <Card
                key={i}
                className="border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm bg-white dark:bg-zinc-900/50 rounded-3xl overflow-hidden relative group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                    {stat.title}
                  </CardTitle>
                  <div className="h-8 w-8 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center border border-zinc-100 dark:border-zinc-700">
                    <stat.icon className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100">
                    {stat.value}
                  </div>
                  <p className="text-[11px] font-medium text-zinc-500 mt-1 flex items-center gap-1">
                    <ArrowUpRight
                      className={cn(
                        "h-3 w-3",
                        stat.trend === "up"
                          ? "text-emerald-500"
                          : "text-zinc-400",
                      )}
                    />
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        {/* Main Attendance Area */}
        <Card className="lg:col-span-3 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm rounded-3xl bg-white dark:bg-zinc-900/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-zinc-400">
              <Activity className="h-4 w-4" />
              Quick Check-In
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Note: Pass the actual logged-in user ID from your Auth context here */}
            <AttendanceCard employeeId="current-user-id" />
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="lg:col-span-4 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm rounded-3xl bg-white dark:bg-zinc-900/50 overflow-hidden">
          <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/50">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-400">
              System Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {[
                {
                  user: "Ahmad Khan",
                  action: "Registered as Engineer",
                  time: "2 mins ago",
                  color: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]",
                },
                {
                  user: "Finance Team",
                  action: "Generated April Payroll",
                  time: "1 hour ago",
                  color: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
                },
                {
                  user: "Sara Ali",
                  action: "Requested Leave (3 days)",
                  time: "4 hours ago",
                  color: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]",
                },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-4 relative group">
                  <div
                    className={cn(
                      "mt-1.5 h-2 w-2 rounded-full shrink-0 transition-transform group-hover:scale-125",
                      activity.color,
                    )}
                  />
                  <div className="flex-1 space-y-0.5">
                    <p className="text-sm font-bold leading-none text-zinc-900 dark:text-zinc-100">
                      {activity.user}
                    </p>
                    <p className="text-xs font-medium text-zinc-500">
                      {activity.action}
                    </p>
                  </div>
                  <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all border-t border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 rounded-b-3xl">
              View All Activity
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
