import { z } from "zod";

export const PayrollSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  month: z.number().min(1).max(12),
  year: z.number().min(2020),
  baseSalary: z.number().nonnegative(),
  bonus: z.number().nonnegative().default(0),
  deductions: z.number().nonnegative().default(0),
  status: z.enum(["Draft", "Approved", "Paid"]).default("Draft"),
});
