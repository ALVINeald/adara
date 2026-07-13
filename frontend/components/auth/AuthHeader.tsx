import { HeartHandshake } from "lucide-react";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({
  title,
  subtitle,
}: AuthHeaderProps) {
  return (
    <div className="mb-8 text-center">

      {/* Brand Icon */}
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100 shadow-sm">
        <HeartHandshake className="h-8 w-8 text-cyan-700" />
      </div>

      {/* Brand Name */}
      <h1 className="text-4xl font-bold tracking-tight text-cyan-700">
        Adara
      </h1>

      {/* Brand Motto */}
      <p className="mt-2 text-sm text-slate-500">
        A safe place to begin again.
      </p>

      {/* Page Title */}
      <div className="mt-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>

        <p className="mt-3 leading-7 text-slate-600">
          {subtitle}
        </p>
      </div>

    </div>
  );
}