'use client'

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { Breadcrumb } from "./Breadcrumb";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background w-full">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      
      <div className="lg:pl-64 w-full">
        <Navbar onToggleSidebar={toggleSidebar} />
        
        <main className="p-6">
          <Breadcrumb />
          {children}
        </main>
      </div>
    </div>
  );
};
