"use client";

import { Mail } from "lucide-react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import AuthFooter from "./AuthFooter";

export default function ForgotPasswordForm() {
  return (
    <>
      <form className="space-y-6">

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
              placeholder="you@example.com"
              className="h-14 rounded-xl pl-12"
            />

          </div>

        </div>

        <Button className="h-14 w-full rounded-xl bg-cyan-600 hover:bg-cyan-700">
          Send Reset Link
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