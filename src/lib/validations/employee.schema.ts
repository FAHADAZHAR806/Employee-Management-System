import { z } from "zod";

export const EmployeeSchema = z.object({
  name: z.string().min(3, "Name is required"),
  age: z.coerce.number().min(18, "Must be at least 18"),
  email: z.string().email("Invalid email"),
  employeeId: z.string().min(1, "Employee ID is required"),
  phone: z.string().min(10, "Invalid phone number"),
  salary: z.coerce.number().min(1, "Salary is required"),
  department: z.string().min(1, "Department is required"),
  avatar: z.string().optional(),
  status: z.enum(["Active", "Inactive"]).default("Active"),
});
