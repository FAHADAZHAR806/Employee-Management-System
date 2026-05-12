"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DepartmentModal } from "@/components/dashboard/add-dept-modal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);

  const fetchDepts = async () => {
    const res = await axios.get("/api/departments");
    setDepartments(res.data);
  };

  useEffect(() => {
    fetchDepts();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await axios.delete(`/api/departments/${id}`);
      toast.success("Deleted!");
      fetchDepts();
    }
  };

  const handleEdit = (dept: any) => {
    setSelectedDept(dept);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Departments</h1>
        <Button
          onClick={() => {
            setSelectedDept(null);
            setIsModalOpen(true);
          }}
          className="rounded-xl"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Dept
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {departments.map((dept: any) => (
          <Card
            key={dept._id}
            className="p-5 rounded-2xl border-zinc-200 dark:border-zinc-800"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{dept.name}</h3>
                <span className="text-xs text-zinc-400 font-mono">
                  {dept.code}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(dept)}
                >
                  <Edit2 size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500"
                  onClick={() => handleDelete(dept._id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
            <p className="text-sm text-zinc-500 mt-2">{dept.description}</p>
            <div className="mt-4 text-xs text-zinc-400">
              Manager: {dept.manager?.name || "None"}
            </div>
          </Card>
        ))}
      </div>

      <DepartmentModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onSuccess={fetchDepts}
        editData={selectedDept}
      />
    </div>
  );
}
