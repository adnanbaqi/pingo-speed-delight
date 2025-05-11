
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import PingoLogo from "./PingoLogo";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <PingoLogo className="h-8 w-8" />
          <span className="font-bold text-xl">Pingo</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/test" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Speed Test
            </Link>
            <a 
              href="#" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </a>
          </nav>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
