import axios from "axios";

export const attendanceService = {
  checkStatus: (employeeId: string) =>
    axios.get(`/api/attendance/${employeeId}`),
  clockIn: (employeeId: string) =>
    axios.post("/api/attendance/clock-in", { employeeId }),
  clockOut: (employeeId: string) =>
    axios.post("/api/attendance/clock-out", { employeeId }),
};
