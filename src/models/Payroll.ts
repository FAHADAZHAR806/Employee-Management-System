import mongoose, { Schema } from "mongoose";

const PayrollSchema = new Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    month: { type: String, required: true }, // e.g., "April 2026"
    basicSalary: { type: Number, required: true },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netSalary: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
    paymentDate: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.models.Payroll ||
  mongoose.model("Payroll", PayrollSchema);
