import { Button } from "../../../shared/components/ui/button";

export function CallToActionBanner() {
  return (
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
              variant="secondary"
              size="lg"
              className="px-12 py-5 text-xl font-bold shadow-lg"
            >
              Get Started Free
            </Button>
            
            <div className="text-starithm-rich-black/60 text-lg">
              No credit card required • 14-day free trial
            </div>
          </div>
          
          {/* Trust indicators */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-starithm-electric-violet mb-3">99.9%</div>
              <div className="text-starithm-rich-black/70 text-lg">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-starithm-veronica mb-3">24/7</div>
              <div className="text-starithm-rich-black/70 text-lg">Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-starithm-selective-yellow mb-3">SOC 2</div>
              <div className="text-starithm-rich-black/70 text-lg">Compliant</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}