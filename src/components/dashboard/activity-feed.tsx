"use client";

import { UserPlus, CreditCard, Calendar, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const icons: Record<string, any> = {
  EMPLOYEE_CREATED: UserPlus,
  PAYROLL_RUN: CreditCard,
  LEAVE_APPROVED: CheckCircle2,
};

export function ActivityFeed() {
  const activities = [
    {
      id: 1,
      type: "EMPLOYEE_CREATED",
      text: "New employee onboarded: Sarah Chen",
      time: "2h ago",
    },
    {
      id: 2,
      type: "PAYROLL_RUN",
      text: "May 2026 payroll processed for Engineering",
      time: "5h ago",
    },
    {
      id: 3,
      type: "LEAVE_APPROVED",
      text: "Annual leave approved for Marcus Wright",
      time: "Yesterday",
    },
  ];

  return (
    <Card className="col-span-3 border-zinc-200 dark:border-zinc-800 shadow-premium rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base font-medium text-zinc-900 dark:text-zinc-100">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((item) => {
            const Icon = icons[item.type] || Calendar;
            return (
              <div key={item.id} className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {item.text}
                  </p>
                  <p className="text-xs text-zinc-500">{item.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
