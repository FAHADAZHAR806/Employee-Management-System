"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart3, Users, AlertTriangle, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      const res = await axios.get("/api/admin/reports/summary");
      setData(res.data);
      setLoading(false);
    };
    fetchReports();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center font-bold animate-pulse">
        GENERATING INTELLIGENCE...
      </div>
    );

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">
          Workforce <span className="text-zinc-300">Analytics</span>
        </h1>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
          Efficiency Metrics & Reliability Tracking
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map((emp: any) => (
          <Card
            key={emp.id}
            className="rounded-[2rem] border-zinc-100 shadow-sm overflow-hidden group hover:border-black transition-all"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-black uppercase">
                  {emp.name}
                </CardTitle>
                <span className="text-[9px] font-bold bg-zinc-100 px-2 py-1 rounded-full uppercase">
                  ID: {emp.id}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="text-center p-3 bg-zinc-50 rounded-2xl">
                  <p className="text-[9px] font-bold text-zinc-400 uppercase">
                    Present
                  </p>
                  <p className="text-lg font-black text-zinc-800">
                    {emp.present}
                  </p>
                </div>
                <div className="text-center p-3 bg-zinc-50 rounded-2xl">
                  <p className="text-[9px] font-bold text-zinc-400 uppercase">
                    Leaves
                  </p>
                  <p className="text-lg font-black text-zinc-800">
                    {emp.leaves}
                  </p>
                </div>
                <div className="text-center p-3 bg-zinc-50 rounded-2xl">
                  <p className="text-[9px] font-bold text-zinc-400 uppercase">
                    Late
                  </p>
                  <p className="text-lg font-black text-red-500">{emp.late}</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t pt-4 border-zinc-50">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-[10px] font-black uppercase">
                    Reliability Score
                  </span>
                </div>
                <span
                  className={cn(
                    "text-sm font-black",
                    emp.score > 80 ? "text-emerald-500" : "text-amber-500",
                  )}
                >
                  {emp.score}%
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
