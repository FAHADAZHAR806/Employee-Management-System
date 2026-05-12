"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Lock, Mail, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// 1. Validation Schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 2. Form Hook
  const {
    register,
    handleSubmit,
    setValue, // Demo credentials fill karne ke liye
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 3. Submit Handler using Axios
  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/auth/login", data);

      if (response.status === 200) {
        toast.success("Welcome back!", {
          description: "Redirecting to your dashboard...",
        });

        router.push("/");
        router.refresh();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Invalid credentials";
      toast.error("Authentication Failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Demo helper
  const fillDemoCredentials = () => {
    setValue("email", "admin@company.com");
    setValue("password", "admin123");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <Card className="w-full max-w-md border-zinc-200 shadow-premium dark:border-zinc-800 rounded-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Login
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input
                  id="email"
                  placeholder="Enter Email Here"
                  className="pl-10 rounded-xl"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter Password Here "
                  className="pl-10 rounded-xl"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Demo Credentials Suggestion */}
            <div
              onClick={fillDemoCredentials}
              className="flex items-start gap-2 p-3 bg-zinc-100 dark:bg-zinc-900 rounded-xl cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors border border-dashed border-zinc-300 dark:border-zinc-700"
            >
              <Info className="h-4 w-4 mt-0.5 text-zinc-500" />
              <div className="text-xs space-y-1">
                <p className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Click to use Demo Account:
                </p>
                <p className="text-zinc-500">
                  Email: admin@company.com | Pass: admin123
                </p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 py-6 font-bold"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
