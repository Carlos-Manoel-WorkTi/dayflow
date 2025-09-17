// routes.tsx
import { MainLayout } from "@/layout/MainLayout";
import { AgendaPage } from "@/pages/Agenda";
import CompletedDays from "@/pages/CompletedDays";
import DayProcess from "@/pages/DayProcess";
import EditDayProcess from "@/pages/EditDayProcess";
import Index from "@/pages/Index";
import { InsightsPage } from "@/pages/InsightsPage";
import NotFound from "@/pages/NotFound";
import { NotificationsPage } from "@/pages/NotificationsPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { ReportsPage } from "@/pages/ReportsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import ViewDayProcess from "@/pages/ViewDayProcess";
import { createBrowserRouter } from "react-router-dom";


export const router = createBrowserRouter(
  [
    {
      element: <MainLayout />,
      children: [
        { path: "/", element: <Index /> },
        { path: "/view-day/:id", element: <ViewDayProcess /> },
        { path: "/day-process", element: <DayProcess /> },
        { path: "/edit-day/:id", element: <EditDayProcess /> },
        { path: "/agenda", element: <AgendaPage /> },
        { path: "/reports", element: <ReportsPage /> },
        { path: "/profile", element: <ProfilePage /> },
        { path: "/settings", element: <SettingsPage /> },
        { path: "/notifications", element: <NotificationsPage /> },
        { path: "/insights", element: <InsightsPage /> },
        { path: "/completed-days", element: <CompletedDays /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true, // ⚡ ativa o comportamento do v7 já
    },
  }
);
