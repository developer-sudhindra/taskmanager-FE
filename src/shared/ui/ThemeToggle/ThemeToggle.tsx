export default function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const isDark = root.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      className="px-3 py-1 rounded-md border border-border text-sm"
    >
      Toggle
    </button>
  );
}
