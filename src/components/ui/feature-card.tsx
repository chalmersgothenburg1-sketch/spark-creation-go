import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
}

const FeatureCard = ({ icon, title }: FeatureCardProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
        {icon}
      </div>
      <span className="font-medium text-foreground">{title}</span>
    </div>
  );
};

export default FeatureCard;