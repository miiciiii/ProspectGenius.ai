import { useState } from "react";

export function AccountPreferences() {
  const [language, setLanguage] = useState("English");
  const [timeZone, setTimeZone] = useState("GMT+8");

  return (
    <div className="flex flex-col space-y-4 p-4 bg-card rounded-md border border-border">
      <h2 className="text-lg font-medium text-foreground">Account Preferences</h2>
      <div className="flex items-center justify-between">
        <label className="text-sm text-foreground">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border border-border rounded-md px-2 py-1 bg-background"
        >
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
        </select>
      </div>
      <div className="flex items-center justify-between">
        <label className="text-sm text-foreground">Time Zone</label>
        <select
          value={timeZone}
          onChange={(e) => setTimeZone(e.target.value)}
          className="border border-border rounded-md px-2 py-1 bg-background"
        >
          <option>GMT+0</option>
          <option>GMT+8</option>
          <option>GMT-5</option>
        </select>
      </div>
    </div>
  );
}
