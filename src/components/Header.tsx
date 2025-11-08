import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { AnimatedLogo } from "./AnimatedLogo";
import { ThemeToggle } from "./ThemeToggle";
import { CreditSystem } from "./CreditSystem";
import { NotificationCenter } from "./NotificationCenter";
import { CommandPalette } from "./CommandPalette";
import { Kbd } from "@/components/ui/kbd";
import { logUserActivity } from "@/utils/activityLogger";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    if (user) {
      await logUserActivity("logout", user.id);
    }
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <AnimatedLogo />
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#solutions" className="text-foreground/80 hover:text-primary transition-colors font-medium relative group">
            Solutions
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="#how-it-works" className="text-foreground/80 hover:text-primary transition-colors font-medium relative group">
            How It Works
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="/jobs" onClick={(e) => { e.preventDefault(); navigate("/jobs"); }} className="text-foreground/80 hover:text-primary transition-colors font-medium cursor-pointer relative group">
            Find Jobs
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="/floor-planner" onClick={(e) => { e.preventDefault(); navigate("/floor-planner"); }} className="text-foreground/80 hover:text-primary transition-colors font-medium cursor-pointer relative group">
            Floor Planner
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="/help" onClick={(e) => { e.preventDefault(); navigate("/help"); }} className="text-foreground/80 hover:text-primary transition-colors font-medium cursor-pointer relative group">
            Help
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="#contact" className="text-foreground/80 hover:text-primary transition-colors font-medium relative group">
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </a>
        </nav>
        
        <div className="flex items-center gap-3">
          {user && (
            <>
              <NotificationCenter />
              <CreditSystem variant="compact" />
            </>
          )}
          <ThemeToggle />
          {user ? (
            <>
              <Button onClick={() => navigate("/dashboard")} variant="ghost" size="sm" className="hover:scale-105 transition-transform">
                Dashboard
              </Button>
              <Button onClick={handleSignOut} variant="outline" size="sm" className="hover:scale-105 transition-transform">
                Sign Out
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate("/auth")} variant="gradient" size="sm" className="hover:scale-105 transition-transform shadow-glow">
              Get Started
            </Button>
          )}
        </div>
      </div>
      <CommandPalette />
    </header>
  );
};

export default Header;
