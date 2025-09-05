import { getKPIs, getRecentActivity } from "@/data/mock";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const kpis = getKPIs();
  const recent = getRecentActivity();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">
          City Operations Dashboard
        </h1>
        <p className="text-muted-foreground">
          Monitor reports, progress, and performance at a glance.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Reports"
          value={kpis.total.toString()}
          subtitle="All-time"
        />
        <KpiCard
          title="Resolved"
          value={kpis.resolved.toString()}
          subtitle="Closed & Resolved"
        />
        <KpiCard
          title="Pending"
          value={kpis.pending.toString()}
          subtitle="Open & In Progress"
        />
        <KpiCard
          title="Avg Resolution (hrs)"
          value={kpis.avgResolutionHours.toString()}
          subtitle="Last 30 days"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 lg:col-span-2 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <ActionCard
              to="/issues"
              title="View Issues"
              desc="Manage and filter all reports"
            />
            <ActionCard
              to="/map"
              title="Go to Map"
              desc="Visualize hotspots & routes"
            />
            <ActionCard
              to="/analytics"
              title="View Analytics"
              desc="Download CSV/PDF reports"
            />
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Recent Activity</h2>
          <ul className="space-y-3">
            {recent.map((i) => (
              <li key={i.id} className="rounded-md border p-3 hover:bg-muted">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{i.title}</div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${statusBadge(i.status)}`}
                  >
                    {i.status}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground line-clamp-2">
                  {i.description}
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  {new Date(i.updatedAt).toLocaleString()} • {i.location}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function KpiCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="mt-1 text-3xl font-extrabold tracking-tight">{value}</div>
      <div className="text-xs text-muted-foreground">{subtitle}</div>
    </div>
  );
}

function ActionCard({
  to,
  title,
  desc,
}: {
  to: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      to={to}
      className="group rounded-xl border p-4 transition-colors hover:bg-secondary"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-muted-foreground">{desc}</div>
        </div>
        <span className="text-2xl transition-transform group-hover:translate-x-1">
          →
        </span>
      </div>
    </Link>
  );
}

function statusBadge(status: string) {
  switch (status) {
    case "open":
      return "bg-secondary text-foreground";
    case "in_progress":
      return "bg-accent text-accent-foreground";
    case "resolved":
      return "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200";
    case "closed":
      return "bg-muted text-foreground";
    default:
      return "bg-muted";
  }
}
