'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ChevronDown, 
  ChevronRight, 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
}

const SidebarItem = ({ icon: Icon, label, href, children }: SidebarItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  if (children) {
    return (
      <div className="mb-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors"
        >
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5" />
            <span className="text-sm font-medium">{label}</span>
          </div>
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        {isOpen && (
          <div className="ml-8 mt-1 space-y-1">
            {children.map((child) => {
              const isActive = pathname === child.href;
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className={cn(
                    "block px-4 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors",
                    isActive && "bg-sidebar-accent text-sidebar-primary font-medium"
                  )}
                >
                  {child.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const isActive = pathname === href;
  
  return (
    <Link
      href={href!}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 mb-1 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors",
        isActive && "bg-sidebar-accent text-sidebar-primary font-medium"
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-sidebar-background border-r border-sidebar-border transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
            <h1 className="text-xl font-bold text-sidebar-primary">LTEAdmin</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/" />
            <SidebarItem
              icon={Users}
              label="Cadastros"
              children={[
                { label: "Clientes", href: "/clientes" },
                { label: "Produtos", href: "/produtos" },
                { label: "Pedidos", href: "/pedidos" },
              ]}
            />
          </nav>
        </div>
      </aside>
    </>
  );
};