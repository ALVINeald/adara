"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { resetPasswordForEmail } from "@/lib/auth";
import AuthFooter from "./AuthFooter";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    setLoading(true);
    const { error } = await resetPasswordForEmail(email);
    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center">
        <p className="text-slate-700">
          If an account exists for <strong>{email}</strong>, a password
          reset link has been sent. Check your inbox.
        </p>

        <div className="mt-8">
          <Link
            href="/auth/login"
            className="text-sm font-semibold text-cyan-700 hover:text-cyan-800"
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="space-y-2">

          <label
            htmlFor="email"
            className="text-sm font-medium"
          >
            Email Address
          </label>

          <div className="relative">

            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-14 rounded-xl pl-12"
            />

          </div>

        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-14 w-full rounded-xl bg-cyan-600 hover:bg-cyan-700"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>

      </form>

      <div className="mt-8 text-center">
        <Link
          href="/auth/login"
          className="text-sm font-semibold text-cyan-700 hover:text-cyan-800"
        >
          ← Back to Sign In
        </Link>
      </div>

      <AuthFooter
        text="Remembered your password?"
        linkText="Sign In"
        href="/auth/login"
      />
    </>
  );
}