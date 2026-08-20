import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Heart,
  MoreHorizontal,
  Sparkles,
  UsersRound,
} from "lucide-react";

const items = [
  { label: "Mood", href: "/mood", icon: Heart },
  { label: "Community", href: "/community", icon: UsersRound },
  { label: "Companion", href: "/companion", icon: Sparkles, center: true },
  { label: "Journal", href: "/journal", icon: BookOpen },
  { label: "More", href: "/more", icon: MoreHorizontal },
];

export default function MobileBottomTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 bottom-0 z-50 md:hidden"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div
        className={[
          "relative w-full overflow-hidden",
          "border-t border-white/70",
          "bg-white/70 backdrop-blur-2xl backdrop-saturate-150",
          "shadow-[0_-12px_40px_rgba(44,30,90,0.10)]",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/45 via-white/20 to-violet-50/35" />

        <div className="relative mx-auto grid h-[74px] max-w-lg grid-cols-5 px-2">
          {items.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="group flex min-w-0 items-center justify-center"
              >
                <span
                  className={[
                    "relative flex h-[62px] w-full max-w-[82px] flex-col items-center justify-center gap-1 rounded-2xl",
                    "transition-all duration-200",
                    active
                      ? "bg-violet-100/75 text-violet-600"
                      : "text-slate-400 hover:bg-white/50 hover:text-slate-600",
                  ].join(" ")}
                >
                  {item.center ? (
                    <span
                      className={[
                        "grid h-11 w-11 place-items-center rounded-full border",
                        "transition-all duration-200",
                        active
                          ? "border-violet-300/80 bg-white/90 text-violet-600 shadow-[0_8px_24px_rgba(109,53,232,0.18)]"
                          : "border-white/80 bg-white/55 text-slate-500",
                      ].join(" ")}
                    >
                      <Icon
                        className={[
                          "h-5 w-5 transition-transform duration-200",
                          active ? "scale-105" : "group-hover:scale-105",
                        ].join(" ")}
                      />
                      {active && (
                        <span className="absolute bottom-1 h-1 w-1 rounded-full bg-violet-600" />
                      )}
                    </span>
                  ) : (
                    <>
                      <Icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.8} />
                      {active && (
                        <span className="absolute bottom-1 h-1 w-1 rounded-full bg-violet-600" />
                      )}
                    </>
                  )}

                  <span
                    className={[
                      "text-[10px] font-medium leading-none",
                      active ? "text-violet-600" : "text-slate-400",
                    ].join(" ")}
                  >
                    {item.label}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
