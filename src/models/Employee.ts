import mongoose, { Schema } from "mongoose";

const EmployeeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Link to Auth User
    employeeId: { type: String, required: true, unique: true },
    designation: { type: String, required: true },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    salary: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Active", "Inactive", "On Leave"],
      default: "Active",
    },
    skills: [{ type: String }],
    joiningDate: { type: Date, default: Date.now },
    // Enterprise Details
    emergencyContact: {
      name: String,
      phone: String,
      relation: String,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Employee ||
  mongoose.model("Employee", EmployeeSchema);
