"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import { GeneratePayrollModal } from "../../../components/dashboard/generate-payroll-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Define the type for our data
type PayrollRecord = {
  _id: string;
  month: string;
  netSalary: number;
  status: "Pending" | "Paid";
  employeeId?: {
    name: string;
    employeeId: string;
    designation: string;
  };
};

export default function PayrollPage() {
  const [data, setData] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Memoized fetch function to trigger after adding new payroll
  const refreshPayroll = useCallback(() => {
    setLoading(true);
    axios
      .get("/api/payroll")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching payroll:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    refreshPayroll();
  }, [refreshPayroll]);

  // Define Columns with TanStack standards
  const columns = useMemo<ColumnDef<PayrollRecord>[]>(
    () => [
      {
        accessorKey: "employeeId.name",
        header: "Employee",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              {row.original.employeeId?.name || "Unknown"}
            </span>
            <span className="text-xs text-zinc-500">
              {row.original.employeeId?.employeeId || "N/A"}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "month",
        header: "Month",
        cell: ({ row }) => (
          <span className="font-medium text-zinc-600 dark:text-zinc-400">
            {row.original.month}
          </span>
        ),
      },
      {
        accessorKey: "netSalary",
        header: "Net Salary",
        cell: ({ row }) => (
          <span className="font-semibold">
            ${row.original.netSalary.toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <Badge
              variant={status === "Paid" ? "success" : "warning"}
              className="rounded-lg px-3"
            >
              {status}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: () => (
          <button className="text-blue-600 hover:text-blue-700 hover:underline font-semibold text-sm transition-all">
            Download Slip
          </button>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-8 py-4">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-poppins">
            Payroll Management
          </h1>
          <p className="text-zinc-500 text-lg font-light mt-1">
            Review disbursements and track financial history.
          </p>
        </div>

        {/* This component handles the modal and registration logic */}
        <GeneratePayrollModal onRefresh={refreshPayroll} />
      </div>

      {/* Premium Table Container */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs uppercase font-bold tracking-[0.1em] py-5 px-6 text-zinc-400"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-48 text-center text-zinc-400 font-light"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
                    Calculating Payroll Data...
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-48 text-center text-zinc-400 font-light"
                >
                  No payroll records found for this period.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors border-zinc-100 dark:border-zinc-800"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-5 px-6">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
