"use client";

import React, { useState, useEffect } from "react";
import { Clock, ArrowRightLeft, CheckCircle2 } from "lucide-react";
import { attendanceService } from "@/lib/services/attendanceService";
import { format } from "date-fns"; // npm install date-fns

export function AttendanceCard({ employeeId }: { employeeId: string }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [status, setStatus] = useState<"out" | "in">("out");
  const [loading, setLoading] = useState(false);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAction = async () => {
    setLoading(true);
    try {
      if (status === "out") {
        await attendanceService.clockIn(employeeId);
        setStatus("in");
      } else {
        await attendanceService.clockOut(employeeId);
        setStatus("out");
      }
    } catch (error) {
      console.error("Attendance action failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
            <Clock className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </div>
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Shift Control
          </h3>
        </div>
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
          {format(currentTime, "eee, MMM do")}
        </span>
      </div>

      <div className="text-center py-4">
        <div className="text-4xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-100 mb-1">
          {format(currentTime, "HH:mm:ss")}
        </div>
        <p className="text-zinc-500 text-sm font-light uppercase tracking-widest">
          Current System Time
        </p>
      </div>

      <button
        onClick={handleAction}
        disabled={loading}
        className={`w-full mt-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 ${
          status === "out"
            ? "bg-zinc-900 text-white hover:bg-zinc-800"
            : "bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100"
        }`}
      >
        {status === "out" ? (
          <>
            <ArrowRightLeft className="w-5 h-5" /> Check In for Shift
          </>
        ) : (
          <>
            <CheckCircle2 className="w-5 h-5" /> Clock Out
          </>
        )}
      </button>
    </div>
  );
}
