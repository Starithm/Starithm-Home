import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "../../../shared/components/ui/toaster";
import { TooltipProvider } from "../../../shared/components/ui/tooltip";
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '../../../shared/components/ThemeProvider';
import StatusDashboard from "./pages/status";
import AlertsLevel from "./pages/alerts-level";
import EventLevel from "./pages/event-level";
import NotFound from "./pages/not-found";


function Router() {
  return (
    <Switch>
      <Route path="/" component={AlertsLevel} />
      <Route path="/status" component={StatusDashboard} />
      <Route path="/events" component={EventLevel} />
      <Route path="/novatrace" component={AlertsLevel} />
      <Route path="/novatrace/alerts" component={AlertsLevel} />
      <Route path="/novatrace/status" component={StatusDashboard} />
      <Route path="/novatrace/events" component={EventLevel} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
          <Analytics />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
