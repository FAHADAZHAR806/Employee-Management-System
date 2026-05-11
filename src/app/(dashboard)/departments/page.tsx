"use client";

import { Building2, Users, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DepartmentsPage() {
  // Mock data for visual layout - we'll replace with useSWR or useEffect later
  const departments = [
    { name: "Engineering", code: "ENG", count: 24, payroll: "$2.4M" },
    { name: "Marketing", code: "MKT", count: 12, payroll: "$1.1M" },
    { name: "Human Resources", code: "HR", count: 6, payroll: "$450k" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-zinc-500">Manage your organization's structure.</p>
        </div>
        <Button className="rounded-xl bg-zinc-900 dark:bg-zinc-100">
          Create Department
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <Card
            key={dept.code}
            className="border-zinc-200 dark:border-zinc-800 hover:shadow-premium transition-all rounded-2xl group"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <CardTitle className="text-xl font-bold">{dept.name}</CardTitle>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <Users className="w-4 h-4" />
                  {dept.count} Employees
                </div>
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {dept.payroll} Total
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
