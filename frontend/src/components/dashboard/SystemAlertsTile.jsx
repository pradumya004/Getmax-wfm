import React, { useState, useEffect } from 'react';
import { AlertTriangle, DatabaseZap, CopyX, Activity, Shield, ArrowUp, Clock } from 'lucide-react';

const alerts = [
  {
    text: 'API Error: EHR connection failed',
    icon: DatabaseZap,
    color: 'text-red-400',
    bgColor: 'from-red-500/20 to-red-600/20',
    borderColor: 'border-red-400/40',
    severity: 'Critical',
    category: 'Integration',
    timeframe: '2m ago',
    status: 'Active'
  },
  {
    text: 'Duplicate Claim #C-13457 detected',
    icon: CopyX,
    color: 'text-amber-400',
    bgColor: 'from-amber-500/20 to-orange-600/20',
    borderColor: 'border-amber-400/40',
    severity: 'High',
    category: 'Data Quality',
    timeframe: '5m ago',
    status: 'Active'
  },
  {
    text: 'High CPU usage on worker node',
    icon: Activity,
    color: 'text-yellow-400',
    bgColor: 'from-yellow-500/20 to-amber-600/20',
    borderColor: 'border-yellow-400/40',
    severity: 'Medium',
    category: 'Performance',
    timeframe: '12m ago',
    status: 'Monitoring'
  },
  {
    text: 'Security scan completed successfully',
    icon: Shield,
    color: 'text-green-400',
    bgColor: 'from-green-500/20 to-emerald-600/20',
    borderColor: 'border-green-400/40',
    severity: 'Info',
    category: 'Security',
    timeframe: '1h ago',
    status: 'Resolved'
  }
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

const SystemAlertsTile = () => {
  const [urgentPulse, setUrgentPulse] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setUrgentPulse(prev => !prev);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Critical': return 'text-red-400 bg-red-500/20';
      case 'High': return 'text-amber-400 bg-amber-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'Info': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'text-red-300 bg-red-500/20';
      case 'Monitoring': return 'text-yellow-300 bg-yellow-500/20';
      case 'Resolved': return 'text-green-300 bg-green-500/20';
      default: return 'text-gray-300 bg-gray-500/20';
    }
  };

  const getActiveAlerts = () => alerts.filter(alert => alert.status === 'Active').length;
  const getCriticalAlerts = () => alerts.filter(alert => alert.severity === 'Critical').length;

  return (
    <Card className="backdrop-blur-xl bg-white/10 border border-white/20 h-full rounded-2xl shadow-2xl hover:shadow-[#39ff14]/20 transition-all duration-300">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-white text-xl flex items-center gap-3 font-semibold">
          <div className={`p-2 rounded-lg bg-gradient-to-r from-[#39ff14]/20 to-green-500/20 ${urgentPulse ? 'scale-110' : 'scale-100'} transition-transform duration-500`}>
            <AlertTriangle className={`w-5 h-5 text-[#39ff14] ${urgentPulse ? 'animate-pulse' : ''}`} />
          </div>
          <span className="bg-gradient-to-r from-[#39ff14] via-green-200 to-emerald-200 bg-clip-text text-transparent">
            System Alerts
          </span>
          <div className="ml-auto flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full bg-red-400 ${urgentPulse ? 'animate-ping' : ''}`}></div>
            <span className="text-red-400 text-sm font-medium">
              {getCriticalAlerts()} Critical
            </span>
          </div>
        </CardTitle>
        
        {/* Summary Cards */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-400/40">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-red-300 text-sm font-medium">Active</span>
            </div>
            <div className="text-white font-bold text-lg mt-1">{getActiveAlerts()}</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-r from-[#39ff14]/20 to-green-600/20 border border-[#39ff14]/40">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#39ff14]" />
              <span className="text-green-300 text-sm font-medium">Total</span>
            </div>
            <div className="text-white font-bold text-lg mt-1">{alerts.length}</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400/50 scrollbar-track-transparent">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`
                group relative p-4 rounded-xl 
                bg-gradient-to-r ${alert.bgColor} 
                border ${alert.borderColor}
                hover:scale-[1.02] transition-all duration-300 cursor-pointer
                ${hoveredIndex === index ? 'shadow-lg' : ''}
                ${alert.severity === 'Critical' && urgentPulse ? 'ring-2 ring-red-400/50' : ''}
              `}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Background glow effect */}
              <div className={`
                absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 
                bg-gradient-to-r ${alert.bgColor} blur-sm transition-opacity duration-300
              `}></div>
              
              <div className="relative z-10">
                {/* Alert header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${alert.bgColor} border ${alert.borderColor} ${alert.severity === 'Critical' ? 'animate-pulse' : ''}`}>
                      <alert.icon className={`w-4 h-4 ${alert.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm leading-relaxed">
                        {alert.text}
                      </div>
                      <div className="text-blue-200/70 text-xs mt-1">
                        {alert.category}
                      </div>
                    </div>
                  </div>
                  
                  {/* Severity and status */}
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(alert.status)}`}>
                      {alert.status}
                    </span>
                  </div>
                </div>
                
                {/* Alert footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className={`w-3 h-3 ${alert.color}`} />
                    <span className={`text-xs ${alert.color}`}>
                      {alert.timeframe}
                    </span>
                  </div>
                  
                  {alert.severity === 'Critical' && (
                    <div className="flex items-center gap-1">
                      <ArrowUp className="w-3 h-3 text-red-400 animate-bounce" />
                      <span className="text-xs text-red-300 font-medium">Urgent</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Hover particles */}
              {hoveredIndex === index && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className={`absolute top-2 right-2 w-1 h-1 ${alert.color.replace('text-', 'bg-')} rounded-full animate-ping`}></div>
                  <div className={`absolute bottom-2 left-2 w-1 h-1 ${alert.color.replace('text-', 'bg-')} rounded-full animate-ping delay-150`}></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Action Footer */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#39ff14]" />
              <span className="text-green-300 text-sm">Real-time monitoring</span>
            </div>
            <div className="text-blue-200/70 text-xs">
              Last scan: 30s ago
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemAlertsTile;