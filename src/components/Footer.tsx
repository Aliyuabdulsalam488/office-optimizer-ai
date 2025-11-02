const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border/50 py-12 md:py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Techstora Hub
            </h3>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              Empowering businesses with intelligent automation for finance, procurement, HR, 
              and more. Transform your operations with AI.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Solutions</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer" onClick={() => scrollToSection("solutions")}>Finance</li>
              <li className="hover:text-foreground transition-colors cursor-pointer" onClick={() => scrollToSection("solutions")}>Procurement</li>
              <li className="hover:text-foreground transition-colors cursor-pointer" onClick={() => scrollToSection("solutions")}>HR Management</li>
              <li className="hover:text-foreground transition-colors cursor-pointer" onClick={() => scrollToSection("solutions")}>Executive Assistant</li>
              <li className="hover:text-foreground transition-colors cursor-pointer" onClick={() => scrollToSection("solutions")}>Data Cleaning</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer" onClick={() => scrollToSection("how-it-works")}>About Us</li>
              <li className="hover:text-foreground transition-colors cursor-pointer" onClick={() => scrollToSection("contact")}>Careers</li>
              <li className="hover:text-foreground transition-colors cursor-pointer" onClick={() => scrollToSection("how-it-works")}>Blog</li>
              <li className="hover:text-foreground transition-colors cursor-pointer" onClick={() => scrollToSection("contact")}>Contact</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <p>&copy; 2025 Techstora Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
