"use client";

import { Table } from "@tanstack/react-table";
import { X, Search, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between p-1">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search employees..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="h-10 w-full pl-9 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-1"
          />
        </div>
        {/* Dynamic Filters (Status, Department) would be mapped here */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-10 px-2 lg:px-3 rounded-xl text-zinc-500"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="h-10 rounded-xl gap-2 border-zinc-200 dark:border-zinc-800"
      >
        <Settings2 className="h-4 w-4" />
        View
      </Button>
    </div>
  );
}
