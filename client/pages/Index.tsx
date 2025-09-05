import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/I18nContext";
import { getDepartments, type Role } from "@/data/mock";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const { t } = useI18n();
  const { login, register } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user" as Role,
    departmentId: "",
  });
  const [error, setError] = useState<string | null>(null);

  const departments = getDepartments();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.username || !form.email) {
      setError("Please fill all required fields.");
      return;
    }
    try {
      if (mode === "login") {
        const u = await login(form.username, form.email);
        if (!u) {
          setError("Invalid credentials. Try register.");
          return;
        }
      } else {
        await register(
          form.username,
          form.email,
          form.role,
          form.role === "staff" ? form.departmentId || undefined : undefined,
        );
      }
      nav("/dashboard");
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/60 to-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Live demo
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t("app_title")}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            {t("landing_intro")}
          </p>
          <ul className="mt-6 grid gap-3 text-sm text-foreground/80">
            <li className="flex items-start gap-2">
              <span className="mt-1 text-emerald-600">✓</span> Role-based
              access: Admin, Staff, Citizen
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-emerald-600">✓</span> Dashboard KPIs,
              notifications, and quick actions
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-emerald-600">✓</span> Issues table,
              per-issue chat, and exports
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-emerald-600">✓</span> Map with
              clustering and heatmap (placeholder)
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-emerald-600">✓</span> i18n (EN/HI) and
              Dark mode
            </li>
          </ul>
        </div>
        <div>
          <div className="mx-auto w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl">
            <div className="mb-4 grid grid-cols-2 rounded-lg bg-muted p-1 text-sm">
              <button
                className={`rounded-md px-3 py-2 ${mode === "login" ? "bg-background font-medium" : "text-muted-foreground"}`}
                onClick={() => setMode("login")}
              >
                {t("login")}
              </button>
              <button
                className={`rounded-md px-3 py-2 ${mode === "register" ? "bg-background font-medium" : "text-muted-foreground"}`}
                onClick={() => setMode("register")}
              >
                {t("register")}
              </button>
            </div>

            {error && (
              <div className="mb-3 rounded-md border border-destructive/30 bg-destructive/10 p-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground">
                  {t("username")}
                </label>
                <input
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                  value={form.username}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, username: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">
                  {t("email")}
                </label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  required
                />
              </div>
              {mode === "register" && (
                <>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      {t("role")}
                    </label>
                    <div className="mt-1 grid grid-cols-3 gap-2">
                      {(["admin", "staff", "user"] as Role[]).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, role: r }))}
                          className={`rounded-md border px-3 py-2 text-sm ${
                            form.role === r
                              ? "border-primary bg-secondary"
                              : "hover:bg-muted"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  {form.role === "staff" && (
                    <div>
                      <label className="text-sm text-muted-foreground">
                        {t("department")}
                      </label>
                      <select
                        className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                        value={form.departmentId}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            departmentId: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Department</option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}

              <button
                type="submit"
                className="mt-2 w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground shadow hover:opacity-90"
              >
                {mode === "login" ? t("login") : t("register")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
