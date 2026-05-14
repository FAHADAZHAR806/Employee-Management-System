import Payroll from "@/models/Payroll";
import Employee from "@/models/Employee";
import { connectToDatabase } from "@/lib/mongodb";

export class PayrollService {
  static async generateMonthlyRun(month: number, year: number) {
    await connectToDatabase();
    const employees = await Employee.find({ status: "Active" });

    const records = employees.map((emp) => ({
      employee: emp._id,
      month,
      year,
      baseSalary: emp.salary,
      netSalary: emp.salary, // Initially net = base
      status: "Draft",
    }));

    try {
      return await Payroll.insertMany(records, { ordered: false });
    } catch (e) {
      // Catch duplicate key errors if run is triggered twice
      return { message: "Some records already existed and were skipped." };
    }
  }

  static async getPayrollHistory(employeeId: string) {
    await connectToDatabase();
    return await Payroll.find({ employee: employeeId }).sort({
      year: -1,
      month: -1,
    });
  }
}
