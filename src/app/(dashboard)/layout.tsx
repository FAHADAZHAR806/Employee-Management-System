"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../../components/dashboard/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // This logic cleans up the URL to show a nice title in the header
  // e.g., "/employees" becomes "Employees"
  // e.g., "/" becomes "Overview"
  const getPageTitle = () => {
    if (pathname === "/") return "Overview";
    const segment = pathname.split("/").pop();
    return segment
      ? segment.charAt(0).toUpperCase() + segment.slice(1)
      : "Overview";
  };

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
          {/* 1. Permanent Sidebar */}
          <AppSidebar />

          <main className="flex-1 flex flex-col">
            {/* 2. Dynamic Sticky Header */}
            <header className="h-16 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md sticky top-0 z-30">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" />
                <Separator orientation="vertical" className="h-4" />
                <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 tracking-tight">
                  {getPageTitle()}
                </h2>
              </div>

              {/* Space for future Profile Dropdown or Notifications */}
              <div className="flex items-center gap-4">
                {/* Profile Placeholder */}
              </div>
            </header>

            {/* 3. Main Content Area */}
            <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full flex-1">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
