import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PortalLayout } from "./components/layout/PortalLayout";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;