"use client";

import {
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  CalendarCheck,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Employees", href: "/dashboard/employees", icon: Users },
  { name: "Departments", href: "/dashboard/departments", icon: Building2 },
  { name: "Payroll", href: "/dashboard/payroll", icon: CreditCard },
  { name: "Attendance", href: "/dashboard/attendance", icon: CalendarCheck },
];

export function AppSidebar() {
  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="border-r border-zinc-200 dark:border-zinc-800"
    >
      <SidebarHeader className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-zinc-900 dark:bg-zinc-100 rounded-lg flex items-center justify-center">
            <span className="text-white dark:text-zinc-900 font-bold text-xl">
              E
            </span>
          </div>
          <span className="font-semibold text-lg tracking-tight group-data-[collapsible=icon]:hidden">
            Enterprise
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Management
          </SidebarGroupLabel>
          <SidebarMenu className="px-3">
            {navigation.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild tooltip={item.name}>
                  <a
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <item.icon className="w-5 h-5 text-zinc-500" />
                    <span className="font-medium text-sm">{item.name}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-sm">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
