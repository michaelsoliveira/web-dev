import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

const routeNames: Record<string, string> = {
  "/": "Dashboard",
  "/clientes": "Clientes",
  "/clientes/cadastro": "Cadastro de Cliente",
  "/produtos": "Produtos",
  "/pedidos": "Pedidos",
};

export const Breadcrumb = () => {
  const pathname = usePathname();
    const pathnames = pathname.split("/").filter((x) => x);

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Link
        href="/"
        className={cn(
          "flex items-center hover:text-foreground transition-colors",
          pathname === "/" && "text-foreground font-medium"
        )}
      >
        <Home className="h-4 w-4" />
      </Link>

      {pathnames.map((_, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const routeName = routeNames[routeTo] || pathnames[index];

        return (
          <div key={routeTo} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4" />
            {isLast ? (
              <span className="text-foreground font-medium">{routeName}</span>
            ) : (
              <Link
                href={routeTo}
                className="hover:text-foreground transition-colors"
              >
                {routeName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};
