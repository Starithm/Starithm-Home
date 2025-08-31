import { Card, CardContent } from "@shared/components/ui/card";
import { Button } from "@shared/components/ui/button";
import { Eye, Edit } from "lucide-react";

// Alert type definition based on the provided schema
export type MeasurementData = {
  ra?: number | null;
  dec?: number | null;
  redshift?: number | null;
  distance?: number | null;
  magnitude?: number | null;
  duration?: number | null;
  fluence?: number | null;
  energy?: number | null;
  other_measurements?: Record<string, any>;
};

export type AuthorData = {
  universities?: string[];
  institutions?: string[];
  authors?: string[];
  affiliations?: string[];
};

export type TelescopeData = {
  telescopes?: string[];
  instruments?: string[];
  observatories?: string[];
  facilities?: string[];
};

export type BasicData = {
  event?: string;
  eventType?: string;
  detectionTime?: string;
  author?: string;
  [key: string]: any;
};

export type AlertData = {
  measurements: MeasurementData;
  authors: AuthorData;
  telescopes: TelescopeData;
  urls?: string[];
  basic_data: BasicData;
  raw: string;
};

export type Alert = {
  id: number;
  alertKey: string;
  broker: string;
  event: string;
  date: Date;
  data: AlertData;
  summary: string;
  confidenceLevel: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
};

interface RecentAlertsProps {
  alerts: Alert[];
}

export default function RecentAlerts({ alerts }: RecentAlertsProps) {


  const getEventType = (alert: Alert) => {
    return alert.data.basic_data.eventType || 'Unknown';
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
                  Alert Key
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-nova-gray uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-nova-gray uppercase tracking-wider">
                  Broker
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-nova-gray uppercase tracking-wider">
                  Type
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
                      <span className="text-sm font-medium text-nova-dark">{alert.alertKey}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-nova-gray">{formatDate(alert.date)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-nova-gray">{alert.broker}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-nova-gray">{getEventType(alert)}</span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="p-1 h-auto">
                          <Eye className="h-4 w-4 text-nova-blue hover:text-nova-light" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-1 h-auto">
                          <Edit className="h-4 w-4 text-nova-gray hover:text-nova-dark" />
                        </Button>
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
