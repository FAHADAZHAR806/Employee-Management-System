"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Search,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Hash,
  Building,
  DollarSign,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { EmployeeModal } from "@/components/dashboard/employee-modal";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const res = await axios.get(
        `/api/employees?search=${search}&page=${page}`,
      );

      setEmployees(res.data.employees || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      toast.error("Failed to load employees");
    }
  }, [search, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleStatus = async (id: string, current: string) => {
    try {
      const next = current === "Active" ? "Inactive" : "Active";
      await axios.patch(`/api/employees/${id}`, { status: next });
      setEmployees((prev: any) =>
        prev.map((e: any) => (e._id === id ? { ...e, status: next } : e)),
      );
      toast.success(`Member status: ${next}`);
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`/api/employees/${id}`);
        toast.success("Employee deleted");
        loadData();
      } catch (error) {
        toast.error("Delete operation failed");
      }
    }
  };

  return (
    <div className="p-8 bg-[#fcfcfc] min-h-screen space-y-8 font-poppins">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic">
          User <span className="text-zinc-200">Management</span>
        </h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              className="pl-12 pr-4 py-3 rounded-2xl bg-zinc-50 border-none text-xs w-72 focus:ring-2 focus:ring-black/5 outline-none"
              placeholder="Find by Name, ID or Email..."
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Button
            onClick={() => {
              setEditData(null);
              setIsModalOpen(true);
            }}
            className="rounded-2xl bg-black h-12 px-8 font-bold text-xs tracking-widest"
          >
            + ADD ENTRY
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {employees.map((emp: any) => (
          <div
            key={emp._id}
            className="bg-white rounded-[2.5rem] p-6 border border-zinc-100 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-5">
                <Avatar className="h-20 w-20 rounded-[2.2rem] border-4 border-zinc-50 shadow-inner">
                  <AvatarImage src={emp.avatar} className="object-cover" />
                  <AvatarFallback className="bg-zinc-50">
                    <UserCircle className="w-10 h-10 text-zinc-200" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-black text-xl text-zinc-900 leading-tight">
                    {emp.name}
                  </h3>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      {emp.status}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400 bg-zinc-50 px-3 py-1 rounded-full flex items-center gap-1">
                      <Building className="w-3 h-3" />{" "}
                      {emp.department?.name || "No Dept"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Switch
                  checked={emp.status === "Active"}
                  onCheckedChange={() => toggleStatus(emp._id, emp.status)}
                  className="data-[state=checked]:bg-emerald-500 scale-90"
                />
                <span
                  className={`text-[9px] font-black uppercase tracking-widest ${emp.status === "Active" ? "text-emerald-500" : "text-zinc-300"}`}
                >
                  {emp.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 bg-zinc-50/50 p-6 rounded-[2rem] border border-zinc-100">
              <div className="space-y-3">
                <p className="text-[11px] font-bold text-zinc-500 flex items-center gap-3 truncate">
                  <Hash className="w-4 h-4 text-zinc-300" /> {emp.employeeId}
                </p>
                <p className="text-[11px] font-bold text-zinc-500 flex items-center gap-3 truncate">
                  <Mail className="w-4 h-4 text-zinc-300" /> {emp.email}
                </p>
                <p className="text-[11px] font-bold text-zinc-500 flex items-center gap-3">
                  <Phone className="w-4 h-4 text-zinc-300" /> {emp.phone}
                </p>
              </div>
              <div className="space-y-3 border-l border-zinc-200/50 pl-6">
                <p className="text-[11px] font-bold text-zinc-500 flex items-center gap-3">
                  Age: {emp.age}
                </p>
                <p className="text-[11px] font-bold text-zinc-500 flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-zinc-300" />{" "}
                  {emp.salary?.toLocaleString()}
                </p>
                <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-all">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditData(emp);
                      setIsModalOpen(true);
                    }}
                    className="h-8 w-8 rounded-lg hover:bg-black hover:text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(emp._id)}
                    className="h-8 w-8 rounded-lg text-rose-400 hover:bg-rose-500 hover:text-white"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm">
        <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-3">
          <Button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            variant="outline"
            className="rounded-2xl h-12 w-24 border-zinc-100 hover:bg-zinc-50"
          >
            Back
          </Button>
          <Button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            variant="outline"
            className="rounded-2xl h-12 w-24 border-zinc-100 hover:bg-zinc-50"
          >
            Next
          </Button>
        </div>
      </div>

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
        initialData={editData}
      />
    </div>
  );
}
