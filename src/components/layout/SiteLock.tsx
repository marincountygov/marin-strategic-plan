"use client";

import { useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  checkPassword,
  isUnlocked,
  isUnlockedServer,
  markUnlocked,
  subscribeUnlocked,
} from "@/lib/site-lock";
import { siteConfig } from "@/lib/site-config";

/**
 * Gates the whole site behind a password screen for the pre-launch TEST
 * phase. Client-side only — see src/lib/site-lock.ts for exactly what that
 * does and doesn't protect against.
 */
export function SiteLock({ children }: { children: ReactNode }) {
  const unlocked = useSyncExternalStore(subscribeUnlocked, isUnlocked, isUnlockedServer);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setChecking(true);
    const ok = await checkPassword(password);
    setChecking(false);
    if (ok) {
      markUnlocked();
    } else {
      setError(true);
    }
  }

  if (!unlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded-xl bg-card p-8 shadow-xs ring-1 ring-foreground/10"
        >
          <p className="font-product-mono text-xs font-bold tracking-wide text-marin-red-700 uppercase dark:text-marin-red-300">
            Test site
          </p>
          <h1 className="mt-1 font-product-display text-xl font-semibold text-stone-900 dark:text-stone-50">
            {siteConfig.name}
          </h1>
          <p className="mt-2 font-product-body text-sm text-marin-dark-gray dark:text-stone-300">
            This is a pre-launch preview. Enter the password to continue.
          </p>

          <div className="mt-6">
            <Label htmlFor="site-password">Password</Label>
            <Input
              id="site-password"
              type="password"
              autoFocus
              autoComplete="off"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError(false);
              }}
              className="mt-1.5"
              aria-invalid={error}
              aria-describedby={error ? "site-password-error" : undefined}
            />
            {error && (
              <p
                id="site-password-error"
                role="alert"
                className="mt-1.5 font-product-body text-sm text-marin-red-700 dark:text-marin-red-300"
              >
                Incorrect password.
              </p>
            )}
          </div>

          <Button type="submit" className="mt-6 w-full" disabled={checking}>
            {checking ? "Checking…" : "Continue"}
          </Button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
