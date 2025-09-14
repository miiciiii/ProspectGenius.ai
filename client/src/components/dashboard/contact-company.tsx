import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateCompany } from "@/hooks/use-companies";

interface ContactCompanyProps {
  companyId: string;
  companyName: string;
  onClose: () => void;
}

export function ContactCompany({ companyId, companyName, onClose }: ContactCompanyProps) {
  const [to] = useState(`${companyName} <contact@${companyName.toLowerCase().replace(/\s+/g, "")}.com>`);
  const [subject, setSubject] = useState(`Intro: ${companyName}`);
  const [message, setMessage] = useState(
    "Hi, congrats on your recent funding!\n\nWe’d love to connect and explore potential synergies."
  );

  const updateCompanyMutation = useUpdateCompany();

  const handleSend = async () => {
    await updateCompanyMutation.mutateAsync({
      id: companyId,
      updates: { status: "contacted" },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-border">
          <h2 className="text-sm font-medium text-foreground">New Message</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        {/* Body */}
        <div className="px-4 py-3 space-y-3">
          {/* To */}
          <div className="flex items-center space-x-2">
            <span className="w-12 text-sm text-muted-foreground">To</span>
            <Input value={to} disabled className="text-sm" />
          </div>

          {/* Subject */}
          <div className="flex items-center space-x-2">
            <span className="w-12 text-sm text-muted-foreground">Subject</span>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="text-sm"
            />
          </div>

          {/* Message */}
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={10}
            className="text-sm leading-relaxed"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-4 py-3 border-t border-border">
          <Button onClick={handleSend} disabled={updateCompanyMutation.isPending}>
            {updateCompanyMutation.isPending ? "Sending..." : "Send"}
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
