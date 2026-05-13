import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    employeeId: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    salary: { type: Number, required: true },
    // Link to Department model
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    avatar: { type: String }, // Stores Base64 string for the image
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Employee ||
  mongoose.model("Employee", EmployeeSchema);
