import { useEffect, useState } from "react";
import { getTheme, updateTheme } from "./service";
export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const toggle = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    console.log(theme, nextTheme, "adsf");
    setTheme(nextTheme);
    updateTheme(nextTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme.toLowerCase());
  }, [theme]);

  useEffect(() => {
    getTheme()
      .then((response) => response.json())
      .then((response) => {
        setTheme(response.theme.toLowerCase());
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
