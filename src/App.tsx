import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PortalLayout } from "./components/layout/PortalLayout";
import { ManagerLayout } from "./components/layout/ManagerLayout";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import TeamManagement from "./pages/manager/TeamManagement";
import ProjectManagement from "./pages/manager/ProjectManagement";
import NotFound from "./pages/NotFound";
import { UserProvider } from "./contexts/UserContext"; // 1. Import UserProvider

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* 2. Wrap BrowserRouter with UserProvider */}
      <UserProvider>
        <BrowserRouter>
          <Routes>
            {/* Employee Portal Routes */}
            <Route path="/" element={
              <PortalLayout>
                <Dashboard />
              </PortalLayout>
            } />
            <Route path="/tasks" element={
              <PortalLayout>
                <Tasks />
              </PortalLayout>
            } />
            <Route path="/profile" element={
              <PortalLayout>
                <Profile />
              </PortalLayout>
            } />
            
            {/* Manager Portal Routes */}
            <Route path="/manager" element={
              <ManagerLayout>
                <ManagerDashboard />
              </ManagerLayout>
            } />
            <Route path="/manager/team" element={
              <ManagerLayout>
                <TeamManagement />
              </ManagerLayout>
            } />
            <Route path="/manager/projects" element={
              <ManagerLayout>
                <ProjectManagement />
              </ManagerLayout>
            } />
            <Route path="/manager/analytics" element={
              <ManagerLayout>
                <div className="p-6">
                  <h1 className="text-3xl font-bold">Analytics</h1>
                  <p className="text-muted-foreground">Coming soon...</p>
                </div>
              </ManagerLayout>
            } />
            <Route path="/manager/settings" element={
              <ManagerLayout>
                <div className="p-6">
                  <h1 className="text-3xl font-bold">Settings</h1>
                  <p className="text-muted-foreground">Coming soon...</p>
                </div>
              </ManagerLayout>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;