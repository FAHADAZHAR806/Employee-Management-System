import mongoose, { Schema, Document } from "mongoose";

export interface IEmployee extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: mongoose.Types.ObjectId;
  designation: string;
  salary: number;
  joiningDate: Date;
  status: "Active" | "Inactive" | "On Leave";
  avatar?: string;
}

const EmployeeSchema = new Schema<IEmployee>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    designation: { type: String, required: true },
    salary: { type: Number, required: true },
    joiningDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Active", "Inactive", "On Leave"],
      default: "Active",
    },
    avatar: { type: String },
  },
  { timestamps: true },
);

export default mongoose.models.Employee ||
  mongoose.model<IEmployee>("Employee", EmployeeSchema);
