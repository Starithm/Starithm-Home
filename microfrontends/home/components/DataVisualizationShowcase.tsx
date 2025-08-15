import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function DataVisualizationShowcase() {
  // Mock data for charts
  const eventData = [
    { month: 'Jan', events: 42, alerts: 15 },
    { month: 'Feb', events: 38, alerts: 12 },
    { month: 'Mar', events: 55, alerts: 22 },
    { month: 'Apr', events: 47, alerts: 18 },
    { month: 'May', events: 62, alerts: 28 },
    { month: 'Jun', events: 58, alerts: 25 }
  ];

  const eventTypes = [
    { name: 'Supernovae', value: 35, color: '#770ff5' },
    { name: 'GRBs', value: 25, color: '#A239CA' },
    { name: 'Variables', value: 30, color: '#FFB400' },
    { name: 'Others', value: 10, color: '#0E0B16' }
  ];

  const observatoryData = [
    { name: 'LSST', active: 95, scheduled: 78 },
    { name: 'HST', active: 87, scheduled: 92 },
    { name: 'JWST', active: 92, scheduled: 88 },
    { name: 'VLT', active: 78, scheduled: 85 },
    { name: 'Keck', active: 83, scheduled: 79 }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-starithm-rich-black mb-6">
            Real-Time Data Visualization
          </h2>
          <p className="text-2xl text-starithm-rich-black/70 max-w-3xl mx-auto">
            Interactive dashboards and analytics powered by live astronomical data feeds
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Event Timeline Chart */}
          <div className="lg:col-span-2 bg-white border-2 border-starithm-electric-violet/20 rounded-2xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-starithm-rich-black mb-6">Event Timeline</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={eventData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#A239CA40" />
                  <XAxis dataKey="month" stroke="#0E0B16" />
                  <YAxis stroke="#0E0B16" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '2px solid #770ff5', 
                      borderRadius: '12px',
                      color: '#0E0B16',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                  <Line type="monotone" dataKey="events" stroke="#770ff5" strokeWidth={4} />
                  <Line type="monotone" dataKey="alerts" stroke="#FFB400" strokeWidth={4} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Event Types Pie Chart */}
          <div className="bg-white border-2 border-starithm-veronica/20 rounded-2xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-starithm-rich-black mb-6">Event Types</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eventTypes}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    stroke="none"
                  >
                    {eventTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '2px solid #A239CA', 
                      borderRadius: '12px',
                      color: '#0E0B16',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Observatory Status */}
          <div className="lg:col-span-3 bg-white border-2 border-starithm-selective-yellow/20 rounded-2xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-starithm-rich-black mb-6">Observatory Network Status</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={observatoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#A239CA40" />
                  <XAxis dataKey="name" stroke="#0E0B16" />
                  <YAxis stroke="#0E0B16" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '2px solid #FFB400', 
                      borderRadius: '12px',
                      color: '#0E0B16',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                  <Bar dataKey="active" fill="#770ff5" radius={4} />
                  <Bar dataKey="scheduled" fill="#A239CA" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sky Map Mockup */}
        <div className="mt-12 bg-white border-2 border-starithm-electric-violet/20 rounded-2xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-starithm-rich-black mb-6">Live Sky Map</h3>
          <div className="relative h-64 bg-gradient-radial from-starithm-electric-violet/10 to-gray-50 rounded-xl overflow-hidden">
            {/* Mock constellation lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
              <g stroke="#770ff5" strokeWidth="2" fill="none" opacity="0.8">
                <path d="M50,50 L100,80 L150,60 L200,90" />
                <path d="M250,40 L300,70 L350,50" />
                <path d="M100,120 L150,140 L200,130 L250,150" />
              </g>
              <g fill="#FFB400" opacity="1">
                <circle cx="50" cy="50" r="3" />
                <circle cx="100" cy="80" r="4" />
                <circle cx="150" cy="60" r="3" />
                <circle cx="200" cy="90" r="5" />
                <circle cx="250" cy="40" r="3" />
                <circle cx="300" cy="70" r="4" />
                <circle cx="350" cy="50" r="3" />
                <circle cx="100" cy="120" r="3" />
                <circle cx="150" cy="140" r="4" />
                <circle cx="200" cy="130" r="3" />
                <circle cx="250" cy="150" r="5" />
              </g>
              {/* Alert markers */}
              <g fill="#FFB400" opacity="1">
                <circle cx="200" cy="90" r="8" className="animate-pulse" />
                <circle cx="250" cy="150" r="8" className="animate-pulse" />
              </g>
            </svg>
            <div className="absolute top-4 right-4 bg-white/90 px-4 py-3 rounded-lg border-2 border-starithm-selective-yellow/40 shadow-sm">
              <div className="text-starithm-selective-yellow font-bold text-lg">2 Active Alerts</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}