import mongoose, { Schema, model, models } from "mongoose";
const AttendanceSchema = new Schema(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    checkIn: { type: Date },
    checkOut: { type: Date },
    status: {
      type: String,
      enum: ["Present", "Absent", "Late"],
      default: "Present",
    },
    location: { type: String }, // Optional: track IP or office branch
  },
  { timestamps: true },
);
