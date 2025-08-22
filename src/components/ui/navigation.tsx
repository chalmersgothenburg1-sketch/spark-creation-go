import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
          <Heart className="w-6 h-6 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-foreground">WeCareWell</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8">
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
          <Heart className="w-4 h-4" />
          Home
        </a>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
          ✨ Features
        </a>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
          ⭕ Plans
        </a>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
          💬 Why Us
        </a>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
          ❓ FAQs
        </a>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          ☀️
        </Button>
        <Button variant="hero">Log In</Button>
      </div>
    </nav>
  );
};

export default Navigation;