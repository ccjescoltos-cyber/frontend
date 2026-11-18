"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { apiClient } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/auth-layout";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { ArrowRight, UserRoundPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { isChecking } = useAuthGuard({ requireAuth: false });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isChecking) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiClient("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      router.push(CONFIG.ROUTES.LOGIN);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      section="02 / New members"
      heading="A fresh start, made simple."
      description="Create an account to make this space yours. It only takes a moment."
    >
      <Card className="auth-card">
        <CardHeader className="auth-card-header">
          <div className="auth-form-intro">
            <p className="auth-form-kicker">Get started</p>
            <h2 className="auth-form-title">Create account.</h2>
            <p className="auth-form-description">
              Set up your account with a username and password.
            </p>
          </div>
          <div className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
            <UserRoundPlus aria-hidden="true" size={21} strokeWidth={1.8} />
          </div>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="auth-card-body">
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400"
              >
                {error}
              </div>
            )}
            <div className="auth-fields">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  placeholder="Choose a username"
                  required
                  className="auth-input"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Create a password"
                  required
                  className="auth-input"
                />
              </div>
            </div>
            <Button type="submit" className="auth-submit w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
              {!loading && <ArrowRight aria-hidden="true" size={16} strokeWidth={1.75} />}
            </Button>
          </CardContent>
        </form>
        <CardContent className="auth-card-footer">
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href={CONFIG.ROUTES.LOGIN}>
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
