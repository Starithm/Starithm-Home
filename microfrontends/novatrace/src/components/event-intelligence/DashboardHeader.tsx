import { TrendingCarousel } from "./TrendingCarousel";
import { Alert } from "@/types/Alert";

interface DashboardHeaderProps {
  onAlertClick?: (alert: Alert) => void;
}

export function DashboardHeader({ onAlertClick }: DashboardHeaderProps) {
  return (
    <div className="border-b bg-muted/50">
      <div className="px-6 py-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Event Intelligence Dashboard</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Monitor and analyze astronomical events in real-time through GCN notices and ATel reports. Track gamma-ray bursts, optical transients, neutrino detections, and gravitational waves with comprehensive measurement data and confidence assessments.
            </p>
          </div>
          <div className="ml-8 w-96">
            <TrendingCarousel onAlertClick={onAlertClick} />
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>System Online</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Live Data</span>
          </div>
        </div>
      </div>
    </div>
  );
}
