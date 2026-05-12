"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Calculator } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* -------------------------------------------------------------------------- */
/*                                  SCHEMA                                    */
/* -------------------------------------------------------------------------- */

export const payrollSchema = z.object({
  employeeId: z.string().min(1, "Please select an employee"),
  month: z.string().min(1, "Month is required"),

  allowances: z.number().min(0, "Must be 0 or greater"),
  deductions: z.number().min(0, "Must be 0 or greater"),
});

export type PayrollFormValues = z.infer<typeof payrollSchema>;

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

interface Employee {
  _id: string;
  name: string;
  employeeId: string;
}

interface Props {
  onRefresh: () => void;
}

/* -------------------------------------------------------------------------- */
/*                              COMPONENT                                     */
/* -------------------------------------------------------------------------- */

export function GeneratePayrollModal({ onRefresh }: Props) {
  const [open, setOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PayrollFormValues>({
    resolver: zodResolver(payrollSchema),

    defaultValues: {
      employeeId: "",
      month: "",
      allowances: 0,
      deductions: 0,
    },
  });

  /* ---------------------------- Fetch Employees --------------------------- */

  useEffect(() => {
    if (!open) return;

    const fetchEmployees = async () => {
      try {
        const res = await axios.get("/api/employees");
        setEmployees(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEmployees();
  }, [open]);

  /* ----------------------------- Submit Form ------------------------------ */

  const onSubmit = async (values: PayrollFormValues) => {
    try {
      setIsSubmitting(true);

      await axios.post("/api/payroll", values);

      form.reset();
      setOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Payroll generation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ------------------------------------------------------------------------ */

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-2.5 font-medium text-white transition hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900">
          <Calculator className="h-4 w-4" />
          Generate Payroll
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Run Payroll</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            {/* Employee */}
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Employee</FormLabel>

                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose employee" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp._id} value={emp._id}>
                          {emp.name} ({emp.employeeId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Month */}
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payroll Month</FormLabel>

                  <FormControl>
                    <Input type="month" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Allowances */}
            <FormField
              control={form.control}
              name="allowances"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allowances</FormLabel>

                  <FormControl>
                    <Input
                      type="number"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Deductions */}
            <FormField
              control={form.control}
              name="deductions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deductions</FormLabel>

                  <FormControl>
                    <Input
                      type="number"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-zinc-900 py-3 font-bold text-white transition hover:bg-zinc-800 disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : "Confirm & Generate"}
            </button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
