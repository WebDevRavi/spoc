import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { I18nProvider } from "@/context/I18nContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/layouts/AppLayout";
import Dashboard from "@/pages/Dashboard";
import MapPage from "@/pages/Map";
import IssuesPage from "@/pages/Issues";
import DepartmentsPage from "@/pages/Departments";
import AnalyticsPage from "@/pages/Analytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider>
        <I18nProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route
                  element={
                    <ProtectedRoute allow={["admin", "staff", "user"]} />
                  }
                >
                  <Route
                    path="/dashboard"
                    element={
                      <AppLayout>
                        <Dashboard />
                      </AppLayout>
                    }
                  />
                  <Route
                    path="/issues"
                    element={
                      <AppLayout>
                        <IssuesPage />
                      </AppLayout>
                    }
                  />
                </Route>
                <Route element={<ProtectedRoute allow={["admin", "staff"]} />}>
                  <Route
                    path="/map"
                    element={
                      <AppLayout>
                        <MapPage />
                      </AppLayout>
                    }
                  />
                </Route>
                <Route element={<ProtectedRoute allow={["admin"]} />}>
                  <Route
                    path="/departments"
                    element={
                      <AppLayout>
                        <DepartmentsPage />
                      </AppLayout>
                    }
                  />
                  <Route
                    path="/analytics"
                    element={
                      <AppLayout>
                        <AnalyticsPage />
                      </AppLayout>
                    }
                  />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </I18nProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
