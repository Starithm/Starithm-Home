import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Circle, Clock, Users, Database, Bell } from 'lucide-react';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
  category: 'feature' | 'improvement' | 'infrastructure';
}

const roadmapItems: RoadmapItem[] = [
  {
    id: '1',
    title: 'Real-Time Alert Notifications',
    description: 'Push notifications and email alerts for new astronomical events',
    status: 'completed',
    category: 'feature',
  },
  {
    id: '2',
    title: 'Multiple Brokers Integration',
    description: 'Connecting with multiple brokers to get the most comprehensive data',
    status: 'in-progress',
    category: 'feature',
  },
  {
    id: '3',
    title: 'Automated Skymap generation for Kafka events',
    description: 'Automated skymap generation for Kafka events',
    status: 'in-progress',
    category: 'feature',
  },
  {
    id: '4',
    title: 'Advanced Search & Filtering',
    description: 'Enhanced search capabilities with multiple filter options',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '5',
    title: 'Collaborative Research Groups',
    description: 'Create and manage research groups for team collaboration',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '6',
    title: 'Data Visualization Dashboard',
    description: 'Interactive charts and 3D visualizations for astronomical data',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '7',
    title: 'API Documentation & SDKs',
    description: 'Comprehensive API documentation and SDKs for developers',
    status: 'planned',
    category: 'infrastructure',
  },
  {
    id: '8',
    title: 'AI First',
    description: 'AI-powered event insights',
    status: 'planned',
    category: 'feature',
  },
  {
    id: '9',
    title: 'International Observatory Integration',
    description: 'Connect with additional global observatories',
    status: 'planned',
    category: 'infrastructure',
  }
];

const getStatusIcon = (status: RoadmapItem['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'in-progress':
      return <Clock className="h-5 w-5 text-blue-500" />;
    case 'planned':
      return <Circle className="h-5 w-5 text-gray-400" />;
  }
};



const getCategoryIcon = (category: RoadmapItem['category']) => {
  switch (category) {
    case 'feature':
      return <Bell className="h-4 w-4 text-starithm-electric-violet" />;
    case 'improvement':
      return <Users className="h-4 w-4 text-starithm-veronica" />;
    case 'infrastructure':
      return <Database className="h-4 w-4 text-starithm-selective-yellow" />;
  }
};

const getStatusColor = (status: RoadmapItem['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'in-progress':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'planned':
      return 'bg-muted text-muted-foreground border-border';
  }
};

export default function Roadmap() {
  const completedItems = roadmapItems.filter(item => item.status === 'completed');
  const inProgressItems = roadmapItems.filter(item => item.status === 'in-progress');
  const plannedItems = roadmapItems.filter(item => item.status === 'planned');

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-background text-primary-foreground py-8">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Blog</span>
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold">Starithm Roadmap</h1>
              <p className="text-primary-foreground/80 mt-2">Upcoming Features & Development Timeline</p>
            </div>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 lg:px-8 py-12">
        {/* Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Development Overview</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <h3 className="text-lg font-semibold text-card-foreground">Completed</h3>
              </div>
              <p className="text-2xl font-bold text-green-500">{completedItems.length}</p>
              <p className="text-muted-foreground">Features delivered</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-6 w-6 text-blue-500" />
                <h3 className="text-lg font-semibold text-card-foreground">In Progress</h3>
              </div>
              <p className="text-2xl font-bold text-blue-500">{inProgressItems.length}</p>
              <p className="text-muted-foreground">Currently developing</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-2 mb-2">
                <Circle className="h-6 w-6 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-card-foreground">Planned</h3>
              </div>
              <p className="text-2xl font-bold text-muted-foreground">{plannedItems.length}</p>
              <p className="text-muted-foreground">Upcoming features</p>
            </div>
          </div>
        </div>

        {/* Roadmap Items */}
        <div className="space-y-8">
          {/* Completed */}
          {completedItems.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span>Completed Features</span>
              </h3>
              <div className="grid gap-6">
                {completedItems.map(item => (
                  <RoadmapItem key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}

          {/* In Progress */}
          {inProgressItems.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center space-x-2">
                <Clock className="h-6 w-6 text-blue-500" />
                <span>In Progress</span>
              </h3>
              <div className="grid gap-6">
                {inProgressItems.map(item => (
                  <RoadmapItem key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}

          {/* Planned */}
          {plannedItems.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center space-x-2">
                <Circle className="h-6 w-6 text-muted-foreground" />
                <span>Planned Features</span>
              </h3>
              <div className="grid gap-6">
                {plannedItems.map(item => (
                  <RoadmapItem key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function RoadmapItem({ item }: { item: RoadmapItem }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon(item.status)}
          <h4 className="text-lg font-semibold text-card-foreground">{item.title}</h4>
        </div>
        <div className="flex items-center space-x-2">
          {getCategoryIcon(item.category)}
        </div>
      </div>
      
      <p className="text-muted-foreground mb-4">{item.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(item.status)}`}>
            {item.status.replace('-', ' ')}
          </span>
        </div>
      </div>
    </div>
  );
}
