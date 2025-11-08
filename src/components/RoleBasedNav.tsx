import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building2,
  Users,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Briefcase,
  Ruler,
  Home,
  Menu,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";

export const RoleBasedNav = () => {
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show nav on auth or landing pages
  const hideNav = ["/", "/auth", "/terms", "/help"].includes(location.pathname);

  useEffect(() => {
    loadUserRoles();
  }, []);

  const loadUserRoles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: userRoles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id);

        if (userRoles) {
          setRoles(userRoles.map(r => r.role.toString()));
        }
      }
    } catch (error) {
      console.error("Error loading roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const navItems = [
    {
      role: "hr_manager",
      label: "HR Dashboard",
      path: "/hr-dashboard",
      icon: Users,
    },
    {
      role: "finance_manager",
      label: "Finance",
      path: "/finance-dashboard",
      icon: DollarSign,
    },
    {
      role: "procurement_manager",
      label: "Procurement",
      path: "/procurement-dashboard",
      icon: ShoppingCart,
    },
    {
      role: "sales_manager",
      label: "Sales",
      path: "/sales-dashboard",
      icon: TrendingUp,
    },
    {
      role: "executive",
      label: "Executive",
      path: "/executive-dashboard",
      icon: Briefcase,
    },
    {
      role: "architect",
      label: "Architect",
      path: "/architect-dashboard",
      icon: Ruler,
    },
    {
      role: "home_builder",
      label: "Home Builder",
      path: "/home-builder-dashboard",
      icon: Home,
    },
    {
      role: "employee",
      label: "Employee",
      path: "/employee-dashboard",
      icon: Users,
    },
    {
      role: "admin",
      label: "Admin Panel",
      path: "/admin",
      icon: Shield,
    },
  ];

  const availableNavItems = navItems.filter(item => 
    roles.includes(item.role)
  );

  if (loading || availableNavItems.length === 0 || hideNav) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-sm">
            <Menu className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5 text-sm font-semibold">
            Quick Navigation
          </div>
          <DropdownMenuSeparator />
          {availableNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <DropdownMenuItem
                key={item.path}
                onClick={() => navigate(item.path)}
                className={isActive ? "bg-accent" : ""}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/profile-settings")}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
