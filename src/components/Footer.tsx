const Footer = () => {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Techstora Hub
            </h3>
            <p className="text-muted-foreground max-w-md">
              Empowering businesses with intelligent automation for finance, procurement, HR, 
              and more. Transform your operations with AI.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Solutions</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer">Finance</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Procurement</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">HR Management</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Executive Assistant</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Data Cleaning</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer">About Us</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Careers</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Blog</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Contact</li>
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
