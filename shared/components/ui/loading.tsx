import React, { useState, useEffect } from 'react';
import { Loader2, Coffee, Zap, 
  Telescope, Rocket, Computer, DownloadCloud,Bot, 
  Drill, StarHalf, Sun, Puzzle, SunSnow } from 'lucide-react';

interface LoadingProps {
  title?: string;
  className?: string;
}

const loadingMessages = [{
  message: "Our servers are powered by coffee ☕ (and sometimes they need a refill)",
  icon: Coffee
},
{
  message: "Loading faster than a gamma-ray burst... almost",
  icon: Zap
},
{
  message: "Searching through the cosmic database",
  icon: Telescope
},
{
  message: "Warming up the quantum computers",
  icon: Computer
},
{
  message: "Teaching AI to read astronomical data",
  icon: Bot
},
{
  message: "Brewing fresh cosmic insights",
  icon: Coffee
},
{
  message: "Assembling the space-time continuum",
  icon: Drill
},
{
  message: "Downloading data from the edge of the universe",
  icon: DownloadCloud
},
{
  message: "Converting stardust to pixels",
  icon: Computer
},
{
  message: "Waiting for the stars to align",
  icon: StarHalf
},
{
  message: "Processing faster than light speed (almost)",
  icon: Rocket
},
{
  message: "Our hamsters are running extra fast today",
  icon: DownloadCloud
},
{
  message: "Loading with the power of a thousand suns",
  icon: Sun
},
{
  message: "Decoding messages from distant galaxies",
  icon: DownloadCloud
},
{
  message: "Our servers are run on free tiers, it may be cold starting, come back after 5 mins",
  icon: SunSnow
},
{
  message: "Warming up the telescope arrays",
  icon: Telescope
},
{
  message: "Brewing cosmic coffee for our servers",
  icon: Coffee
},
{
  message: "Assembling the cosmic jigsaw puzzle",
  icon: Puzzle
}, 
]

export function Loading({ title = "Loading...", className = "" }: LoadingProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        setIsVisible(true);
      }, 300); // Wait for fade out before changing message
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const IconComponent = loadingMessages[currentMessageIndex].icon;

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      {/* Spinning Icon */}
      <div className="mb-6">
        <IconComponent className="h-12 w-12 text-starithm-electric-violet animate-bounce" />
      </div>

      {/* Title */}
      <h2 className="text-lg font-semibold text-starithm-rich-black">
        {`${title}...`}
      </h2>

      {/* Animated Message */}
      <div className="h-10 flex items-center justify-center text-center">
        <p 
          className={`text-starithm-rich-black/70 text-sm transition-all duration-50 ease-in-out ${
            isVisible 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform -translate-y-4'
          }`}
        >
          {loadingMessages[currentMessageIndex].message}
        </p>
      </div>
    </div>
  );
}

// Compact version for smaller spaces
export function LoadingCompact({ className = "" }: { className?: string }) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Loader2 className="h-5 w-5 text-starithm-electric-violet animate-spin" />
      <p className="text-sm text-starithm-rich-black/70">
        {loadingMessages[currentMessageIndex].message}
      </p>
    </div>
  );
}
