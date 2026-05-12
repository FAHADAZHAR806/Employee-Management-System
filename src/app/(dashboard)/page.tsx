"use client";

import React, { useState, useEffect } from "react";
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

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
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

  const statConfig = [
    {
      title: "Total Employees",
      value: stats?.totalEmployees || "0",
      description: "+4 new this month",
      icon: Users,
      trend: "up",
    },
    {
      title: "Departments",
      value: stats?.totalDepartments || "0",
      description: "Active units",
      icon: Building2,
      trend: "neutral",
    },
    {
      title: "Monthly Payroll",
      value: `$${stats?.monthlyPayroll?.toLocaleString() || "0"}`,
      description: "Projected cost",
      icon: CreditCard,
      trend: "up",
    },
    {
      title: "Avg Performance",
      value: `${stats?.performanceAvg || "0"}%`,
      description: "Company health",
      icon: TrendingUp,
      trend: "up",
    },
  ];

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 bg-zinc-50/50 dark:bg-black/50 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-poppins">
            Overview
          </h2>
          <div className="flex items-center text-zinc-500 text-sm mt-1">
            <Calendar className="mr-2 h-4 w-4" />
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-2xl" />
              ))
          : statConfig.map((stat, i) => (
              <Card
                key={i}
                className="border-none shadow-sm bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden relative"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
                    {stat.title}
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <stat.icon className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        {/* Main Attendance Area */}
        <Card className="lg:col-span-3 border-none shadow-sm rounded-3xl bg-white dark:bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-zinc-400" />
              Quick Check-In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceCard employeeId="current-user-id" />
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="lg:col-span-4 border-none shadow-sm rounded-3xl bg-white dark:bg-zinc-900 overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">
              System Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                {
                  user: "Ahmad Khan",
                  action: "Registered as Engineer",
                  time: "2 mins ago",
                  color: "bg-blue-500",
                },
                {
                  user: "Finance Team",
                  action: "Generated April Payroll",
                  time: "1 hour ago",
                  color: "bg-emerald-500",
                },
                {
                  user: "Sara Ali",
                  action: "Requested Leave (3 days)",
                  time: "4 hours ago",
                  color: "bg-amber-500",
                },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-4 relative">
                  <div
                    className={`mt-1.5 h-2 w-2 rounded-full ${activity.color} shrink-0`}
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none text-zinc-900 dark:text-zinc-100">
                      {activity.user}
                    </p>
                    <p className="text-xs text-zinc-500">{activity.action}</p>
                  </div>
                  <div className="text-[10px] font-medium text-zinc-400 uppercase">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors border-t border-zinc-100 dark:border-zinc-800">
              View All Activity
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
