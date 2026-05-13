import Employee from "@/models/Employee";
import { connectToDatabase } from "@/lib/mongodb";
import Department from "@/models/Department"; // Model registration zaroori hai populate ke liye

export class EmployeeService {
  /**
   * GET Single Employee by ID
   * Iska use api/employees/[id]/route.ts mein hota hai
   */
  static async getById(id: string) {
    try {
      await connectToDatabase();
      // findById use karke single document mangwana
      const employee = await Employee.findById(id).populate(
        "department",
        "name",
      );
      return employee;
    } catch (error: any) {
      console.error("❌ Service Error [getById]:", error.message);
      throw new Error("Failed to fetch employee by ID");
    }
  }

  /**
   * GET all employees with Pagination & Search
   */
  static async getAll({
    search = "",
    page = 1,
    limit = 6,
  }: {
    search?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      await connectToDatabase();

      const query = search
        ? {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { employeeId: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ],
          }
        : {};

      const skip = (page - 1) * limit;

      const employees = await Employee.find(query)
        .populate("department", "name")
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });

      const total = await Employee.countDocuments(query);

      return {
        employees,
        totalPages: Math.ceil(total / limit),
        totalEmployees: total,
      };
    } catch (error: any) {
      console.error("❌ Service Error [getAll]:", error.message);
      throw new Error(error.message);
    }
  }

  /**
   * Create a new employee record
   */
  static async create(data: any) {
    try {
      await connectToDatabase();
      return await Employee.create(data);
    } catch (error: any) {
      console.error("❌ Service Error [create]:", error.message);
      throw new Error("Failed to create employee");
    }
  }

  /**
   * Update an existing employee record
   */
  static async update(id: string, data: any) {
    try {
      await connectToDatabase();
      return await Employee.findByIdAndUpdate(id, data, { new: true });
    } catch (error: any) {
      console.error("❌ Service Error [update]:", error.message);
      throw new Error("Failed to update employee");
    }
  }

  /**
   * Delete an employee record
   */
  static async delete(id: string) {
    try {
      await connectToDatabase();
      return await Employee.findByIdAndDelete(id);
    } catch (error: any) {
      console.error("❌ Service Error [delete]:", error.message);
      throw new Error("Failed to delete employee");
    }
  }
}
