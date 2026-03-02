import { Outlet, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Leaf, Github, BookOpen, Mail } from "lucide-react";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t bg-muted/30">
        <div className="container py-12">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-primary-foreground">
                  <Leaf className="h-4 w-4" />
                </div>
                <span className="font-bold text-lg">SoilSense</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Advanced platform for soil moisture prediction and species suitability analysis using satellite remote sensing and ML.
              </p>
            </div>

            {/* Platform */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Platform</h4>
              <div className="flex flex-col gap-2">
                <Link to="/data" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Data Overview</Link>
                <Link to="/model" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Model Training</Link>
                <Link to="/predictions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Predictions</Link>
                <Link to="/climate" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Climate Projections</Link>
              </div>
            </div>

            {/* Research */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Research</h4>
              <div className="flex flex-col gap-2">
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Project</Link>
                <a href="https://doi.org/10.1007/s11356-024-35107-7" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Key Reference</a>
                <span className="text-sm text-muted-foreground">Methodology</span>
                <span className="text-sm text-muted-foreground">Publications</span>
              </div>
            </div>

            {/* Technologies */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {["Sentinel-1", "Sentinel-2", "XGBoost", "Random Forest", "CMIP6", "GEE"].map(t => (
                  <span key={t} className="px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground">{t}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © 2024–2026 SoilSense — M.Tech Research Project. Built with React, TypeScript & Tailwind CSS.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://doi.org/10.1007/s11356-024-35107-7" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <BookOpen className="h-4 w-4" />
              </a>
              <span className="text-muted-foreground"><Mail className="h-4 w-4" /></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
