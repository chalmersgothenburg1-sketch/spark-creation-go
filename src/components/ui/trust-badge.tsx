import { ReactNode } from "react";

interface TrustBadgeProps {
  icon: ReactNode;
  text: string;
  color?: "success" | "primary" | "emergency";
}

const TrustBadge = ({ icon, text, color = "success" }: TrustBadgeProps) => {
  const colorClasses = {
    success: "bg-success/10 text-success",
    primary: "bg-primary/10 text-primary", 
    emergency: "bg-emergency/10 text-emergency"
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${colorClasses[color].split(' ')[0].replace('/10', '')}`} />
      <span className="text-sm font-medium text-muted-foreground">{text}</span>
    </div>
  );
};

export default TrustBadge;