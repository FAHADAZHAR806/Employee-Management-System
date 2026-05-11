import mongoose, { Schema, Document } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  code: string; // e.g., "ENG", "MKT", "HR"
  managerId?: mongoose.Types.ObjectId; // Reference to an Employee
  description?: string;
}

const DepartmentSchema = new Schema<IDepartment>(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    managerId: { type: Schema.Types.ObjectId, ref: "Employee" },
    description: { type: String },
  },
  { timestamps: true },
);

export default mongoose.models.Department ||
  mongoose.model<IDepartment>("Department", DepartmentSchema);
