import mongoose, { Schema, Document } from "mongoose";

export interface IActivityLog extends Document {
  userId: mongoose.Types.ObjectId; // Who did it
  action: string; // e.g., "EMPLOYEE_CREATED", "PAYROLL_RUN"
  targetId?: mongoose.Types.ObjectId; // The affected resource
  details: string; // Human-readable description
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    targetId: { type: Schema.Types.ObjectId },
    details: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.models.ActivityLog ||
  mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);
