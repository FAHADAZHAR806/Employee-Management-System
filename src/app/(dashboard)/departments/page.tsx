"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Building2,
  Info,
  Search,
  Edit2,
  Trash2,
  MoreHorizontal,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DepartmentModal } from "@/components/dashboard/add-dept-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Fetch Departments
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/departments");
      setDepartments(res.data);
    } catch (error) {
      toast.error("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // 2. Delete Handler
  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this department? This action cannot be undone.",
      )
    )
      return;

    try {
      await axios.delete(`/api/departments/${id}`);
      toast.success("Department deleted successfully");
      fetchDepartments();
    } catch (error) {
      toast.error("Failed to delete department");
    }
  };

  // 3. Edit Handler
  const handleEdit = (dept: any) => {
    setSelectedDept(dept);
    setIsModalOpen(true);
  };

  // Filtered Departments based on Search
  const filteredDepts = departments.filter(
    (d: any) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 bg-zinc-50/50 dark:bg-black/50 min-h-screen">
      {/* --- PREMIUM HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <Building2 className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              Core Infrastructure
            </span>
            z
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight font-poppins text-zinc-900 dark:text-zinc-100">
            Departments
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl text-lg leading-relaxed font-light">
            Manage your organization's structural units, assign strategic
            leadership, and monitor departmental growth. A well-defined
            structure is the foundation of institutional excellence.
          </p>

          <div className="flex items-center gap-2 pt-2 text-[13px] text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 w-fit px-4 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <Info className="h-4 w-4 text-blue-500" />
            <span>
              Changes here synchronize with payroll and resource allocation
              modules.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              setSelectedDept(null);
              setIsModalOpen(true);
            }}
            className="rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xl px-8 py-7 font-bold text-md transition-all hover:scale-[1.03] active:scale-95 group"
          >
            <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            New Department
          </Button>
        </div>
      </div>

      {/* --- SEARCH & FILTERS --- */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search departments..."
            className="pl-10 rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-zinc-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-sm text-zinc-500 font-medium">
          Total: {filteredDepts.length} Units
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array(3)
            .fill(0)
            .map((_, i) => (
              <Card
                key={i}
                className="h-48 rounded-3xl animate-pulse bg-zinc-100 dark:bg-zinc-900 border-none"
              />
            ))
        ) : filteredDepts.length > 0 ? (
          filteredDepts.map((dept: any) => (
            <Card
              key={dept._id}
              className="group relative overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:shadow-2xl hover:shadow-zinc-200/50 dark:hover:shadow-none transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-2xl group-hover:bg-zinc-900 dark:group-hover:bg-zinc-100 transition-colors duration-300">
                    <Briefcase className="h-5 w-5 text-zinc-600 dark:text-zinc-400 group-hover:text-white dark:group-hover:text-zinc-900" />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="rounded-xl w-36"
                    >
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => handleEdit(dept)}
                        className="cursor-pointer"
                      >
                        <Edit2 className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(dept._id)}
                        className="cursor-pointer text-red-500 focus:text-red-500"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {dept.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded text-uppercase tracking-wider">
                      {dept.code}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-sm text-zinc-500 line-clamp-2 min-h-[40px]">
                  {dept.description ||
                    "No description provided for this department."}
                </p>

                <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                      {dept.manager?.name ? dept.manager.name.charAt(0) : "?"}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-tighter">
                        Lead Manager
                      </span>
                      <span className="text-xs font-semibold">
                        {dept.manager?.name || "Unassigned"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center">
              <Building2 className="h-8 w-8 text-zinc-300" />
            </div>
            <h3 className="text-lg font-semibold">No departments found</h3>
            <p className="text-zinc-500">
              Try adjusting your search or create a new unit.
            </p>
          </div>
        )}
      </div>

      {/* --- MODAL --- */}
      <DepartmentModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onSuccess={fetchDepartments}
        editData={selectedDept}
      />
    </div>
  );
}
