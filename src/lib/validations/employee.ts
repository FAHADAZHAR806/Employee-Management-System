import * as z from "zod";

export const employeeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  employeeId: z.string().min(3, "ID is required"),
  designation: z.string().min(2, "Designation is required"),
  department: z.string().min(1, "Please select a department"),
  salary: z.coerce.number().min(0, "Salary must be a positive number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
