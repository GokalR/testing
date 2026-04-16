"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import type { SupportedLocale } from "@/lib/course-content/types";
import { getLoginCopy } from "@/lib/auth/auth-copy";
import { getAuthHref } from "@/lib/auth/auth-routing";

interface FormState {
  email: string;
  password: string;
}

interface LoginFormProps {
  locale: SupportedLocale;
  callbackUrl?: string;
}

export function LoginForm({ locale, callbackUrl }: LoginFormProps) {
  const router = useRouter();
  const copy = getLoginCopy(locale);
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const destination = callbackUrl ?? "/dashboard";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError(copy.invalidCredentials);
      } else if (result?.ok) {
        router.push(destination);
      } else {
        setError(copy.genericError);
      }
    } catch {
      setError(copy.genericError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="rounded-[var(--edu-radius-lg)] border border-border bg-card p-8 shadow-[var(--shadow-md)]">
          <div className="mb-8 text-center">
            <h1 className="font-heading text-3xl font-bold text-foreground">
              {copy.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {copy.subtitle}
            </p>
          </div>

          {error ? (
            <div className="mb-5 rounded-[var(--edu-radius-sm)] border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                {copy.emailLabel}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder={copy.emailPlaceholder}
                required
                autoComplete="email"
                className="w-full rounded-[var(--edu-radius-md)] border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                {copy.passwordLabel}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder={copy.passwordPlaceholder}
                required
                autoComplete="current-password"
                className="w-full rounded-[var(--edu-radius-md)] border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-[var(--edu-radius-md)] bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? copy.submitLoading : copy.submitIdle}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {copy.footerPrompt}{" "}
            <Link
              href={getAuthHref(locale, "register", callbackUrl)}
              className="font-medium text-primary underline-offset-4 hover:underline transition-colors"
            >
              {copy.footerLinkLabel}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
