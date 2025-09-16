import { useState } from "react";

export function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  return (
    <div className="flex flex-col space-y-4 p-4 bg-card rounded-md border border-border">
      <h2 className="text-lg font-medium text-foreground">Notifications</h2>
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground">Email Notifications</span>
        <input
          type="checkbox"
          checked={emailNotifications}
          onChange={() => setEmailNotifications(!emailNotifications)}
          className="w-5 h-5"
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground">Push Notifications</span>
        <input
          type="checkbox"
          checked={pushNotifications}
          onChange={() => setPushNotifications(!pushNotifications)}
          className="w-5 h-5"
        />
      </div>
    </div>
  );
}
