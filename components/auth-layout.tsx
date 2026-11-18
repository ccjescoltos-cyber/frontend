import { Fingerprint } from "lucide-react";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  section: string;
  heading: string;
  description: string;
}

export function AuthLayout({
  children,
  section,
  heading,
  description,
}: AuthLayoutProps) {
  return (
    <main className="auth-shell">
      <section className="auth-visual" aria-labelledby="auth-visual-title">
        <header className="auth-visual-header">
          <span className="auth-mark">
            <Fingerprint aria-hidden="true" size={20} strokeWidth={1.75} />
          </span>
          <span>Account portal</span>
        </header>

        <div className="auth-visual-copy">
          <p className="auth-overline auth-reveal">{section}</p>
          <h1 id="auth-visual-title" className="auth-visual-title auth-reveal auth-reveal--second">
            {heading}
          </h1>
          <p className="auth-visual-description auth-reveal auth-reveal--third">
            {description}
          </p>
        </div>

        <footer className="auth-visual-footer">
          <span>Personal / Access</span>
          <span>01—02</span>
        </footer>

        <div className="editorial-orbit" aria-hidden="true">
          <span />
        </div>
      </section>

      <section className="auth-main" aria-label="Account form">
        <div className="auth-content auth-reveal">{children}</div>
      </section>
    </main>
  );
}
