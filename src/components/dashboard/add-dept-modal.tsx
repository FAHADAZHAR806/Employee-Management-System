"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { departmentSchema } from "@/lib/validations/department";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

// TypeScript Interface for Form
interface DepartmentFormValues {
  name: string;
  code: string;
  description?: string;
  manager?: string;
}

export function DepartmentModal({
  isOpen,
  setIsOpen,
  onSuccess,
  editData = null,
}: any) {
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState([]);

  // Type definition add kar di gayi hai yahan
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      manager: "",
    },
  });

  // Load Managers and Edit Data
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await axios.get("/api/users");
        setManagers(res.data);
      } catch (err) {
        console.error("Failed to load managers");
      }
    };

    if (isOpen) {
      fetchManagers();
      if (editData) {
        // setValue ab error nahi dega kyunki interface defined hai
        setValue("name", editData.name);
        setValue("code", editData.code);
        setValue("description", editData.description || "");
        setValue("manager", editData.manager?._id || "");
      } else {
        reset({ name: "", code: "", description: "", manager: "" });
      }
    }
  }, [isOpen, editData, setValue, reset]);

  const onSubmit = async (data: DepartmentFormValues) => {
    setLoading(true);
    try {
      if (editData) {
        // MongoDB _id check
        const targetId = editData._id || editData.id;
        await axios.put(`/api/departments/${targetId}`, data);
        toast.success("Department updated successfully!");
      } else {
        await axios.post("/api/departments", data);
        toast.success("Department created successfully!");
      }
      setIsOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("AXIOS_ERROR:", error.response?.data);
      toast.error(error.response?.data?.error || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="rounded-2xl sm:max-w-[450px] border-zinc-200 dark:border-zinc-800 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            {editData ? "Edit Department" : "Create New Department"}
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            Configure your organization's units. Managers can be assigned
            optionally.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          {/* Name Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 ml-1">
              Name
            </label>
            <Input
              placeholder="e.g., Engineering"
              {...register("name")}
              className="rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            />
            {errors.name && (
              <p className="text-[10px] text-red-500 ml-1 font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Code Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 ml-1">
              Code
            </label>
            <Input
              placeholder="e.g., ENG-2026"
              {...register("code")}
              className="rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            />
            {errors.code && (
              <p className="text-[10px] text-red-500 ml-1 font-medium">
                {errors.code.message}
              </p>
            )}
          </div>

          {/* Manager Dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 ml-1">
              Assign Manager
            </label>
            <select
              {...register("manager")}
              className="w-full p-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-zinc-500 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">No Manager Assigned</option>
              {managers.map((m: any) => (
                <option key={m._id} value={m._id}>
                  {m.name} ({m.role || "User"})
                </option>
              ))}
            </select>
          </div>

          {/* Description Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 ml-1">
              Description
            </label>
            <Textarea
              placeholder="Optional department overview..."
              {...register("description")}
              className="rounded-xl min-h-[100px] resize-none bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl py-6 font-bold shadow-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition-opacity"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            ) : editData ? (
              "Save Changes"
            ) : (
              "Create Department"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
