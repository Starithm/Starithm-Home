import React from "react";
import { Switch, Route, Redirect } from "wouter";
import { getQueryClient } from "@shared/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@novatrace/components/ui/toaster";
import { TooltipProvider } from "@shared/components/ui/tooltip";
import { Analytics } from '@vercel/analytics/react';
import StatusDashboard from "@novatrace/pages/StatusDashboard";
import AlertsLevel from "@novatrace/pages/AlertLevelDashboard";
import EventLevel from "@novatrace/pages/EventLevelDashboard";
import NotFound from "@novatrace/pages/NotFound";
import PublicEventPage from "@novatrace/pages/PublicEventPage";
import SearchPage from "@novatrace/pages/SearchPage";
import CircularEventPage from "@novatrace/pages/CircularEventPage";
import '@shared/styles/globals.css';


function Router() {
  return (
    <Switch>
      <Route path="/" component={AlertsLevel} />
      <Route path="/alerts" component={AlertsLevel} />
      <Route path="/status" component={StatusDashboard} />
      <Route path="/events" component={EventLevel} />
      <Route path="/novatrace"><Redirect to="/novatrace/events" /></Route>
      <Route path="/novatrace/alerts" component={AlertsLevel} />
      <Route path="/novatrace/status" component={StatusDashboard} />
      <Route path="/novatrace/events" component={EventLevel} />
      <Route path="/novatrace/events/:canonicalId" component={PublicEventPage} />
      <Route path="/events/:canonicalId" component={PublicEventPage} />
      <Route path="/novatrace/search" component={SearchPage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/novatrace/circulars/:eventName" component={CircularEventPage} />
      <Route path="/circulars/:eventName" component={CircularEventPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={getQueryClient()}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <Analytics />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
