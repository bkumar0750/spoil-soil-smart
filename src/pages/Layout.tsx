import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="border-t mt-20">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>M.Tech Research Project - Soil Moisture Prediction for Mine Reclamation</p>
          <p className="mt-2">Platform built with React, TypeScript, and Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
