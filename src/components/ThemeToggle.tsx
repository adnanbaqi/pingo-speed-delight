
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  useEffect(() => {
    // Always apply dark theme for AMOLED look
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      aria-label="Toggle dark mode"
    >
      <Moon className="h-5 w-5 text-yellow-300" />
    </Button>
  );
};

export default ThemeToggle;
