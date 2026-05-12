"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
  Check,
  X,
  CalendarDays,
  User,
  Clock,
  Filter,
  Search,
  MoreVertical,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RequestLeaveModal } from "../../../components/dashboard/request-leave-modal";

export default function LeavesPage() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/leaves");
      setLeaves(data);
    } catch (error) {
      console.error("Failed to fetch leaves", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await axios.patch("/api/leaves", { id, status });
      fetchLeaves(); // Refresh the list after action
    } catch (error) {
      console.error("Status update failed", error);
    }
  };

  return (
    <div className="space-y-8 py-4 px-2">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-poppins">
            Leave Management
          </h1>
          <p className="text-zinc-500 text-lg font-light mt-1">
            Track, review, and manage employee time-off requests.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2.5 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all">
            <Filter className="w-5 h-5 text-zinc-500" />
          </button>
          <RequestLeaveModal
            employeeId="current-user-id"
            onRefresh={fetchLeaves}
          />
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Requests",
            count: leaves.length,
            color: "text-zinc-900",
          },
          {
            label: "Pending",
            count: leaves.filter((l: any) => l.status === "Pending").length,
            color: "text-amber-600",
          },
          {
            label: "Approved",
            count: leaves.filter((l: any) => l.status === "Approved").length,
            color: "text-emerald-600",
          },
          {
            label: "Rejected",
            count: leaves.filter((l: any) => l.status === "Rejected").length,
            color: "text-rose-600",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-sm"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {stat.label}
            </p>
            <p className={`text-2xl font-bold ${stat.color} mt-1`}>
              {stat.count}
            </p>
          </div>
        ))}
      </div>

      {/* Main Content: Leave Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-2xl border border-zinc-200"
            />
          ))}
        </div>
      ) : leaves.length === 0 ? (
        <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 rounded-3xl text-zinc-400">
          <Clock className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-lg font-light">No leave applications found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {leaves.map((leave: any) => (
            <div
              key={leave._id}
              className="group bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <Badge
                    variant={
                      leave.status === "Pending"
                        ? "warning"
                        : leave.status === "Approved"
                          ? "success"
                          : "destructive"
                    }
                    className="rounded-lg px-3 py-1 font-medium"
                  >
                    {leave.status}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 dark:bg-zinc-900 px-2 py-1 rounded">
                      {leave.leaveType}
                    </span>
                    <button className="text-zinc-300 hover:text-zinc-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-600 font-bold text-lg">
                    {leave.employeeId?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-zinc-100 text-lg leading-none">
                      {leave.employeeId?.name || "Unknown Employee"}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1.5 font-medium tracking-tight">
                      Emp ID: {leave.employeeId?.employeeId || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 font-medium">
                    <CalendarDays className="w-4 h-4 text-zinc-400" />
                    <span>
                      {format(new Date(leave.startDate), "MMM dd")} —{" "}
                      {format(new Date(leave.endDate), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    <p className="text-zinc-500 italic leading-relaxed">
                      "{leave.reason}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Admins */}
              {leave.status === "Pending" && (
                <div className="flex gap-3 pt-6 mt-6 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    onClick={() => handleStatusUpdate(leave._id, "Approved")}
                    className="flex-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-sm"
                  >
                    <Check className="w-4 h-4" /> Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(leave._id, "Rejected")}
                    className="flex-1 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
