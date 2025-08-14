import { Button } from "./ui/button";
import { StarfieldBackground } from "./StarfieldBackground";

export function Homepage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
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
                  className="border-starithm-electric-violet text-starithm-electric-violet bg-white hover:bg-starithm-electric-violet/10 px-10 py-4 text-xl"
                  onClick={() => window.open('http://localhost:3000/novatrace', '_blank')}
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

      {/* Key Metrics Section */}
      <section className="py-24 bg-gradient-to-b from-white to-starithm-electric-violet/5">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-starithm-electric-violet mb-6">
              Real-Time Astronomical Data
            </h2>
            <p className="text-xl text-starithm-rich-black/70 max-w-3xl mx-auto">
              Access live alerts from the world's leading astronomical observatories and research institutions
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-starithm-electric-violet mb-3">50+</div>
              <div className="text-starithm-rich-black/70 text-lg">Observatories</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-starithm-veronica mb-3">24/7</div>
              <div className="text-starithm-rich-black/70 text-lg">Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-starithm-selective-yellow mb-3">1000+</div>
              <div className="text-starithm-rich-black/70 text-lg">Daily Alerts</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-starithm-electric-violet mb-3">99.9%</div>
              <div className="text-starithm-rich-black/70 text-lg">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-starithm-electric-violet mb-6">
              Powerful Features for Astronomers
            </h2>
            <p className="text-xl text-starithm-rich-black/70 max-w-3xl mx-auto">
              Everything you need to stay ahead of astronomical discoveries
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-starithm-electric-violet/5 to-starithm-veronica/5">
              <div className="w-16 h-16 bg-starithm-electric-violet/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-starithm-electric-violet mb-4">Real-Time Alerts</h3>
              <p className="text-starithm-rich-black/70 text-lg">
                Get instant notifications for new astronomical events and discoveries
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-starithm-veronica/5 to-starithm-selective-yellow/5">
              <div className="w-16 h-16 bg-starithm-veronica/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-starithm-veronica mb-4">Advanced Search</h3>
              <p className="text-starithm-rich-black/70 text-lg">
                Filter and search through historical data with powerful query tools
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-starithm-selective-yellow/5 to-starithm-electric-violet/5">
              <div className="w-16 h-16 bg-starithm-selective-yellow/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-2xl font-bold text-starithm-selective-yellow mb-4">Collaboration</h3>
              <p className="text-starithm-rich-black/70 text-lg">
                Connect with researchers worldwide and share findings
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Visualization Showcase */}
      <section id="data" className="py-24 bg-gradient-to-b from-starithm-electric-violet/5 to-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-starithm-electric-violet mb-6">
              Visualize Astronomical Data
            </h2>
            <p className="text-xl text-starithm-rich-black/70 max-w-3xl mx-auto">
              Interactive charts and visualizations to help you understand the cosmos
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-starithm-electric-violet mb-6">
                Real-Time Data Visualization
              </h3>
              <p className="text-lg text-starithm-rich-black/70 mb-8 leading-relaxed">
                Explore astronomical data through interactive charts, graphs, and 3D visualizations. 
                Track celestial events, analyze patterns, and discover new insights with our powerful 
                visualization tools.
              </p>
              <Button 
                size="lg"
                className="bg-starithm-electric-violet hover:bg-starithm-electric-violet/90 text-white px-8 py-4 text-lg"
                onClick={() => window.open('http://localhost:3000', '_blank')}
              >
                Explore Data
              </Button>
            </div>
            
            <div className="relative">
              <div className="w-full h-80 bg-gradient-to-br from-starithm-electric-violet/10 to-starithm-veronica/10 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-starithm-rich-black/60 text-lg">Interactive Charts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-r from-white via-starithm-electric-violet/5 to-white">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold text-starithm-electric-violet mb-8">
              Join the Astronomer's Network Today
            </h2>
            
            <p className="text-2xl lg:text-3xl text-starithm-rich-black/80 mb-10 leading-relaxed">
              Connect with researchers worldwide, access real-time data, and accelerate your discoveries
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button 
                size="lg"
                className="bg-starithm-selective-yellow hover:bg-starithm-selective-yellow/90 text-starithm-rich-black px-12 py-5 text-xl font-bold shadow-lg"
              >
                Get Started Free
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="border-starithm-electric-violet text-starithm-electric-violet bg-white hover:bg-starithm-electric-violet/10 px-12 py-5 text-xl font-bold"
                onClick={() => window.open('http://localhost:3000', '_blank')}
              >
                View Live Alerts
              </Button>
            </div>
            
            <div className="text-starithm-rich-black/60 text-lg">
              No credit card required • 14-day free trial
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-starithm-electric-violet/20 py-16">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src="/logo_without_name.png" 
                  alt="Starithm Logo" 
                  className="w-10 h-10"
                />
                <h3 className="text-2xl font-bold text-starithm-electric-violet">Starithm</h3>
              </div>
              <p className="text-starithm-rich-black/70 mb-6 text-lg leading-relaxed">
                The astronomer's platform for real-time alerts and collaboration.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-starithm-electric-violet/20 rounded-full flex items-center justify-center hover:bg-starithm-electric-violet/30 transition-colors cursor-pointer">
                  <span className="text-starithm-electric-violet font-bold">T</span>
                </div>
                <div className="w-10 h-10 bg-starithm-veronica/20 rounded-full flex items-center justify-center hover:bg-starithm-veronica/30 transition-colors cursor-pointer">
                  <span className="text-starithm-veronica font-bold">G</span>
                </div>
                <div className="w-10 h-10 bg-starithm-selective-yellow/20 rounded-full flex items-center justify-center hover:bg-starithm-selective-yellow/30 transition-colors cursor-pointer">
                  <span className="text-starithm-selective-yellow font-bold">L</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-starithm-rich-black mb-6 text-xl">Platform</h4>
              <ul className="space-y-3 text-starithm-rich-black/70 text-lg">
                <li><a href="#features" className="hover:text-starithm-electric-violet transition-colors">Features</a></li>
                <li><a href="#data" className="hover:text-starithm-electric-violet transition-colors">Data Sources</a></li>
                <li><a href="#" className="hover:text-starithm-electric-violet transition-colors">API</a></li>
                <li><a href="#" className="hover:text-starithm-electric-violet transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-starithm-rich-black mb-6 text-xl">Community</h4>
              <ul className="space-y-3 text-starithm-rich-black/70 text-lg">
                <li><a href="#" className="hover:text-starithm-electric-violet transition-colors">Forums</a></li>
                <li><a href="#" className="hover:text-starithm-electric-violet transition-colors">Research Groups</a></li>
                <li><a href="#" className="hover:text-starithm-electric-violet transition-colors">Events</a></li>
                <li><a href="#" className="hover:text-starithm-electric-violet transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-starithm-rich-black mb-6 text-xl">Support</h4>
              <ul className="space-y-3 text-starithm-rich-black/70 text-lg">
                <li><a href="#" className="hover:text-starithm-electric-violet transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-starithm-electric-violet transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-starithm-electric-violet transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-starithm-electric-violet transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-starithm-electric-violet/20 mt-16 pt-10 text-center text-starithm-rich-black/60 text-lg">
            <p>&copy; 2025 Starithm. All rights reserved. Built for the astronomical community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
