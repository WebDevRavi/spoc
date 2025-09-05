import { useI18n } from "@/context/I18nContext";
import { useAuth } from "@/context/AuthContext";
import { getNotifications, markAllNotificationsRead } from "@/data/mock";
import { useEffect, useMemo, useState } from "react";

export function Topbar() {
  const { locale, setLocale } = useI18n();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(getNotifications());

  useEffect(() => {
    const id = setInterval(() => setNotifications(getNotifications()), 2000);
    return () => clearInterval(id);
  }, []);

  const unread = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  return (
    <header className="h-14 border-b bg-background">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="font-semibold">{user ? `Welcome, ${user.username}` : ""}</div>
        <div className="flex items-center gap-2">
          <button
            aria-label="toggle theme"
            className="rounded-md border px-2 py-1 hover:bg-muted"
            onClick={() => document.documentElement.classList.toggle("dark")}
          >
            🌗
          </button>
          <select
            aria-label="language"
            className="rounded-md border px-2 py-1 bg-background"
            value={locale}
            onChange={(e) => setLocale(e.target.value as any)}
          >
            <option value="en">EN</option>
            <option value="hi">HI</option>
          </select>
          <div className="relative">
            <button
              className="rounded-md border px-3 py-1 hover:bg-muted relative"
              onClick={() => {
                setOpen((v) => !v);
                markAllNotificationsRead();
                setNotifications(getNotifications());
              }}
            >
              🔔
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] text-accent-foreground">
                  {unread}
                </span>
              )}
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-80 rounded-md border bg-popover p-2 shadow-lg z-10">
                <div className="mb-1 text-xs font-medium text-muted-foreground">Notifications</div>
                <ul className="max-h-64 overflow-auto space-y-1">
                  {notifications.length === 0 && (
                    <li className="text-sm text-muted-foreground">No notifications</li>
                  )}
                  {notifications.map((n) => (
                    <li key={n.id} className="rounded-md p-2 hover:bg-muted">
                      <div className="text-sm">{n.message}</div>
                      <div className="text-[10px] text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button className="rounded-md border px-3 py-1 hover:bg-muted" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
