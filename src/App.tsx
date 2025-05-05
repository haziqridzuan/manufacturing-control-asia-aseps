
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Suppliers from "./pages/Suppliers";
import Timeline from "./pages/Timeline";
import GlobalMap from "./pages/GlobalMap";
import Analytics from "./pages/Analytics";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ProjectDetails from "./pages/ProjectDetails";
import ExternalLinks from "./pages/ExternalLinks";
import ExportData from "./pages/ExportData";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/projects" element={<Layout><Projects /></Layout>} />
          <Route path="/project/:id" element={<Layout><ProjectDetails /></Layout>} />
          <Route path="/suppliers" element={<Layout><Suppliers /></Layout>} />
          <Route path="/supplier/:id" element={<Layout><SupplierDetails /></Layout>} />
          <Route path="/timeline" element={<Layout><Timeline /></Layout>} />
          <Route path="/map" element={<Layout><GlobalMap /></Layout>} />
          <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
          <Route path="/external-links" element={<Layout><ExternalLinks /></Layout>} />
          <Route path="/export-data" element={<Layout><ExportData /></Layout>} />
          <Route path="/admin" element={<Layout><Admin /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
