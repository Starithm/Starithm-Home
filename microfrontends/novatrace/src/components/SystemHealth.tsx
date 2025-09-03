import { Mail, Brain, Database, Twitter, Check, Clock, Cog } from "lucide-react";
import {
  SectionCard,
  SectionContent,
  SectionTitle,
  HealthList,
  HealthRow,
  HealthLeft,
  HealthLabel,
  StatusBadge,
  StepsList,
  StepRow,
  StepText,
  StepTitle,
  StepSub,
  StatusDot,
} from "../styled_components/SystemHealth.styled";

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
  const getStatusColors = (status: string) => {
    switch (status) {
      case 'online':
        return { bg: 'rgba(16,185,129,0.2)', color: '#10b981' }; // green
      case 'rate_limited':
        return { bg: 'rgba(245,158,11,0.2)', color: '#f59e0b' }; // amber
      case 'error':
      case 'offline':
        return { bg: 'rgba(239,68,68,0.2)', color: '#ef4444' }; // red
      default:
        return { bg: 'rgba(107,114,128,0.2)', color: '#6b7280' }; // gray
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
          <StatusDot bg="#10b981">
            <Check className="text-white text-xs h-3 w-3" />
          </StatusDot>
        );
      case 'processing':
        return (
          <StatusDot bg="#3b82f6">
            <Cog className="text-white text-xs h-3 w-3" />
          </StatusDot>
        );
      default:
        return (
          <StatusDot bg="#9ca3af">
            <Clock className="text-white text-xs h-3 w-3" />
          </StatusDot>
        );
    }
  };

  return (
    <>
      {/* System Health */}
      <SectionCard>
        <SectionContent>
          <SectionTitle>System Health</SectionTitle>
          <HealthList>
            {Object.entries(systemStatus).map(([service, status]) => {
              const colors = getStatusColors(status.status);
              return (
                <HealthRow key={service}>
                  <HealthLeft>
                    {getStatusIcon(service, status.status)}
                    <HealthLabel>{service === 'llm' ? 'LLM API' : service} Connection</HealthLabel>
                  </HealthLeft>
                  <StatusBadge bg={colors.bg} color={colors.color}>
                    {status.status === 'rate_limited' ? 'Rate Limited' : status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                  </StatusBadge>
                </HealthRow>
              );
            })}
          </HealthList>
        </SectionContent>
      </SectionCard>

      {/* Processing Pipeline */}
      <SectionCard>
        <SectionContent>
          <SectionTitle>Processing Pipeline</SectionTitle>
          <StepsList>
            {getProcessingSteps().map((step, index) => (
              <StepRow key={index}>
                {getStepIcon(step.status)}
                <StepText>
                  <StepTitle>{step.name}</StepTitle>
                  <StepSub>{step.message}</StepSub>
                </StepText>
              </StepRow>
            ))}
          </StepsList>
        </SectionContent>
      </SectionCard>
    </>
  );
}
