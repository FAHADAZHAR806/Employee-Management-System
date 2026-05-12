import * as z from "zod";

export const departmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Department code is required (e.g., IT-01)"),
  description: z.string().optional(),
  manager: z.string().optional(),
});
