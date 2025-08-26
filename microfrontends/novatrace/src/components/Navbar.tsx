import React from "react";
import { Button } from "@shared/components/ui/button";
import { Badge } from "@shared/components/ui/badge";
import { Activity, House } from "lucide-react";
import { ThemeToggle } from "../../../../shared/components/ThemeToggle";

export function Navbar() {
  return (
    <nav className="border-b border-gray-200 dark:border-gray-700 bg-background/95 dark:bg-starithm-bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:supports-[backdrop-filter]:bg-starithm-bg-black/60">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-starithm-electric-violet rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-lg text-foreground">NovaTrace</span>
              <span className="text-xs text-muted-foreground">Powered by Starithm Tech</span>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            Event Intelligence
          </Badge>
        </div>
        

        
        <div className="flex justify-end absolute right-4 space-x-4">
          {/* <ThemeToggle variant="icon" size="sm" /> */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.href = '/novatrace/status'}
            className="flex items-center space-x-2"
          >
            <Activity className="h-4 w-4" />
            <span>Check Status</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.href = '/home'}
            className="flex items-center space-x-2"
          >
            <House className="h-4 w-4" />
            <span>Home</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
