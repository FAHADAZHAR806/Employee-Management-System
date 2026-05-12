import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export const employeeService = {
  getAll: () => api.get("/employees"),
  create: (data: any) => api.post("/employees", data),
  delete: (id: string) => api.delete(`/employees/${id}`),
};
