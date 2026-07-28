import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getMenu } from "./service";

export default function Sidebar() {
  const [menuItems, setMenuItems] = useState([]);
  useEffect(() => {
    getMenu()
      .then((response) => response.json())
      .then((data) => {
        setMenuItems(data.menuItems);
      });
  }, []);

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-surface border-r border-border">
      <h2 className="text-lg font-bold mb-6 p-4 border-b border-border">
        TaskFlow
      </h2>
      <nav className="flex flex-col gap-2 p-4">
        {menuItems.map((item) => (
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
      <div className="mt-auto p-4 border-t border-border">
        <NavLink
          to={"/settings"}
          className={({ isActive }) =>
            `px-3 py-2 rounded-md text-sm transition ${
              isActive ? "bg-primary text-white" : "text-text hover:bg-surface"
            }`
          }
        >
          Settings
        </NavLink>
      </div>
    </aside>
  );
}
