import mongoose, { Schema, Document } from "mongoose";

export interface ISalaryRecord extends Document {
  employeeId: mongoose.Types.ObjectId;
  amount: number;
  bonus: number;
  deductions: number;
  netPayable: number;
  month: string; // e.g., "May 2026"
  status: "Paid" | "Pending" | "Processing";
  paymentDate?: Date;
}

const SalaryRecordSchema = new Schema<ISalaryRecord>(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    amount: { type: Number, required: true },
    bonus: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netPayable: { type: Number, required: true },
    month: { type: String, required: true },
    status: {
      type: String,
      enum: ["Paid", "Pending", "Processing"],
      default: "Pending",
    },
    paymentDate: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.models.SalaryRecord ||
  mongoose.model<ISalaryRecord>("SalaryRecord", SalaryRecordSchema);
