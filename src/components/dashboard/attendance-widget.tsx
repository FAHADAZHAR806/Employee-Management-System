"use client";

import { useState } from "react";
import { Clock, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export function AttendanceWidget() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAttendance = async () => {
    setLoading(true);
    // Logic: POST to /api/attendance/check-in or check-out
    setTimeout(() => {
      setIsCheckedIn(!isCheckedIn);
      toast.success(
        isCheckedIn ? "Checked out successfully" : "Checked in successfully",
      );
      setLoading(false);
    }, 800);
  };

  return (
    <Card className="border-zinc-200 dark:border-zinc-800 shadow-premium overflow-hidden rounded-2xl">
      <CardContent className="p-0">
        <div className="p-6 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm">
              <Clock className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Attendance
              </p>
              <p className="text-sm font-semibold">Monday, 11 May 2026</p>
            </div>
          </div>
          <Button
            onClick={handleAttendance}
            disabled={loading}
            className={`rounded-xl gap-2 transition-all ${
              isCheckedIn
                ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                : "bg-zinc-900 dark:bg-zinc-100"
            }`}
          >
            {isCheckedIn ? (
              <LogOut className="w-4 h-4" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {isCheckedIn ? "Check Out" : "Check In"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
