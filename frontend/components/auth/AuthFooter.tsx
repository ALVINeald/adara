import Link from "next/link";

interface AuthFooterProps {
  text: string;
  linkText: string;
  href: string;
}

export default function AuthFooter({
  text,
  linkText,
  href,
}: AuthFooterProps) {
  return (
    <div className="mt-8 text-center text-sm text-slate-600">
      {text}{" "}
      <Link
        href={href}
        className="font-semibold text-cyan-700 hover:text-cyan-800 transition-colors"
      >
        {linkText}
      </Link>
    </div>
  );
}