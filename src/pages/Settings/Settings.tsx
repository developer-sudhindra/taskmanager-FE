import { useState } from "react";
import { UpdateUserName } from "./UserSetting/UserNameUpdate";
import { UserSettings } from "./UserSetting/UserSetting";
import { ThemeSettings } from "./ThemeSetting/ThemeSetting";

type Tab = "name" | "password" | "theme";

export const Settings = () => {
  const [activeTab, setActiveTab] = useState<Tab>("name");

  const tabs = [
    { id: "name", label: "Display Name" },
    { id: "password", label: "Password" },
    { id: "theme", label: "Theme" },
  ] as const;

  return (
    <div className="bg-bg text-text rounded-lg border border-border">
      {/* Top Tab Menu */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-6 py-4 text-sm font-medium transition-colors
              ${
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted hover:text-text"
              }`}
          >
            {tab.label}

            {/* Active indicator */}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "name" && <UpdateUserName />}
        {activeTab === "password" && <UserSettings />}
        {activeTab === "theme" && <ThemeSettings />}
      </div>
    </div>
  );
};
