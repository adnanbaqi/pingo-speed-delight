
// import { Github } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-black/40 backdrop-blur-md
                       fixed bottom-0 left-0 sm:static z-50">
      <div className="container mx-auto flex flex-col sm:flex-row h-auto sm:h-16 items-center justify-between px-4 py-4 gap-2 text-center sm:text-left">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Pingo Speed Test. All rights reserved.
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground">
            Powered by <span className="text-primary font-bold">AIVOLVE</span>
          </span>
          {/* <Link to="https://github.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github size={18} />
          </Link> */}
        </div>
      </div>
    </footer>
  );
};


export default Footer;
