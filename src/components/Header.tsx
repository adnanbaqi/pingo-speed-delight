import { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import PingoLogo from "./PingoLogo";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <PingoLogo className="h-8 w-8" />
          <span className="font-bold text-xl text-gradient">Pingo</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Speed Test
            </Link>
            {/* <Link 
              to="/learn" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Learn
            </Link> */}
            <Link 
              to="/about" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
          </nav>

          <ThemeToggle />

          {/* Mobile Hamburger Icon */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

     {/* Mobile Fullscreen Menu */}
     {menuOpen && (
  <div className="fixed top-16 right-0 w-3/4 h-full z-40 flex flex-col items-center bg-black/90 space-y-8 md:hidden p-6">

    <Link 
      to="/"
      className="text-2xl font-bold text-white hover:text-gray-300 w-full text-center"
      onClick={() => setMenuOpen(false)}
    >
      Speed Test
    </Link>
    {/* <Link 
      to="/learn"
      className="text-2xl font-bold text-white hover:text-gray-300 w-full text-center"
      onClick={() => setMenuOpen(false)}
    >
      Learn
    </Link> */}
    <Link 
      to="/about"
      className="text-2xl font-bold text-white hover:text-gray-300 w-full text-center"
      onClick={() => setMenuOpen(false)}
    >
      About
    </Link>
  </div>
)}
</header>
);
};

export default Header;