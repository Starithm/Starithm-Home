import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "../../../shared/components/ui/toaster";
import { TooltipProvider } from "@shared/components/ui/tooltip";
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '../../../shared/components/ThemeProvider';
import Dashboard from "@/pages/dashboard";
import EventIntelligence from "@/pages/event-intelligence";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={EventIntelligence} />
      <Route path="/status" component={Dashboard} />
      <Route path="/novatrace" component={EventIntelligence} />
      <Route path="/novatrace/status" component={Dashboard} />
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
