import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import DayProcess from "./pages/DayProcess";
import NotFound from "./pages/NotFound";
import CompletedDays from "./pages/CompletedDays";
import { UserProvider } from "./contexts/UserContext";
import { MainLayout } from "./layout/MainLayout";
import EditDayProcess from "./pages/EditDayProcess";
import {AgendaPage} from "./pages/Agenda";
import { ReportsPage } from "./pages/ReportsPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { InsightsPage } from "./pages/InsightsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ProfilePage } from "./pages/ProfilePage";
import ViewDayProcess from "./pages/ViewDayProcess";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Agrupa todas as páginas dentro do MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/view-day/:id" element={<ViewDayProcess />} />
              <Route path="/day-process" element={<DayProcess />} />
              <Route path="/edit-day/:id" element={<EditDayProcess />} />
              <Route path="/agenda" element={<AgendaPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/profile" element={<ProfilePage/>} />
               <Route path="/settings" element={<SettingsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/completed-days" element={<CompletedDays />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
