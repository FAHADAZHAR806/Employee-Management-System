"use client";

import { CreditCard, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/tables/data-table"; // Reusing our Phase 7 Table

export default function PayrollPage() {
  // Column definitions for TanStack Table
  const columns = [
    {
      accessorKey: "employee",
      header: "Employee",
      cell: ({ row }: any) => (
        <div className="font-medium text-zinc-900 dark:text-zinc-100">
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Base Salary",
      cell: ({ row }: any) => formatCurrency(row.original.amount),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status");
        return (
          <Badge
            className={`rounded-full px-3 py-1 font-normal ${
              status === "Paid"
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-amber-50 text-amber-700 border-amber-100"
            }`}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Invoice",
      cell: () => (
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-500 hover:text-zinc-900"
        >
          <Download className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll</h1>
          <p className="text-zinc-500">
            Manage disbursements and salary history.
          </p>
        </div>
        <Button className="rounded-xl bg-zinc-900 dark:bg-zinc-100 gap-2">
          <CreditCard className="w-4 h-4" />
          Run Payroll
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input placeholder="Search records..." className="pl-10 rounded-xl" />
        </div>
        {/* Filter buttons would go here */}
      </div>

      <DataTable columns={columns} data={mockPayrollData} />
    </div>
  );
}

// Helper for display
const formatCurrency = (val: number) => `$${val.toLocaleString()}`;
const mockPayrollData = [
  { name: "Alice Freeman", amount: 8500, status: "Paid" },
  { name: "Bob Miller", amount: 7200, status: "Pending" },
];
