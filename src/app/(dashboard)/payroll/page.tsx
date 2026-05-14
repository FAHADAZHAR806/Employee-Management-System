"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Download, Play, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { exportPayrollPdf } from "@/lib/export-pdf"; // Import the utility we created

export default function PayrollLedger() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  const fetchPayroll = async () => {
    try {
      const res = await axios.get("/api/payroll");
      setData(res.data);
    } catch (err) {
      toast.error("Failed to load payroll data");
    } finally {
      setLoading(false);
    }
  };

  const runPayroll = async () => {
    setIsRunning(true);
    const now = new Date();
    try {
      await axios.post("/api/payroll", {
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      });
      toast.success("Payroll run initiated successfully");
      fetchPayroll();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error running payroll");
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b pb-8 border-zinc-100 dark:border-zinc-800 gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-zinc-900 dark:text-zinc-100">
            Financial{" "}
            <span className="text-zinc-300 dark:text-zinc-700">Ledger</span>
          </h1>
          <p className="text-[10px] font-bold text-zinc-400 mt-2 uppercase tracking-[0.2em]">
            Immutable Transaction Logs & Asset Distribution
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="rounded-2xl border-2 font-black text-[10px] tracking-widest uppercase h-12 px-6 hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <Button
            onClick={runPayroll}
            disabled={isRunning}
            className="bg-black dark:bg-white dark:text-black text-white rounded-2xl h-12 px-8 font-black text-[10px] tracking-widest uppercase hover:opacity-90 shadow-xl shadow-zinc-200 dark:shadow-none disabled:opacity-50"
          >
            {isRunning ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2 fill-current" />
            )}
            {isRunning ? "Processing..." : "Execute Run"}
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
            <TableRow className="border-none">
              <TableHead className="text-[10px] font-black uppercase px-8 py-5 text-zinc-400">
                Recipient
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase text-zinc-400">
                Period
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase text-right text-zinc-400">
                Net Amount
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase text-center text-zinc-400">
                Status
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase text-right px-8 text-zinc-400">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? // Skeleton Loading State
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="px-8 py-6">
                        <Skeleton className="h-10 w-40 rounded-lg" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-20 ml-auto" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16 mx-auto rounded-full" />
                      </TableCell>
                      <TableCell className="px-8">
                        <Skeleton className="h-9 w-9 ml-auto rounded-xl" />
                      </TableCell>
                    </TableRow>
                  ))
              : data.map((item: any) => (
                  <TableRow
                    key={item._id}
                    className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30 transition-colors border-zinc-50 dark:border-zinc-900"
                  >
                    <TableCell className="px-8 font-bold py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-zinc-800 dark:text-zinc-200">
                          {item.employee?.name || "Deleted Employee"}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-medium tracking-tight">
                          ID: {item.employee?.employeeId || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-zinc-500 tabular-nums">
                      {item.month}/{item.year}
                    </TableCell>
                    <TableCell className="text-right font-black text-sm tabular-nums text-zinc-900 dark:text-zinc-100">
                      ${item.netSalary?.toLocaleString() || "0.00"}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={cn(
                          "text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter",
                          item.status === "Paid"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500",
                        )}
                      >
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={!item.employee}
                        onClick={() => exportPayrollPdf(item)}
                        className="h-9 w-9 rounded-xl hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all group"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>

        {!loading && data.length === 0 && (
          <div className="p-20 text-center">
            <p className="text-zinc-400 font-bold text-sm uppercase tracking-widest">
              No transaction logs found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper for conditional classes
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
