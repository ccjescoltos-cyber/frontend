"use client";

import { useRouter } from "next/navigation";
import { CircleCheck, Fingerprint, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { clearTokens } from "@/lib/auth";
import { CONFIG } from "@/lib/config";

export default function DashboardPage() {
  const router = useRouter();
  const { isChecking } = useAuthGuard({ requireAuth: true });

  if (isChecking) {
    return (
      <main className="dashboard-page flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Verifying session...</p>
      </main>
    );
  }

  const handleLogout = () => {
    clearTokens();
    router.push(CONFIG.ROUTES.LOGIN);
  };

  return (
    <main className="dashboard-page">
      <div className="dashboard-wrap">
        <header className="dashboard-header">
          <div className="portal-lockup">
            <span className="portal-lockup-mark">
              <Fingerprint aria-hidden="true" size={19} strokeWidth={1.8} />
            </span>
            <span>Account portal</span>
          </div>
          <Button variant="outline" className="dashboard-logout" onClick={handleLogout}>
            <LogOut aria-hidden="true" size={16} strokeWidth={1.75} />
            <span>Sign out</span>
          </Button>
        </header>

        <section className="dashboard-intro" aria-labelledby="dashboard-title">
          <p className="dashboard-kicker">Personal area / 01</p>
          <h1 id="dashboard-title" className="dashboard-title">
            Welcome back<span>.</span>
          </h1>
          <p className="dashboard-subtitle">
            Your account is ready. Here&apos;s a quick look at your current access.
          </p>
        </section>

        <div className="dashboard-grid">
          <section className="dashboard-feature" aria-label="Current session">
            <p className="dashboard-feature-kicker">Session / active</p>
            <div>
              <h2 className="dashboard-feature-title">You&apos;re all set.</h2>
              <p className="dashboard-feature-copy">
                You are signed in and can continue using your account.
              </p>
              <div className="dashboard-status">
                <CircleCheck aria-hidden="true" size={15} strokeWidth={1.8} />
                <span>Session active</span>
              </div>
            </div>
            <div className="editorial-orbit" aria-hidden="true">
              <span />
            </div>
          </section>

          <section className="dashboard-details" aria-labelledby="session-details-title">
            <header className="dashboard-details-header">
              <p id="session-details-title" className="dashboard-kicker">
                Session details
              </p>
              <span className="dashboard-details-icon">
                <ShieldCheck aria-hidden="true" size={20} strokeWidth={1.8} />
              </span>
            </header>
            <div>
              <p className="dashboard-detail-label">Authentication state</p>
              <h2 className="dashboard-detail-value">Active</h2>
              <p className="dashboard-detail-note">
                Your JWT session is stored in this browser&apos;s local storage.
              </p>
            </div>
          </section>
        </div>

        <footer className="dashboard-footer">
          <span>Personal area</span>
          <span>Access / active</span>
        </footer>
      </div>
    </main>
  );
}
