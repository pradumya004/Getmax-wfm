import React, { useState, useEffect } from 'react';
import { HeartPulse, CheckCircle, AlertTriangle, XCircle, Activity, Server, Database, Zap, Users } from 'lucide-react';

const modules = [
  {
    name: 'CRM',
    status: 'Operational',
    uptime: '99.9%',
    responseTime: '120ms',
    icon: Database,
    lastCheck: '30s ago',
    description: 'Customer Relations'
  },
  {
    name: 'WFM',
    status: 'Operational',
    uptime: '99.7%',
    responseTime: '95ms',
    icon: Users,
    lastCheck: '45s ago',
    description: 'Workforce Management'
  },
  {
    name: 'Claim Intake',
    status: 'Degraded Performance',
    uptime: '94.2%',
    responseTime: '850ms',
    icon: Server,
    lastCheck: '1m ago',
    description: 'Claims Processing'
  },
  {
    name: 'QA Engine',
    status: 'Operational',
    uptime: '99.8%',
    responseTime: '200ms',
    icon: Zap,
    lastCheck: '15s ago',
    description: 'Quality Assurance'
  },
];

const Card = ({ className, children }) => (
  <div className={className}>{children}</div>
);
const CardHeader = ({ className, children }) => (
  <div className={className}>{children}</div>
);
const CardTitle = ({ className, children }) => (
  <h3 className={className}>{children}</h3>
);
const CardContent = ({ children }) => (
  <div className="px-6 pb-6">{children}</div>
);

const ModuleHealthTile = () => {
  const [pulse, setPulse] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status) => {
    if (status === 'Operational') return CheckCircle;
    if (status === 'Degraded Performance') return AlertTriangle;
    return XCircle;
  };

  const getStatusColor = (status) => {
    if (status === 'Operational') return {
      icon: 'text-emerald-400',
      bg: 'from-emerald-500/20 to-green-600/20',
      border: 'border-emerald-400/40',
      dot: 'bg-emerald-400',
      text: 'text-emerald-300'
    };
    if (status === 'Degraded Performance') return {
      icon: 'text-amber-400',
      bg: 'from-amber-500/20 to-orange-600/20',
      border: 'border-amber-400/40',
      dot: 'bg-amber-400',
      text: 'text-amber-300'
    };
    return {
      icon: 'text-red-400',
      bg: 'from-red-500/20 to-red-600/20',
      border: 'border-red-400/40',
      dot: 'bg-red-400',
      text: 'text-red-300'
    };
  };

  const getOverallHealth = () => {
    const operational = modules.filter(m => m.status === 'Operational').length;
    const total = modules.length;
    const percentage = (operational / total) * 100;

    if (percentage === 100) return { status: 'Excellent', color: 'text-emerald-400', bg: 'from-emerald-400/20 to-green-500/20' };
    if (percentage >= 75) return { status: 'Good', color: 'text-amber-400', bg: 'from-amber-400/20 to-yellow-500/20' };
    return { status: 'Critical', color: 'text-red-400', bg: 'from-red-400/20 to-red-500/20' };
  };

  const overallHealth = getOverallHealth();

  return (
    <Card className="backdrop-blur-xl bg-white/10 border border-white/20 h-full rounded-2xl shadow-2xl hover:shadow-cyan-400/20 transition-all duration-300">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-white text-xl flex items-center gap-3 font-semibold">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${overallHealth.bg} ${pulse ? 'scale-110' : 'scale-100'} transition-transform duration-500`}>
            <HeartPulse className={`w-5 h-5 ${overallHealth.color} ${pulse ? 'animate-pulse' : ''}`} />
          </div>
          <span className="bg-gradient-to-r from-cyan-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Module Health
          </span>
          <div className="ml-auto flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor('Operational').dot} ${pulse ? 'animate-ping' : ''}`}></div>
            <span className={`text-sm ${overallHealth.color} font-medium`}>
              {overallHealth.status}
            </span>
          </div>
        </CardTitle>

        <div className={`mt-4 p-3 rounded-lg bg-gradient-to-r ${overallHealth.bg} border ${overallHealth.color.replace('text-', 'border-').replace('-400', '-400/40')}`}>
          <div className="flex items-center justify-between">
            <span className="text-white text-sm font-medium">System Status</span>
            <span className={`${overallHealth.color} text-sm font-semibold`}>
              {modules.filter(m => m.status === 'Operational').length}/{modules.length} Online
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-300/50 scrollbar-track-transparent">
          {modules.map((module, index) => {
            const StatusIcon = getStatusIcon(module.status);
            const ModuleIcon = module.icon;
            const colors = getStatusColor(module.status);

            return (
              <div
                key={index}
                className={`group relative p-4 rounded-xl bg-gradient-to-r ${colors.bg} border ${colors.border}
                  hover:scale-[1.02] transition-all duration-300 cursor-pointer
                  ${hoveredIndex === index ? 'shadow-lg' : ''}
                `}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-gradient-to-r blur-sm transition-opacity duration-300"></div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${colors.bg} border ${colors.border}`}>
                        <ModuleIcon className={`w-4 h-4 ${colors.icon}`} />
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">{module.name}</div>
                        <div className="text-blue-200/70 text-xs">{module.description}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors.text} bg-gradient-to-r ${colors.bg}`}>
                        {module.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-blue-200/70">
                    <span>↑ {module.uptime}</span>
                    <span>⚡ {module.responseTime}</span>
                    <span>🕒 {module.lastCheck}</span>
                  </div>
                </div>

                {hoveredIndex === index && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className={`absolute top-2 right-2 w-1 h-1 ${colors.dot} rounded-full animate-ping`}></div>
                    <div className={`absolute bottom-2 left-2 w-1 h-1 ${colors.dot} rounded-full animate-ping delay-150`}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-emerald-400 font-bold text-lg">
                {((modules.filter(m => m.status === 'Operational').length / modules.length) * 100).toFixed(1)}%
              </div>
              <div className="text-blue-200/70 text-xs">Uptime</div>
            </div>
            <div>
              <div className="text-cyan-400 font-bold text-lg">
                {Math.round(modules.reduce((acc, m) => acc + parseFloat(m.responseTime), 0) / modules.length)}ms
              </div>
              <div className="text-blue-200/70 text-xs">Avg Response</div>
            </div>
            <div>
              <div className="text-purple-400 font-bold text-lg">{modules.length}</div>
              <div className="text-blue-200/70 text-xs">Modules</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleHealthTile;