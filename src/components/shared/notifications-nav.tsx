"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function NotificationsNav() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <Bell className="h-5 w-5 text-zinc-500" />
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-blue-600 border-2 border-white dark:border-zinc-950" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 rounded-2xl border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden"
        align="end"
      >
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/50">
          <h4 className="text-sm font-semibold">Notifications</h4>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {/* Loop through actual notifications here */}
          <div className="p-4 text-center text-sm text-zinc-500">
            You have 3 unread requests.
          </div>
        </div>
        <div className="p-2 border-t border-zinc-100 dark:border-zinc-900">
          <Button
            variant="ghost"
            className="w-full text-xs font-medium rounded-lg h-8"
          >
            Mark all as read
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
