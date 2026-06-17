import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/context/UserContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AdminProvider } from "@/context/AdminContext";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import ProductTemplates from "./pages/ProductTemplates.tsx";
import ProductSamples from "./pages/ProductSamples.tsx";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import InitializeFirestore from "./pages/InitializeFirestore.tsx";
import Checkout from "./pages/Checkout.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import AdminOrders from "./pages/AdminOrders.tsx";
import AdminTemplates from "./pages/AdminTemplates.tsx";
import AdminAnalytics from "./pages/AdminAnalytics.tsx";
import AdminSettings from "./pages/AdminSettings.tsx";
import AdminSamples from "./pages/AdminSamples.tsx";
import WebCustomization from "./pages/WebCustomization.tsx";

const queryClient = new QueryClient();

const App = () => (
  <LanguageProvider>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <AdminProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/templates" element={<ProductTemplates />} />
                <Route path="/samples" element={<ProductSamples />} />
                <Route path="/web-custom" element={<WebCustomization />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/admin/init-firestore" element={<InitializeFirestore />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedAdminRoute>
                      <AdminDashboard />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedAdminRoute>
                      <AdminOrders />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/templates"
                  element={
                    <ProtectedAdminRoute>
                      <AdminTemplates />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/samples"
                  element={
                    <ProtectedAdminRoute>
                      <AdminSamples />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <ProtectedAdminRoute>
                      <AdminAnalytics />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedAdminRoute>
                      <AdminSettings />
                    </ProtectedAdminRoute>
                  }
                />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AdminProvider>
      </UserProvider>
    </QueryClientProvider>
  </LanguageProvider>
);

export default App;
