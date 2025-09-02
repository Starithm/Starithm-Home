import { useQuery } from "@tanstack/react-query";
import SystemStatus from "@novatrace/components/SystemStatus";
import RecentAlerts from "@novatrace/components/RecentAlerts";
import SystemHealth from "@novatrace/components/SystemHealth";
import RecentSummary from "@novatrace/components/RecentSummary";
import { Card, CardContent } from "@shared/components/ui/card";
import { Button } from "@shared/components/ui/button";
import { Play, Pause, FileText } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@shared/lib/queryClient";
import { useToast } from "@shared/hooks/use-toast";

export default function StatusDashboard() {
  const [isProcessing, setIsProcessing] = useState(true);
  const { toast } = useToast();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['/api/dashboard'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: alerts } = useQuery({
    queryKey: ['/api/alerts'],
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  const handleManualProcess = async () => {
    try {
      await apiRequest('POST', '/api/process');
      toast({
        title: "Processing Started",
        description: "Manual processing has been triggered successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to trigger processing. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePauseProcessing = () => {
    setIsProcessing(!isProcessing);
    toast({
      title: isProcessing ? "Processing Paused" : "Processing Resumed",
      description: `Automatic processing has been ${isProcessing ? 'paused' : 'resumed'}.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-nova-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-nova-gray">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = (dashboardData as any)?.stats || {
    totalProcessed: 0,
    twitterPosts: 0,
    dbRecords: 0,
    queueSize: 0,
  };

  const systemStatus = (dashboardData as any)?.systemStatus || {};
  const recentAlerts = Array.isArray(alerts) ? alerts : [];
  const latestAlert = recentAlerts.length > 0 ? recentAlerts[0] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-starithm-rich-black mb-2">NovaTrace Status</h1>
          <p className="text-starithm-rich-black/70">Real-time monitoring of astronomical alert processing system</p>
        </div>

        {/* System Status Cards */}
        <SystemStatus stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Recent Alerts */}
          <div className="lg:col-span-2">
            <RecentAlerts alerts={recentAlerts} />
          </div>

          {/* System Health & Controls */}
          <div className="space-y-6">
            <SystemHealth systemStatus={systemStatus} />

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-nova-dark mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                                           <Button
                           onClick={handleManualProcess}
                           className="w-full bg-[#9A48FF] hover:bg-[#9A48FF]/90"
                         >
                    <Play className="mr-2 h-4 w-4" />
                    Process Queue Manually
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={handlePauseProcessing}
                    className="w-full"
                  >
                    <Pause className="mr-2 h-4 w-4" />
                    {isProcessing ? 'Pause Processing' : 'Resume Processing'}
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    View Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Latest Processed Alert */}
        {latestAlert && (
          <div className="mt-8">
            <RecentSummary alert={latestAlert} />
          </div>
        )}
      </div>

      {/* Starithm Footer */}
      <footer className="mt-auto py-6 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-[#770ff5] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">S</span>
              </div>
              <span className="text-sm font-medium text-[#770ff5]">Starithm</span>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">&copy; 2024 Starithm. All rights reserved.</p>
              <p className="text-xs text-gray-500 mt-1">Astronomer's Platform</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
