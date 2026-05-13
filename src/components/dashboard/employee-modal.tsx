"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export function EmployeeModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: any) {
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    employeeId: "",
    phone: "",
    salary: "",
    department: "",
    avatar: "",
    status: "Active",
  });

  useEffect(() => {
    axios.get("/api/departments").then((res) => setDepartments(res.data));
    if (initialData)
      setFormData({
        ...initialData,
        department: initialData.department?._id || initialData.department,
      });
    else
      setFormData({
        name: "",
        age: "",
        email: "",
        employeeId: "",
        phone: "",
        salary: "",
        department: "",
        avatar: "",
        status: "Active",
      });
  }, [initialData, isOpen]);

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setFormData({ ...formData, avatar: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    // FIX: Data types ko backend ke mutabiq convert karna
    const payload = {
      ...formData,
      age: Number(formData.age),
      salary: Number(formData.salary),
    };

    try {
      if (initialData) {
        await axios.patch(`/api/employees/${initialData._id}`, payload);
      } else {
        await axios.post("/api/employees", payload);
      }
      toast.success("Identity records updated successfully");
      onSuccess();
      onClose();
    } catch (err: any) {
      // FIX: Exact validation error dikhana (e.g. "Age must be at least 18")
      const errorMsg =
        err.response?.data?.details?.age?._errors[0] ||
        err.response?.data?.error ||
        "Update failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl rounded-[3rem] p-10 bg-white border-none shadow-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="font-black text-2xl uppercase italic tracking-tighter">
            Identity <span className="text-zinc-300">Form</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center group">
            <label className="relative h-32 w-32 rounded-[2.5rem] bg-zinc-50 border-4 border-dashed border-zinc-100 flex items-center justify-center cursor-pointer hover:border-black transition-all overflow-hidden">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Camera className="w-10 h-10 text-zinc-200" />
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImage}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-zinc-400 ml-4 tracking-widest">
                Full Identity
              </label>
              <Input
                className="rounded-2xl bg-zinc-50 border-none h-14 px-6"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-zinc-400 ml-4 tracking-widest">
                Age
              </label>
              <Input
                type="number"
                className="rounded-2xl bg-zinc-50 border-none h-14 px-6"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-zinc-400 ml-4 tracking-widest">
                Email Address
              </label>
              <Input
                type="email"
                className="rounded-2xl bg-zinc-50 border-none h-14 px-6"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-zinc-400 ml-4 tracking-widest">
                Employee ID
              </label>
              <Input
                className="rounded-2xl bg-zinc-50 border-none h-14 px-6"
                value={formData.employeeId}
                onChange={(e) =>
                  setFormData({ ...formData, employeeId: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-zinc-400 ml-4 tracking-widest">
                Assigned Department
              </label>
              <select
                className="w-full rounded-2xl bg-zinc-50 border-none h-14 px-6 text-sm outline-none appearance-none"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                required
              >
                <option value="">Select Dept...</option>
                {departments.map((d: any) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-zinc-400 ml-4 tracking-widest">
                Annual Salary
              </label>
              <Input
                type="number"
                className="rounded-2xl bg-zinc-50 border-none h-14 px-6"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1 col-span-2">
              <label className="text-[10px] font-black uppercase text-zinc-400 ml-4 tracking-widest">
                Phone Number
              </label>
              <Input
                className="rounded-2xl bg-zinc-50 border-none h-14 px-6"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-16 rounded-[1.5rem] bg-black font-black text-sm tracking-widest hover:scale-[0.98] transition-all"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "EXECUTE SYSTEM UPDATE"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
