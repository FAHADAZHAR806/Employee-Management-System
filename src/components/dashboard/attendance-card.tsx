"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Fingerprint,
  Clock,
  CheckCircle2,
  Loader2,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function AttendanceCard({ employeeId }: { employeeId: string }) {
  const [status, setStatus] = useState<
    "idle" | "checked-in" | "checked-out" | "loading"
  >("loading");
  const [times, setTimes] = useState<{ in: string | null; out: string | null }>(
    { in: null, out: null },
  );

  const fetchStatus = async () => {
    try {
      const { data } = await axios.get(
        `/api/attendance/status?employeeId=${employeeId}`,
      );
      if (data.checkedOut) {
        setStatus("checked-out");
      } else if (data.checkedIn) {
        setStatus("checked-in");
      } else {
        setStatus("idle");
      }
      setTimes({
        in: data.checkIn
          ? new Date(data.checkIn).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : null,
        out: data.checkOut
          ? new Date(data.checkOut).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : null,
      });
    } catch (error) {
      setStatus("idle");
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [employeeId]);

  const handleAction = async (type: "in" | "out") => {
    const endpoint =
      type === "in" ? "/api/attendance/check-in" : "/api/attendance/check-out";
    const method = type === "in" ? "post" : "patch";

    try {
      setStatus("loading");
      await axios[method](endpoint, { employeeId });
      toast.success(
        type === "in" ? "Check-in successful" : "Check-out successful",
      );
      fetchStatus();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Action failed");
      fetchStatus();
    }
  };

  if (status === "loading")
    return (
      <div className="p-10 text-center">
        <Loader2 className="animate-spin mx-auto" />
      </div>
    );

  return (
    <div className="flex flex-col items-center space-y-6 py-4">
      {/* Visual Indicator */}
      <div
        className={cn(
          "h-24 w-24 rounded-full flex items-center justify-center border-4 transition-all duration-500 shadow-inner",
          status === "checked-in"
            ? "border-amber-500/20 bg-amber-50"
            : status === "checked-out"
              ? "border-emerald-500/20 bg-emerald-50"
              : "border-zinc-100 bg-zinc-50",
        )}
      >
        {status === "idle" && (
          <Fingerprint className="h-10 w-10 text-zinc-400" />
        )}
        {status === "checked-in" && (
          <Clock className="h-10 w-10 text-amber-500 animate-pulse" />
        )}
        {status === "checked-out" && (
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        )}
      </div>

      <div className="text-center">
        <h3 className="text-lg font-black tracking-tight uppercase">
          {status === "idle" && "Ready to Start?"}
          {status === "checked-in" && "Shift in Progress"}
          {status === "checked-out" && "Shift Completed"}
        </h3>
        <div className="text-[10px] font-bold text-zinc-400 uppercase mt-1 tracking-widest space-y-1">
          {times.in && <div>In: {times.in}</div>}
          {times.out && <div>Out: {times.out}</div>}
        </div>
      </div>

      {status === "idle" && (
        <Button
          onClick={() => handleAction("in")}
          className="w-full h-12 rounded-2xl bg-black text-white font-black text-[10px] tracking-widest uppercase"
        >
          Punch In
        </Button>
      )}

      {status === "checked-in" && (
        <Button
          onClick={() => handleAction("out")}
          className="w-full h-12 rounded-2xl bg-red-600 text-white font-black text-[10px] tracking-widest uppercase hover:bg-red-700"
        >
          <LogOut className="w-4 h-4 mr-2" /> Punch Out
        </Button>
      )}

      {status === "checked-out" && (
        <div className="w-full p-4 rounded-2xl bg-emerald-50 text-emerald-700 text-center text-[10px] font-black uppercase tracking-widest border border-emerald-100">
          Good work! See you tomorrow.
        </div>
      )}
    </div>
  );
}
