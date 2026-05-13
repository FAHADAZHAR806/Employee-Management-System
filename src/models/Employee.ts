import mongoose, { Schema } from "mongoose";

const EmployeeSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    employeeId: { type: String, required: true, unique: true }, // Format: EMP-001
    designation: { type: String, required: true },
    department: { type: String, required: true },
    joiningDate: { type: Date, required: true },
    salary: { type: Number, required: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    avatar: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.models.Employee ||
  mongoose.model("Employee", EmployeeSchema);
