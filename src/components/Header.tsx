import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Techstora Hub
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#solutions" className="text-foreground hover:text-primary transition-colors">
            Solutions
          </a>
          <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors">
            How It Works
          </a>
          <a href="#contact" className="text-foreground hover:text-primary transition-colors">
            Contact
          </a>
        </nav>
        
        <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
          Get Started
        </Button>
      </div>
    </header>
  );
};

export default Header;
