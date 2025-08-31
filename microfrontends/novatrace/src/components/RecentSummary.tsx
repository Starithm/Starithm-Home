import { Card, CardContent } from "@shared/components/ui/card";
import { Button } from "@shared/components/ui/button";
import { Twitter, ExternalLink } from "lucide-react";
import { Alert } from "@shared/schema";

interface RecentSummaryProps {
  alert: Alert;
}

export default function RecentSummary({ alert }: RecentSummaryProps) {
  const data = alert.data as any;
  const coordinates = data?.coordinates || data?.extractedData?.coordinates;
  const eventType = data?.eventType || data?.extractedData?.eventType || 'Unknown Event';
  const tweetText = data?.tweetText || alert.summary;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(new Date(date));
  };

  const formatCoordinates = () => {
    if (!coordinates) return 'Not available';
    
    if (coordinates.ra && coordinates.dec) {
      return `RA: ${coordinates.ra}°, Dec: ${coordinates.dec}°`;
    }
    
    return 'Coordinates pending';
  };

  return (
    <Card className="border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-nova-dark">Latest Processed Alert</h2>
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-nova-gray uppercase tracking-wider mb-3">
              Alert Information
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-nova-gray">GCN ID:</span>
                <span className="text-sm font-medium text-nova-dark">{alert.gcnId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-nova-gray">Date:</span>
                <span className="text-sm font-medium text-nova-dark">{formatDate(alert.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-nova-gray">Type:</span>
                <span className="text-sm font-medium text-nova-dark">{eventType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-nova-gray">Coordinates:</span>
                <span className="text-sm font-medium text-nova-dark">{formatCoordinates()}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-nova-gray uppercase tracking-wider mb-3">
              Generated Summary
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-nova-dark leading-relaxed">
                {alert.summary || tweetText || 'Summary not yet generated'}
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-nova-gray">
                {alert.twitterPostId ? 'Posted to Twitter' : 'Not posted yet'}: {
                  alert.updatedAt ? new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
                    Math.floor((new Date(alert.updatedAt).getTime() - Date.now()) / (1000 * 60)), 
                    'minute'
                  ) : 'N/A'
                }
              </span>
              {alert.twitterPostId && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-nova-blue hover:text-nova-light p-0 h-auto"
                >
                  <Twitter className="mr-1 h-3 w-3" />
                  <span className="text-xs">View Tweet</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
