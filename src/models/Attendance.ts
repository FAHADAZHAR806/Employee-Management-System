import mongoose, { Schema } from "mongoose";

const AttendanceSchema = new Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    checkIn: { type: Date },
    checkOut: { type: Date },
    status: { type: String, enum: ["Present", "Absent", "Late", "Half-Day"] },
  },
  { timestamps: true },
);

export default mongoose.models.Attendance ||
  mongoose.model("Attendance", AttendanceSchema);
