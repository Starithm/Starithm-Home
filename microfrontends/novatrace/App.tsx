import React from "react";
import { Switch, Route } from "wouter";
import { getQueryClient } from "@shared/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@novatrace/components/ui/toaster";
import { TooltipProvider } from "@shared/components/ui/tooltip";
import { Analytics } from '@vercel/analytics/react';
import { StyledThemeProviderNew } from "@shared/components/StyledThemeProviderNew";
import StatusDashboard from "@novatrace/pages/StatusDashboard";
import AlertsLevel from "@novatrace/pages/AlertLevelDashboard";
import EventLevel from "@novatrace/pages/EventLevelDashboard";
import NotFound from "@novatrace/pages/NotFound";
import '@shared/styles/globals.css';

console.log("App", getQueryClient );

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
    <StyledThemeProviderNew>
      <QueryClientProvider client={getQueryClient()}>
        <TooltipProvider>
          <Toaster />
          <Router />
          <Analytics />
        </TooltipProvider>
      </QueryClientProvider>
      </StyledThemeProviderNew>
  );
}

export default App;
