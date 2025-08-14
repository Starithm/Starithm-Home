import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Brain, Database, Twitter, Check, Clock, Cog } from "lucide-react";

interface SystemHealthProps {
  systemStatus: {
    [key: string]: {
      status: string;
      message?: string;
      lastCheck?: Date;
    };
  };
}

export default function SystemHealth({ systemStatus }: SystemHealthProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-nova-success bg-opacity-20 text-nova-success';
      case 'rate_limited':
        return 'bg-nova-warning bg-opacity-20 text-nova-warning';
      case 'error':
      case 'offline':
        return 'bg-nova-error bg-opacity-20 text-nova-error';
      default:
        return 'bg-nova-gray bg-opacity-20 text-nova-gray';
    }
  };

  const getStatusIcon = (service: string, status: string) => {
    const iconClass = "h-4 w-4";
    
    if (status === 'online') {
      return getServiceIcon(service, `${iconClass} text-nova-success`);
    } else if (status === 'rate_limited') {
      return getServiceIcon(service, `${iconClass} text-nova-warning`);
    } else {
      return getServiceIcon(service, `${iconClass} text-nova-error`);
    }
  };

  const getServiceIcon = (service: string, className: string) => {
    switch (service) {
      case 'email':
        return <Mail className={className} />;
      case 'llm':
        return <Brain className={className} />;
      case 'database':
        return <Database className={className} />;
      case 'twitter':
        return <Twitter className={className} />;
      default:
        return <Cog className={className} />;
    }
  };

  const getProcessingSteps = () => {
    const steps = [
      { 
        name: 'Email Retrieval', 
        status: systemStatus.email?.status || 'unknown',
        message: 'Last check: 30 seconds ago'
      },
      { 
        name: 'Data Extraction', 
        status: systemStatus.llm?.status === 'online' ? 'processing' : 'waiting',
        message: systemStatus.llm?.message || 'Waiting...'
      },
      { 
        name: 'LLM Summarization', 
        status: 'waiting',
        message: 'Waiting...'
      },
      { 
        name: 'Twitter Post', 
        status: 'queued',
        message: 'Queued'
      }
    ];

    return steps;
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'completed':
        return (
          <div className="w-8 h-8 bg-nova-success rounded-full flex items-center justify-center">
            <Check className="text-white text-xs h-3 w-3" />
          </div>
        );
      case 'processing':
        return (
          <div className="w-8 h-8 bg-nova-blue rounded-full flex items-center justify-center animate-pulse">
            <Cog className="text-white text-xs h-3 w-3" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <Clock className="text-white text-xs h-3 w-3" />
          </div>
        );
    }
  };

  return (
    <>
      {/* System Health */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-nova-dark mb-4">System Health</h3>
          
          <div className="space-y-4">
            {Object.entries(systemStatus).map(([service, status]) => (
              <div key={service} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(service, status.status)}
                  <span className="text-sm text-nova-gray capitalize">
                    {service === 'llm' ? 'LLM API' : service} Connection
                  </span>
                </div>
                <Badge className={`text-xs px-2 py-1 rounded-full ${getStatusColor(status.status)}`}>
                  {status.status === 'rate_limited' ? 'Rate Limited' : status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Processing Pipeline */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-nova-dark mb-4">Processing Pipeline</h3>
          
          <div className="space-y-3">
            {getProcessingSteps().map((step, index) => (
              <div key={index} className="flex items-center space-x-3">
                {getStepIcon(step.status)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-nova-dark">{step.name}</p>
                  <p className="text-xs text-nova-gray">{step.message}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
