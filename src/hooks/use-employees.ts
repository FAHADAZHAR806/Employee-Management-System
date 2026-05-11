import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export function useEmployees() {
  const { data, error, isLoading, mutate } = useSWR("/api/employees", fetcher, {
    revalidateOnFocus: false, // Don't refetch every time user switches tabs
    dedupingInterval: 5000, // Prevent redundant requests within 5s
  });

  return {
    employees: data,
    isLoading,
    isError: error,
    refresh: mutate, // Call this after adding/deleting an employee
  };
}
