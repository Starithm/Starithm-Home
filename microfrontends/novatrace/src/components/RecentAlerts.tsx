import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, RotateCcw } from "lucide-react";
import { Alert } from "@shared/schema";

interface RecentAlertsProps {
  alerts: Alert[];
}

export default function RecentAlerts({ alerts }: RecentAlertsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-nova-success bg-opacity-20 text-nova-success';
      case 'processing':
        return 'bg-nova-warning bg-opacity-20 text-nova-warning';
      case 'failed':
        return 'bg-nova-error bg-opacity-20 text-nova-error';
      case 'pending':
        return 'bg-nova-gray bg-opacity-20 text-nova-gray';
      default:
        return 'bg-nova-gray bg-opacity-20 text-nova-gray';
    }
  };

  const getEventType = (alert: Alert) => {
    const data = alert.data as any;
    return data?.eventType || data?.extractedData?.eventType || 'Unknown';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <Card className="border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-nova-dark">Recent Alerts</h2>
          <Button variant="ghost" size="sm" className="text-nova-blue hover:text-nova-light">
            View All
          </Button>
        </div>
      </div>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-nova-gray uppercase tracking-wider">
                  GCN ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-nova-gray uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-nova-gray uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-nova-gray uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-nova-gray uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alerts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-nova-gray">
                    No alerts processed yet. The system is monitoring for new astronomy alerts.
                  </td>
                </tr>
              ) : (
                alerts.map((alert) => (
                  <tr key={alert.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-nova-dark">{alert.gcnId}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-nova-gray">{formatDate(alert.date)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-nova-gray">{getEventType(alert)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`text-xs font-semibold ${getStatusColor(alert.status)}`}>
                        {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="p-1 h-auto">
                          <Eye className="h-4 w-4 text-nova-blue hover:text-nova-light" />
                        </Button>
                        {alert.status === 'failed' ? (
                          <Button variant="ghost" size="sm" className="p-1 h-auto">
                            <RotateCcw className="h-4 w-4 text-nova-error hover:text-red-700" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="p-1 h-auto">
                            <Edit className="h-4 w-4 text-nova-gray hover:text-nova-dark" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
