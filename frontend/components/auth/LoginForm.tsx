"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import AuthFooter from "./AuthFooter";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <form className="space-y-6">

        {/* Email */}

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-slate-700"
          >
            Email Address
          </label>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="h-12 rounded-xl pl-12"
            />
          </div>
        </div>

        {/* Password */}

        <div className="space-y-2">

          <div className="flex items-center justify-between">

            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <Link
              href="/auth/forgot-password"
              className="text-sm text-cyan-700 hover:text-cyan-800"
            >
              Forgot Password?
            </Link>

          </div>

          <div className="relative">

            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="h-12 rounded-xl pl-12 pr-12"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>

          </div>

        </div>

        {/* Sign In */}

        <Button
          className="h-12 w-full rounded-xl bg-cyan-600 text-base font-semibold text-white transition-all duration-300 hover:bg-cyan-700 hover:shadow-lg"
        >
          Sign In
        </Button>

      </form>

      <div className="my-8 flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-sm text-slate-500">OR</span>
        <Separator className="flex-1" />
      </div>

      <Button
        variant="outline"
        className="h-12 w-full rounded-xl"
      >
        <div className="flex items-center justify-center gap-3">
          <svg
            width="18"
            height="18"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.2 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.3l-6.3-5.3c-2.1 1.6-4.6 2.6-7.3 2.6-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.6 39.5 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.3 5.3-6.3 6.7l6.3 5.3C39.9 36.5 44 30.9 44 24c0-1.3-.1-2.3-.4-3.5z"/>
          </svg>

          <span>Continue with Google</span>
        </div>
      </Button>

      <AuthFooter
        text="Don't have an account?"
        linkText="Create Account"
        href="/auth/signup"
      />
    </>
  );
}