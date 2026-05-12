import * as z from "zod";

export const leaveSchema = z.object({
  leaveType: z.enum(["Sick", "Casual", "Annual", "Unpaid"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  reason: z.string().min(10, "Please provide a reason (min 10 chars)"),
});

export type LeaveFormValues = z.infer<typeof leaveSchema>;
