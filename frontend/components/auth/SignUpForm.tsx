"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import AuthFooter from "./AuthFooter";

export default function SignUpForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    // Temporary until backend authentication is added
    router.push("/onboarding");
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Name */}

        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium"
          >
            Full Name
          </label>

          <div className="relative">
            <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="h-14 rounded-xl pl-12"
            />
          </div>
        </div>

        {/* Email */}

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

        {/* Password */}

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium"
          >
            Password
          </label>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a secure password"
              className="h-14 rounded-xl pl-12 pr-12"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="h-14 w-full rounded-xl bg-cyan-600 hover:bg-cyan-700"
        >
          Create Account
        </Button>

      </form>

      <div className="my-8 flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-sm text-slate-500">OR</span>
        <Separator className="flex-1" />
      </div>

      <Button
        variant="outline"
        className="h-14 w-full rounded-xl"
      >
        Continue with Google
      </Button>

      <p className="mt-6 text-center text-xs leading-6 text-slate-500">
        By creating an account you agree to our Terms of Service
        and Privacy Policy.
      </p>

      <AuthFooter
        text="Already have an account?"
        linkText="Sign In"
        href="/auth/login"
      />
    </>
  );
}