import mongoose, { Schema, Document } from "mongoose";

export interface IPayroll extends Document {
  employee: mongoose.Types.ObjectId;
  month: number;
  year: number;
  baseSalary: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  status: "Draft" | "Approved" | "Paid";
  paymentDate?: Date;
  transactionId?: string;
}

const PayrollSchema: Schema = new Schema(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    baseSalary: { type: Number, required: true },
    bonus: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netSalary: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Draft", "Approved", "Paid"],
      default: "Draft",
    },
    paymentDate: { type: Date },
    transactionId: { type: String },
  },
  { timestamps: true },
);

// Ensure an employee doesn't get paid twice for the same month/year
PayrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.models.Payroll ||
  mongoose.model<IPayroll>("Payroll", PayrollSchema);
