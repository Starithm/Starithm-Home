import { Card, CardContent } from "@/components/ui/card";
import { Mail, Database, Clock } from "lucide-react";

interface SystemStatusProps {
  stats: {
    totalProcessed: number;
    twitterPosts: number;
    dbRecords: number;
    queueSize: number;
  };
}

export default function SystemStatus({ stats }: SystemStatusProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-nova-gray">Alerts Processed</p>
              <p className="text-2xl font-bold text-nova-dark">{stats.totalProcessed?.toLocaleString() || '0'}</p>
            </div>
            <Mail className="text-nova-blue text-xl h-5 w-5" />
          </div>
          <div className="mt-2">
            <span className="text-xs text-nova-success">↗ Processing active</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-nova-gray">Database Records</p>
              <p className="text-2xl font-bold text-nova-dark">{stats.dbRecords?.toLocaleString() || '0'}</p>
            </div>
            <Database className="text-nova-blue text-xl h-5 w-5" />
          </div>
          <div className="mt-2">
            <span className="text-xs text-nova-gray">Last sync: 2 min ago</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-nova-gray">Processing Queue</p>
              <p className="text-2xl font-bold text-nova-dark">{stats.queueSize || 0}</p>
            </div>
            <Clock className="text-nova-blue text-xl h-5 w-5" />
          </div>
          <div className="mt-2">
            <span className={`text-xs ${stats.queueSize > 0 ? 'text-nova-warning' : 'text-nova-gray'}`}>
              {stats.queueSize > 0 ? `${stats.queueSize} pending emails` : 'Queue empty'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
