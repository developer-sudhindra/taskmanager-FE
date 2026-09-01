import { useEffect, useState } from "react";
import { getTheme, updateTheme } from "./service";
export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "DARK";
  });

  const toggle = () => {
    const nextTheme = theme === "LIGHT" ? "DARK" : "LIGHT";
    setTheme(nextTheme);
    updateTheme(nextTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "DARK") {
      root.classList.add("DARK");
    } else {
      root.classList.remove("DARK");
    }
    localStorage.setItem("theme", theme.toUpperCase());
  }, [theme]);

  useEffect(() => {
    getTheme()
      .then((response) => response.json())
      .then((response) => {
        setTheme(response.theme.toUpperCase());
      })
      .catch((err) => console.error("Failed to fetch database theme", err));
  }, []);

  return (
    <button
      onClick={toggle}
      className="px-3 py-1 rounded-md border border-border text-sm"
    >
      Toggle
    </button>
  );
}
