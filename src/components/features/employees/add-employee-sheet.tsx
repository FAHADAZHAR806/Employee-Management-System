"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  designation: z.string().min(2, "Designation is required"),
  salary: z.coerce.number().positive("Salary must be positive"),
  status: z.string(),
  joiningDate: z.string(),
});

export function AddEmployeeSheet({ open, onOpenChange, onSuccess }: any) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      designation: "",
      salary: 0,
      status: "Active",
      joiningDate: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/employees", values);
      toast.success("Employee added successfully");
      onSuccess(); // Refresh data
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to add employee");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[540px] border-l border-zinc-200 dark:border-zinc-800">
        <SheetHeader className="mb-8">
          <SheetTitle className="text-2xl font-bold tracking-tight">
            Add New Employee
          </SheetTitle>
          <SheetDescription>
            Fill in the details to onboard a new team member.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input {...form.register("firstName")} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input {...form.register("lastName")} className="rounded-xl" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input
              {...form.register("email")}
              type="email"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label>Designation</Label>
            <Input
              {...form.register("designation")}
              className="rounded-xl"
              placeholder="e.g. Senior Software Engineer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Annual Salary ($)</Label>
              <Input
                {...form.register("salary")}
                type="number"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                onValueChange={(v) => form.setValue("status", v)}
                defaultValue="Active"
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-100 dark:border-zinc-900 flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-zinc-900 dark:bg-zinc-100 rounded-xl"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Onboard Employee
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
