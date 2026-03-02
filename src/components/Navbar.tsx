import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, Database, Brain, Map, CloudSun, Info, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  
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
    <nav className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary text-primary-foreground shadow-sm group-hover:shadow-md transition-shadow">
            <Leaf className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-lg tracking-tight leading-none">SoilSense</span>
            <span className="block text-[10px] text-muted-foreground font-medium tracking-wider uppercase">Mine Reclamation Platform</span>
          </div>
          <span className="sm:hidden font-bold text-lg">SoilSense</span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Mobile Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-xl">
          <div className="container py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
