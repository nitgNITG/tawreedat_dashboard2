"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/shared/FormField";
import { Card } from "@/components/ui/card";
import { Package, Loader2, Phone, Mail } from "lucide-react";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type LoginMode = "phone" | "email";

const phoneSchema = z.object({
  identifier: z.string().min(6, "Phone number is required"),
  password: z.string().min(1, "Password is required"),
});

const emailSchema = z.object({
  identifier: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof phoneSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<LoginMode>("phone");

  const form = useForm<LoginValues>({
    resolver: zodResolver(mode === "phone" ? phoneSchema : emailSchema),
    defaultValues: { identifier: "", password: "" },
  });

  // Re-validate when switching modes
  const switchMode = (next: LoginMode) => {
    form.reset({ identifier: "", password: "" });
    form.clearErrors();
    setMode(next);
  };

  const handleSubmit = async (values: LoginValues) => {
    setIsLoading(true);
    try {
      const payload =
        mode === "phone"
          ? { phone: values.identifier, password: values.password }
          : { email: values.identifier, password: values.password };

      const response = await authApi.login(payload);
      setAuth(response.user, response.token);
      router.push("/");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm p-8 shadow-lg">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Package className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold">Tawreedat Admin</h1>
          <p className="text-sm text-muted-foreground">Sign in to your dashboard</p>
        </div>

        {/* Mode toggle */}
        <div className="mb-6 flex rounded-lg border border-border p-1">
          <button
            type="button"
            onClick={() => switchMode("phone")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md py-1.5 text-sm font-medium transition-colors",
              mode === "phone"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Phone className="h-3.5 w-3.5" />
            Phone
          </button>
          <button
            type="button"
            onClick={() => switchMode("email")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md py-1.5 text-sm font-medium transition-colors",
              mode === "email"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Mail className="h-3.5 w-3.5" />
            Email
          </button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <TextField
              control={form.control}
              name="identifier"
              label={mode === "phone" ? "Phone Number" : "Email"}
              type={mode === "phone" ? "tel" : "email"}
              placeholder={mode === "phone" ? "+20 1xx xxx xxxx" : "admin@tawreedat.com"}
              required
            />
            <TextField
              control={form.control}
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              required
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
