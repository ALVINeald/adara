"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { updatePassword } from "@/lib/auth";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!password.trim() || !confirmPassword.trim()) {
      alert("Please fill in both fields.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }

    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="h-14 w-14 text-cyan-600" />
        <p className="mt-4 text-slate-700">
          Your password has been updated.
        </p>

        <Link href="/auth/login" className="mt-6 w-full">
          <Button className="h-14 w-full rounded-xl bg-cyan-600 hover:bg-cyan-700">
            Continue to Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          New Password
        </label>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a new password"
            className="h-14 rounded-xl pl-12"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm New Password
        </label>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your new password"
            className="h-14 rounded-xl pl-12"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="h-14 w-full rounded-xl bg-cyan-600 hover:bg-cyan-700"
      >
        {loading ? "Updating..." : "Update Password"}
      </Button>

    </form>
  );
}