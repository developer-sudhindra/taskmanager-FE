// src/shared/ui/Sidebar.tsx
import { NavLink } from "react-router-dom";

const navItems = [
  { name: "Dashboard", path: "/" },
  { name: "Projects", path: "/projects" },
  { name: "Calendar", path: "/calendar" },
  { name: "Settings", path: "/settings" },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-border p-4">
      <h2 className="text-lg font-bold mb-6">TaskFlow</h2>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm transition ${
                isActive
                  ? "bg-primary text-white"
                  : "text-text hover:bg-surface"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
