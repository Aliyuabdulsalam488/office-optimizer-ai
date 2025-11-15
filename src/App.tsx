import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EnhancedAuth from "./pages/EnhancedAuth";
import FinanceDashboard from "./pages/FinanceDashboard";
import Recruitment from "./pages/Recruitment";
import FloorPlanner from "./pages/FloorPlanner";
import ProfileSettings from "./pages/ProfileSettings";
import Help from "./pages/Help";
import Terms from "./pages/Terms";
import ProcurementFinanceDashboard from "./pages/ProcurementFinanceDashboard";
import GlobalFinanceDashboard from "./pages/GlobalFinanceDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<EnhancedAuth />} />
          
          {/* Core MVP Routes - Direct Access */}
          <Route path="/finance-dashboard" element={<FinanceDashboard />} />
          <Route path="/global-finance" element={<GlobalFinanceDashboard />} />
          <Route path="/procurement" element={<ProcurementFinanceDashboard />} />
          <Route path="/recruitment" element={<Recruitment />} />
          <Route path="/floor-planner" element={<FloorPlanner />} />
          
          {/* Supporting Routes */}
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="/help" element={<Help />} />
          <Route path="/terms" element={<Terms />} />
          
          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
