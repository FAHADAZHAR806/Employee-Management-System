import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-white dark:bg-zinc-950">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-4" />
              <h2 className="text-sm font-medium text-zinc-500">Overview</h2>
            </div>
            {/* Global Search / Profile would go here */}
          </header>
          <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
