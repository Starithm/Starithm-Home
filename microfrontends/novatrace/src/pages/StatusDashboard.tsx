import { useQuery } from "@tanstack/react-query";
import SystemStatus from "@novatrace/components/SystemStatus";
import {AlertsList} from "@novatrace/components/AlertsList";
import SystemHealth from "@novatrace/components/SystemHealth";
import { Button } from "@shared/components/ui/button";
import { Play, Pause, FileText } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@shared/lib/queryClient";
import { useToast } from "@shared/hooks/use-toast";
import {
  Page,
  Container,
  Header,
  Title,
  Subtitle,
  Grid,
  LeftCol,
  RightCol,
  ActionsCard,
  ActionsContent,
  ActionsTitle,
  ActionsList,
  Footer,
  FooterInner,
  FooterContent,
  FooterBrand,
  FooterLogo,
  FooterBrandName,
  FooterText,
} from "../styled_pages/StatusDashboard.styled";

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
      <Page>
        <Container>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', textAlign: 'center' }}>
            <div>
              <div className="w-8 h-8 border-4 border-[var(--starithm-veronica)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p style={{ opacity: 0.8 }}>Loading dashboard...</p>
            </div>
          </div>
        </Container>
      </Page>
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
    <Page>
      <Container>
        <Header>
          <Title>NovaTrace Status</Title>
          <Subtitle>Real-time monitoring of astronomical alert processing system</Subtitle>
        </Header>

        {/* System Status Cards */}
        <SystemStatus stats={stats} />

        <Grid>
          {/* Recent Alerts */}
          <LeftCol>
            <AlertsList alerts={recentAlerts} />
          </LeftCol>

          {/* System Health & Controls */}
          <RightCol>
            <SystemHealth systemStatus={systemStatus} />

            {/* Quick Actions */}
            <ActionsCard>
              <ActionsContent>
                <ActionsTitle>Quick Actions</ActionsTitle>
                <ActionsList>
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
                </ActionsList>
              </ActionsContent>
            </ActionsCard>
          </RightCol>
        </Grid>
      </Container>

      {/* Starithm Footer */}
      <Footer>
        <FooterInner>
          <FooterContent>
            <FooterBrand>
              <FooterLogo>S</FooterLogo>
              <FooterBrandName>Starithm</FooterBrandName>
            </FooterBrand>
            <div style={{ textAlign: 'center' }}>
              <FooterText>&copy; 2024 Starithm. All rights reserved.</FooterText>
              <FooterText style={{ marginTop: '0.25rem' }}>Astronomer's Platform</FooterText>
            </div>
          </FooterContent>
        </FooterInner>
      </Footer>
    </Page>
  );
}
