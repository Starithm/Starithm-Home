export function KeyMetrics() {
  const metrics = [
    {
      number: "500+",
      label: "Astronomical Events",
      color: "text-starithm-electric-violet",
      bgColor: "bg-starithm-electric-violet/5",
      borderColor: "border-starithm-electric-violet/30"
    },
    {
      number: "50+",
      label: "Expert Astronomers",
      color: "text-starithm-veronica",
      bgColor: "bg-starithm-veronica/5",
      borderColor: "border-starithm-veronica/30"
    },
    {
      number: "1000+",
      label: "Hours of Observation Data",
      color: "text-starithm-selective-yellow",
      bgColor: "bg-starithm-selective-yellow/5",
      borderColor: "border-starithm-selective-yellow/30"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {metrics.map((metric, index) => (
            <div 
              key={index} 
              className={`text-center p-10 rounded-2xl border-2 ${metric.bgColor} ${metric.borderColor} hover:scale-105 transition-transform duration-300 shadow-sm`}
            >
              <div className={`text-5xl lg:text-6xl font-bold ${metric.color} mb-3`}>
                {metric.number}
              </div>
              <div className="text-starithm-rich-black/70 text-xl">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}