import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Recruitment from "./pages/Recruitment";
import JobSeeker from "./pages/JobSeeker";
import Help from "./pages/Help";
import Terms from "./pages/Terms";
import FloorPlanner from "./pages/FloorPlanner";
import AdminPanel from "./pages/AdminPanel";
import EnhancedAuth from "./pages/EnhancedAuth";
import HRDashboard from "./pages/HRDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ProfileSettings from "./pages/ProfileSettings";
import Onboarding from "./pages/Onboarding";
import ArchitectDashboard from "./pages/ArchitectDashboard";
import HomeBuilderDashboard from "./pages/HomeBuilderDashboard";
import { RoleBasedNav } from "./components/RoleBasedNav";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RoleBasedNav />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<EnhancedAuth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/hr-dashboard" element={<HRDashboard />} />
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          <Route path="/architect-dashboard" element={<ArchitectDashboard />} />
          <Route path="/home-builder-dashboard" element={<HomeBuilderDashboard />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/recruitment" element={<Recruitment />} />
          <Route path="/jobs" element={<JobSeeker />} />
          <Route path="/floor-planner" element={<FloorPlanner />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/help" element={<Help />} />
          <Route path="/terms" element={<Terms />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
