import { Button } from "../../../shared/components/ui/button";
import { StarfieldBackground } from "./StarfieldBackground";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      <StarfieldBackground />
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-bold text-starithm-electric-violet mb-6 leading-tight">
              Explore the Universe with Starithm
            </h1>
            
            <p className="text-2xl lg:text-3xl text-starithm-rich-black/80 mb-8 opacity-90 leading-relaxed">
              Instant access to astronomical alerts from trusted global networks — all in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-starithm-electric-violet hover:bg-starithm-electric-violet/90 text-white px-10 py-4 text-xl"
              >
                Start Exploring
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-starithm-electric-violet text-starithm-electric-violet hover:bg-starithm-electric-violet/10 px-10 py-4 text-xl"
              >
                View Live Alerts
              </Button>
            </div>
          </div>
          
          {/* Right Abstract Shapes */}
          <div className="relative hidden lg:block">
            <div className="relative w-full h-96">
              {/* Main gradient orb */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-starithm-electric-violet/20 to-starithm-veronica/15 rounded-full blur-3xl"></div>
              
              {/* Secondary shapes */}
              <div className="absolute top-16 left-8 w-32 h-32 border-2 border-starithm-veronica/50 rounded-full"></div>
              <div className="absolute bottom-8 right-16 w-24 h-24 bg-gradient-to-tr from-starithm-selective-yellow/30 to-transparent rotate-45"></div>
              
              {/* Geometric lines */}
              <div className="absolute top-1/2 left-1/4 w-48 h-0.5 bg-gradient-to-r from-starithm-electric-violet/60 to-transparent rotate-12"></div>
              <div className="absolute top-1/3 right-1/4 w-32 h-0.5 bg-gradient-to-l from-starithm-veronica/60 to-transparent -rotate-12"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}