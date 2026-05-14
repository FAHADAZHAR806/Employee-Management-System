"use client";

import { AttendanceCard } from "@/components/dashboard/attendance-card";
import { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays, CheckCircle2, XCircle } from "lucide-react";
export default function AttendancePage() {
  const [history, setHistory] = useState([]);
  const employeeId = "USER_ID_FROM_AUTH"; // Aapka session se aane wala ID

  useEffect(() => {
    const fetchHistory = async () => {
      const { data } = await axios.get(
        `/api/attendance/history?employeeId=${employeeId}`,
      );
      setHistory(data);
    };
    fetchHistory();
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">
          Time <span className="text-zinc-300">Tracking</span>
        </h1>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] mt-1">
          Attendance & Shift Management
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Check-in Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-zinc-900 border rounded-[2.5rem] p-2 shadow-xl">
            <AttendanceCard employeeId={employeeId} />
          </div>
        </div>

        {/* Right Side: Recent History */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-5 h-5 text-zinc-400" />
            <h2 className="text-sm font-black uppercase tracking-widest">
              Recent Activity
            </h2>
          </div>

          <div className="space-y-3">
            {history.map((record: any) => (
              <div
                key={record._id}
                className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border rounded-2xl shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-zinc-50 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase">
                      {new Date(record.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                      Shift:{" "}
                      {record.checkIn
                        ? new Date(record.checkIn).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--"}
                      -{" "}
                      {record.checkOut
                        ? new Date(record.checkOut).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Active"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full uppercase">
                    {record.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
