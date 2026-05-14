"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Check, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminLeaves() {
  const [requests, setRequests] = useState([]);

  const fetchLeaves = async () => {
    const { data } = await axios.get("/api/leaves/all"); // Make sure to create this GET route
    setRequests(data);
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleStatus = async (leaveId: string, status: string) => {
    try {
      await axios.patch("/api/leaves/status", { leaveId, status });
      toast.success(`Leave ${status} successfully`);
      fetchLeaves();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-black uppercase italic">
        Leave <span className="text-zinc-400">Approvals</span>
      </h1>

      <div className="grid gap-4">
        {requests.map((leave: any) => (
          <div
            key={leave._id}
            className="bg-white border rounded-3xl p-6 flex justify-between items-center shadow-sm"
          >
            <div>
              <p className="font-black text-zinc-800">{leave.employee?.name}</p>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                {leave.leaveType} |{" "}
                {new Date(leave.startDate).toLocaleDateString()} -{" "}
                {new Date(leave.endDate).toLocaleDateString()}
              </p>
              <p className="text-sm mt-2 text-zinc-600 italic">
                "{leave.reason}"
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => handleStatus(leave._id, "Approved")}
                className="bg-emerald-500 hover:bg-emerald-600 rounded-2xl h-10 w-10 p-0"
              >
                <Check className="w-4 h-4 text-white" />
              </Button>
              <Button
                onClick={() => handleStatus(leave._id, "Rejected")}
                variant="destructive"
                className="rounded-2xl h-10 w-10 p-0"
              >
                <X className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
