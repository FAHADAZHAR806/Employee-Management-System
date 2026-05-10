import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: LucideIcon;
}

export function StatsCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
}: StatsCardProps) {
  return (
    <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <Icon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </div>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              trend === "up"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {change}
          </span>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-zinc-500">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight mt-1">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
