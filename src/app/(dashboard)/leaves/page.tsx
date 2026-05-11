"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/tables/data-table";

export default function LeaveManagementPage() {
  const columns = [
    { accessorKey: "type", header: "Leave Type" },
    { accessorKey: "range", header: "Duration" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const s = row.original.status;
        return (
          <Badge
            className={`rounded-full font-normal ${
              s === "Approved"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {s}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Time Off</h1>
          <p className="text-zinc-500">
            Request and track your leave balances.
          </p>
        </div>
        <Button className="rounded-xl gap-2 bg-zinc-900 dark:bg-zinc-100">
          <Plus className="w-4 h-4" />
          Request Leave
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Annual", "Sick", "Casual"].map((type) => (
          <Card
            key={type}
            className="border-zinc-200 dark:border-zinc-800 rounded-2xl"
          >
            <CardContent className="p-6">
              <p className="text-sm font-medium text-zinc-500">{type} Leave</p>
              <h3 className="text-2xl font-bold mt-1">12 Days</h3>
              <p className="text-xs text-zinc-400 mt-2">Available Balance</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <DataTable columns={columns} data={mockLeaveData} />
    </div>
  );
}

const mockLeaveData = [
  { type: "Annual", range: "Jun 12 - Jun 15", status: "Approved" },
  { type: "Sick", range: "May 02 - May 03", status: "Approved" },
];
