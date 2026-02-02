import { Switch, Route } from "wouter";
import { queryClient, apiRequest } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import { LanguageProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

import Home from "@/pages/Home";
import Products from "@/pages/Products";
import Bio from "@/pages/Bio";
import Topup from "@/pages/Topup";
import BotPage from "@/pages/BotPage";
import Tools from "@/pages/Tools";
import Websites from "@/pages/Websites";
import Profile from "@/pages/Profile";

function Router() {
  useEffect(() => {
    apiRequest("POST", "/api/bot/wake").catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Navigation />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/products" component={Products} />
        <Route path="/bio" component={Bio} />
        <Route path="/topup" component={Topup} />
        <Route path="/bot" component={BotPage} />
        <Route path="/tools" component={Tools} />
        <Route path="/websites" component={Websites} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
