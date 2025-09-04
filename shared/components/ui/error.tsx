import React from 'react';
import { AlertTriangle, RefreshCw, Coffee, Zap } from 'lucide-react';
import {
  ErrorContainer,
  ErrorIconCircle,
  ErrorTitle,
  ErrorMessage,
  ErrorTip,
  RetryButton,
  ErrorCompactContainer,
  ErrorCompactIcon,
  ErrorCompactTitle,
  ErrorCompactHelp,
  RetryButtonCompact,
} from '../../styled_components';

interface ErrorComponentProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

const funnyMessages = [
  {
    icon: Coffee,
    title: "☕ Server's taking a coffee break!",
    message: "Our servers are probably cold starting after a long nap. Give them 5 minutes to wake up and try again!"
  },
  {
    icon: Zap,
    title: "⚡ Cosmic interference detected!",
    message: "The gravitational waves are interfering with our servers. Wait 5 minutes for the spacetime to stabilize and try again!"
  },
  {
    icon: AlertTriangle,
    title: "🚀 Server's exploring the universe!",
    message: "Our backend has gone on a space mission. It should return in about 5 minutes. Please wait for re-entry!"
  },
  {
    icon: RefreshCw,
    title: "🔄 Quantum entanglement in progress!",
    message: "The servers are entangled in a quantum state. Wait 5 minutes for them to collapse into a working superposition!"
  }
];

export function ErrorComponent({ 
  title, 
  message, 
  onRetry, 
  className = "" 
}: ErrorComponentProps) {
  const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
  const IconComponent = randomMessage.icon;
  
  const displayTitle = title || randomMessage.title;
  const displayMessage = message || randomMessage.message;

  return (
    <ErrorContainer className={className}>
      <ErrorIconCircle>
        <IconComponent size={40} color="#dc2626" />
      </ErrorIconCircle>
      <ErrorTitle>{displayTitle}</ErrorTitle>
      <ErrorMessage>{displayMessage}</ErrorMessage>
      <ErrorTip>
        <p>💡 <strong>Pro tip:</strong> This usually happens when servers are cold starting.</p>
        <p>⏰ Wait about 5 minutes and try again!</p>
      </ErrorTip>
      {onRetry && (
        <RetryButton onClick={onRetry}>
          <RefreshCw size={16} style={{ marginRight: 8 }} />
          Try Again
        </RetryButton>
      )}
    </ErrorContainer>
  );
}

export function ErrorComponentCompact({ 
  title, 
  message, 
  onRetry, 
  className = "" 
}: ErrorComponentProps) {
  const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
  const IconComponent = randomMessage.icon;
  
  const displayTitle = title || randomMessage.title;
  const displayMessage = message || randomMessage.message;

  return (
    <ErrorCompactContainer className={className}>
      <ErrorCompactIcon>
        <IconComponent size={12} />
      </ErrorCompactIcon>
      <div style={{ flex: 1, minWidth: 0 }}>
        <ErrorCompactTitle>{displayTitle}</ErrorCompactTitle>
        <ErrorCompactHelp>💡 Wait 5 minutes and try again!</ErrorCompactHelp>
      </div>
      {onRetry && (
        <RetryButtonCompact onClick={onRetry}>
          <RefreshCw size={10} style={{ marginRight: 4 }} />
          Retry
        </RetryButtonCompact>
      )}
    </ErrorCompactContainer>
  );
}
