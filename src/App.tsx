
import React from "react"; // Make sure React is explicitly imported
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import About from "./pages/About";
import SpeedTest from "./pages/SpeedTest";
import NotFound from "./pages/NotFound";
import Learn from "./pages/Learn";
import { useEffect } from "react";

// Function to enforce dark mode
const DarkModeEnforcer = () => {
  useEffect(() => {
    // Force dark mode for AMOLED theme
    document.documentElement.classList.add('dark');
  }, []);
  
  return null;
};

const App = () => {
  // Create a client
  const queryClient = new QueryClient();

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <DarkModeEnforcer />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<SpeedTest />} />
                <Route path="/about" element={<About />} />
                <Route path="/learn" element={<Learn />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
