"use client";

import React, { useState, useEffect, useCallback } from "react";
import { columns } from "./columns"; // Ensure this matches your filename
import { employeeService } from "@/lib/services/employeeService";
import { AddEmployeeModal } from "../../../components/dashboard/add-employee-modal";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function EmployeesPage() {
  const [data, setData] = useState([]);

  // Memoized fetch function to prevent unnecessary re-renders
  const refreshData = useCallback(() => {
    employeeService
      .getAll()
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to fetch employees:", err));
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-8 py-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-poppins">
            Team Members
          </h1>
          <p className="text-zinc-500 mt-1 text-lg font-light">
            Manage your global workforce and their roles.
          </p>
        </div>

        {/* This replaces your static button with the functional shadcn modal */}
        <AddEmployeeModal onRefresh={refreshData} />
      </div>

      {/* TanStack Table Section */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs uppercase font-bold tracking-widest py-5 px-6 text-zinc-500"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
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
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-zinc-500 font-light"
                >
                  No employees found. Start by adding one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
