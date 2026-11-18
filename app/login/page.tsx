"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { apiClient } from "@/lib/api";
import { setTokens } from "@/lib/auth";
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
import { ArrowRight, KeyRound } from "lucide-react";

interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { isChecking } = useAuthGuard({ requireAuth: false });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isChecking) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiClient<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      setTokens(data.accessToken, data.refreshToken);
      router.push(CONFIG.ROUTES.DASHBOARD);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      section="01 / Returning members"
      heading="Your account, without the noise."
      description="A clear, considered place to sign in and pick up where you left off."
    >
      <Card className="auth-card">
        <CardHeader className="auth-card-header">
          <div className="auth-form-intro">
            <p className="auth-form-kicker">Personal access</p>
            <h2 className="auth-form-title">Sign in.</h2>
            <p className="auth-form-description">
              Enter your details to continue to your account.
            </p>
          </div>
          <div className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
            <KeyRound aria-hidden="true" size={21} strokeWidth={1.8} />
          </div>
        </CardHeader>
        <form onSubmit={handleLogin}>
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
                  placeholder="Your username"
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
                  autoComplete="current-password"
                  placeholder="Your password"
                  required
                  className="auth-input"
                />
              </div>
            </div>
            <Button type="submit" className="auth-submit w-full" disabled={loading}>
              {loading ? "Logging in..." : "Sign in"}
              {!loading && <ArrowRight aria-hidden="true" size={16} strokeWidth={1.75} />}
            </Button>
          </CardContent>
        </form>
        <CardContent className="auth-card-footer">
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href={CONFIG.ROUTES.REGISTER}>
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
