// src/shared/ui/Topbar.tsx
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { Button } from "../button/button";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();
  const redirectToLogin = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-border bg-bg">
      {/* Left: Logo */}
      <div className="font-semibold text-lg">TaskFlow</div>

      {/* Center: Search */}
      <div className="flex-1 max-w-md mx-4 hidden sm:block">
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full px-3 py-2 rounded-md bg-surface border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Right: Theme toggle */}

      <div>
        <Button variant="outline" onClick={redirectToLogin}>
          Logout
        </Button>
      </div>
    </header>
  );
}
