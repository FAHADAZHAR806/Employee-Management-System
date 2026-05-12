"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type Employee = {
  _id: string;
  name: string;
  email: string;
  designation: string;
  department: { name: string };
  status: "Active" | "Inactive" | "On Leave";
};

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "name",
    header: "Employee",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
          {row.original.name}
        </span>
        <span className="text-xs text-zinc-500">{row.original.email}</span>
      </div>
    ),
  },
  {
    accessorKey: "department.name",
    header: "Department",
  },
  {
    accessorKey: "designation",
    header: "Designation",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "Active" ? "success" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },
];
