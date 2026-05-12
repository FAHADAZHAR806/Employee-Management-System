import * as z from "zod";

export const payrollSchema = z.object({
  employeeId: z.string().min(1, "Please select an employee"),

  month: z.string().min(1, "Month is required"),

  allowances: z.preprocess(
    (value) => Number(value),
    z.number().min(0, "Allowances must be 0 or greater"),
  ),

  deductions: z.preprocess(
    (value) => Number(value),
    z.number().min(0, "Deductions must be 0 or greater"),
  ),
});

export type PayrollFormValues = z.output<typeof payrollSchema>;
