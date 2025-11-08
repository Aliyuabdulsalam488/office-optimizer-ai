import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Home,
  LayoutDashboard,
  Users,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Calendar,
  Database,
  Building2,
  Settings,
  HelpCircle,
  LogOut,
  User,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  const commands = [
    {
      group: "Navigation",
      items: [
        { icon: Home, label: "Home", action: () => navigate("/") },
        { icon: LayoutDashboard, label: "Dashboard", action: () => navigate("/dashboard") },
        { icon: User, label: "Profile Settings", action: () => navigate("/profile-settings") },
        { icon: Settings, label: "Feature Settings", action: () => navigate("/feature-settings") },
      ],
    },
    {
      group: "Dashboards",
      items: [
        { icon: Users, label: "HR Dashboard", action: () => navigate("/hr-dashboard") },
        { icon: DollarSign, label: "Finance Dashboard", action: () => navigate("/finance-dashboard") },
        { icon: ShoppingCart, label: "Procurement Dashboard", action: () => navigate("/procurement-dashboard") },
        { icon: TrendingUp, label: "Sales Dashboard", action: () => navigate("/sales-dashboard") },
        { icon: Calendar, label: "Executive Dashboard", action: () => navigate("/executive-dashboard") },
        { icon: Database, label: "Data Cleaning Dashboard", action: () => navigate("/data-cleaning-dashboard") },
        { icon: Building2, label: "Architect Dashboard", action: () => navigate("/architect-dashboard") },
      ],
    },
    {
      group: "Tools",
      items: [
        { icon: Building2, label: "Floor Planner", action: () => navigate("/floor-planner") },
        { icon: Users, label: "Recruitment", action: () => navigate("/recruitment") },
        { icon: Users, label: "Find Jobs", action: () => navigate("/jobs") },
        { icon: HelpCircle, label: "Help & Support", action: () => navigate("/help") },
      ],
    },
    {
      group: "Account",
      items: [
        {
          icon: LogOut,
          label: "Sign Out",
          action: async () => {
            await supabase.auth.signOut();
            navigate("/auth");
          },
        },
      ],
    },
  ];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {commands.map((group, i) => (
          <div key={group.group}>
            <CommandGroup heading={group.group}>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={item.label}
                    onSelect={() => runCommand(item.action)}
                    className="cursor-pointer"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {i < commands.length - 1 && <CommandSeparator />}
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
};
