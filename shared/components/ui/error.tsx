import React from 'react';
import { AlertTriangle, RefreshCw, Coffee, Zap } from 'lucide-react';

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
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className} mb-5`}>
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <IconComponent className="h-10 w-10 text-red-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {displayTitle}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {displayMessage}
      </p>
      
      <div className="text-sm text-gray-500 mb-6">
        <p>💡 <strong>Pro tip:</strong> This usually happens when servers are cold starting.</p>
        <p>⏰ Wait about 5 minutes and try again!</p>
      </div>
      
      {onRetry && (
        <button
          onClick={onRetry}
                          className="inline-flex items-center px-4 py-2 bg-[#9A48FF] text-white rounded-lg hover:bg-[#9A48FF]/90 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2 mb-2" />
          Try Again
        </button>
      )}
    </div>
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
    <div className={`flex items-center p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
      <IconComponent className="h-2 w-2 text-red-600 mr-3 flex-shrink-0" />
      
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-medium text-red-900 mb-1">
          {displayTitle}
        </h4>
        {/* <p className="text-xs text-red-700 mb-2">
          {displayMessage}
        </p> */}
        <p className="text-xs text-red-600">
          💡 Wait 5 minutes and try again!
        </p>
      </div>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-3 inline-flex items-center px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="h-1 w-1 mr-1" />
          Retry
        </button>
      )}
    </div>
  );
}
