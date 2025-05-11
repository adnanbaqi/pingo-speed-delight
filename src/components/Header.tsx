
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import PingoLogo from "./PingoLogo";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <PingoLogo className="h-8 w-8" />
          <span className="font-bold text-xl text-gradient">Pingo</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Speed Test
            </Link>
            <Link 
              to="/learn" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Learn
            </Link>
            <Link 
              to="/about" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
          </nav>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
