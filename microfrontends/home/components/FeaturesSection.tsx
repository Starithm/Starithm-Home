import { Database, BarChart3, Users, Brain } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Database,
      title: "Pre-Connected Brokers",
      description: "Seamlessly integrated with major astronomical data brokers and observatories worldwide.",
      color: "text-starithm-electric-violet",
      bgColor: "bg-starithm-electric-violet/5",
      borderColor: "border-starithm-electric-violet/30"
    },
    {
      icon: BarChart3,
      title: "Event Dashboards",
      description: "Real-time visualization of astronomical events with customizable charts and data views.",
      color: "text-starithm-veronica",
      bgColor: "bg-starithm-veronica/5",
      borderColor: "border-starithm-veronica/30"
    },
    {
      icon: Users,
      title: "Community Tools",
      description: "Collaborate with fellow astronomers, share observations, and build research networks.",
      color: "text-starithm-selective-yellow",
      bgColor: "bg-starithm-selective-yellow/5",
      borderColor: "border-starithm-selective-yellow/30"
    },
    {
      icon: Brain,
      title: "AI Insights",
      description: "Machine learning powered analysis and pattern recognition for astronomical data.",
      color: "text-starithm-electric-violet",
      bgColor: "bg-starithm-electric-violet/5",
      borderColor: "border-starithm-electric-violet/30"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-starithm-rich-black mb-6">
            Everything You Need for Astronomical Research
          </h2>
          <p className="text-2xl text-starithm-rich-black/70 max-w-3xl mx-auto">
            Comprehensive tools designed by astronomers, for astronomers
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`p-8 rounded-2xl border-2 ${feature.bgColor} ${feature.borderColor} hover:scale-105 transition-all duration-300 group shadow-sm`}
            >
              <div className={`w-14 h-14 ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon size={56} />
              </div>
              
              <h3 className="text-2xl font-bold text-starithm-rich-black mb-4">
                {feature.title}
              </h3>
              
              <p className="text-starithm-rich-black/70 leading-relaxed text-lg">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}