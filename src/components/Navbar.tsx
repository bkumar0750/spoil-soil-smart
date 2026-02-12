import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, Database, Brain, Map, CloudSun, Info } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navLinks = [
    { path: "/", label: "Home", icon: Leaf },
    { path: "/data", label: "Data Overview", icon: Database },
    { path: "/model", label: "Model Training", icon: Brain },
    { path: "/predictions", label: "Predictions", icon: Map },
    { path: "/climate", label: "Climate", icon: CloudSun },
    { path: "/about", label: "About", icon: Info },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-xl">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline">Mine Reclamation Platform</span>
          <span className="sm:hidden">MRP</span>
        </Link>
        
        <div className="flex items-center gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Button
                key={link.path}
                asChild
                variant={isActive(link.path) ? "default" : "ghost"}
                size="sm"
                className="transition-all"
              >
                <Link to={link.path} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{link.label}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
