"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { useCommunities } from "@/hooks/useCommunities";
import { getProfileNamesByIds } from "@/lib/profiles";

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

export default function NotificationBell() {
  const router = useRouter();
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications(user?.id);
  const { communities } = useCommunities(user?.id);

  const [open, setOpen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [senderNames, setSenderNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const senderIds = Array.from(
      new Set(notifications.map((n) => n.senderId).filter(Boolean))
    ) as string[];

    if (senderIds.length === 0) return;

    getProfileNamesByIds(senderIds).then(({ data }) => {
      const map: Record<string, string> = {};
      (data ?? []).forEach((p: any) => {
        map[p.id] = p.full_name ?? "Someone";
      });
      setSenderNames(map);
    });
  }, [notifications]);

  function communityName(communityId: string | null) {
    return (
      communities.find((c) => c.id === communityId)?.name ?? "a community"
    );
  }

  function handleClick(notificationId: string, communityId: string | null) {
    markAsRead(notificationId);
    setOpen(false);
    if (communityId) {
      router.push(`/communities/${communityId}`);
    }
  }

  function handleMouseLeave() {
    setHovering(false);
    setOpen(false);
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-full bg-white p-3 shadow-md transition hover:shadow-lg"
      >
        <Bell className="h-5 w-5 text-slate-700" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Quick hover preview -- shown before a click, hidden once the full dropdown is open */}
      {hovering && !open && (
        <div className="absolute right-0 z-50 mt-2 whitespace-nowrap rounded-xl bg-slate-900 px-4 py-2 text-xs text-white shadow-lg">
          {notifications.length === 0
            ? "No messages yet"
            : `${unreadCount} unread notification${
                unreadCount === 1 ? "" : "s"
              }`}
        </div>
      )}

      {/* Full dropdown -- opens on click, auto-closes when the mouse leaves this area */}
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-2xl bg-white p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between px-2">
            <p className="text-sm font-semibold text-slate-900">
              Notifications
            </p>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-medium text-cyan-700 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-2 py-4 text-center text-sm text-slate-400">
                No messages yet.
              </p>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() =>
                    handleClick(notification.id, notification.communityId)
                  }
                  className={`block w-full rounded-xl p-3 text-left text-sm transition hover:bg-slate-50 ${
                    notification.read ? "text-slate-500" : "text-slate-900"
                  }`}
                >
                  <p>
                    <span className="font-medium">
                      {notification.senderId
                        ? senderNames[notification.senderId] ?? "Someone"
                        : "Someone"}
                    </span>{" "}
                    sent a message in{" "}
                    <span className="font-medium">
                      {communityName(notification.communityId)}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {timeAgo(notification.createdAt)}
                  </p>
                  {!notification.read && (
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-cyan-600" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}