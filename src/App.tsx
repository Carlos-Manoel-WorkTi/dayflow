import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./contexts/UserContext";
import { router } from "./routes/routes";
import { RouterProvider } from "react-router-dom";



const queryClient = new QueryClient();
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <Toaster />
        <Sonner />
        <RouterProvider router={router} />
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
