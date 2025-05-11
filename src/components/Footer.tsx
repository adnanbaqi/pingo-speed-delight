
import { Github } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-black/40 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Pingo Speed Test
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground">
            Powered by <span className="text-primary font-bold">AIVOLVE</span>
          </span>
          
          <Link to="https://github.com" className="text-muted-foreground hover:text-foreground transition-colors">
            <Github size={18} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
