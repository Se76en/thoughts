"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { FloatingParticles } from "@/components/ui/FloatingParticles";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password) {
      setError("Password is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "Invalid password.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background">
      <FloatingParticles count={16} />

      <div className="relative z-10 w-full max-w-sm px-6">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface">
            <Lock className="h-5 w-5 text-accent" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }}
              placeholder="Password"
              autoFocus
              className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-accent-hover active:scale-[0.97] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
