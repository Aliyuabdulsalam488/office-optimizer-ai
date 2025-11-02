import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

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
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent cursor-pointer" onClick={() => navigate("/")}>
          Techstora
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#solutions" className="text-foreground/80 hover:text-primary transition-colors font-medium">
            Solutions
          </a>
          <a href="#how-it-works" className="text-foreground/80 hover:text-primary transition-colors font-medium">
            How It Works
          </a>
          <a href="#contact" className="text-foreground/80 hover:text-primary transition-colors font-medium">
            Contact
          </a>
        </nav>
        
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button onClick={() => navigate("/dashboard")} variant="ghost" size="sm">
                Dashboard
              </Button>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                Sign Out
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate("/auth")} variant="gradient" size="sm">
              Get Started
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
