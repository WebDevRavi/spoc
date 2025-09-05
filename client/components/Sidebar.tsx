import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard", roles: ["admin", "staff", "user"] },
  { to: "/map", label: "Map", roles: ["admin", "staff"] },
  { to: "/issues", label: "Issues", roles: ["admin", "staff", "user"] },
  { to: "/departments", label: "Departments", roles: ["admin"] },
  { to: "/analytics", label: "Analytics", roles: ["admin"] },
] as const;

export function Sidebar() {
  const { user } = useAuth();
  const role = user?.role ?? "user";
  return (
    <aside className="h-full w-64 shrink-0 border-r bg-sidebar text-sm">
      <div className="p-4">
        <div className="font-extrabold text-xl tracking-tight">
          <span className="text-primary">SPOC</span> Portal
        </div>
        <p className="mt-1 text-muted-foreground">Civic Issue Reporting</p>
      </div>
      <nav className="mt-2 px-2 space-y-1">
        {links
          .filter((l) => l.roles.includes(role))
          .map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 transition-colors hover:bg-sidebar-accent ${
                  isActive ? "bg-sidebar-accent text-foreground" : "text-foreground"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
      </nav>
    </aside>
  );
}
