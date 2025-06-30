import React, { useState, useEffect } from 'react';
import { Clock, FileWarning, AlertTriangle, Zap, Users, CheckCircle, Calendar, ArrowUp } from 'lucide-react';

const tasks = [
  { 
    text: '3 SLA tasks are overdue', 
    icon: AlertTriangle, 
    color: 'text-red-400',
    bgColor: 'from-red-500/20 to-red-600/20',
    borderColor: 'border-red-400/40',
    priority: 'Critical',
    count: 3,
    timeframe: 'Overdue',
    category: 'SLA Breach'
  },
  { 
    text: '12 claims are unassigned', 
    icon: FileWarning, 
    color: 'text-amber-400',
    bgColor: 'from-amber-500/20 to-orange-600/20',
    borderColor: 'border-amber-400/40',
    priority: 'High',
    count: 12,
    timeframe: 'Pending',
    category: 'Assignment'
  },
  { 
    text: '5 claims pending QA for > 24h', 
    icon: Clock, 
    color: 'text-yellow-400',
    bgColor: 'from-yellow-500/20 to-amber-600/20',
    borderColor: 'border-yellow-400/40',
    priority: 'Medium',
    count: 5,
    timeframe: '> 24h',
    category: 'QA Review'
  },
  { 
    text: '8 approvals needed from managers', 
    icon: Users, 
    color: 'text-blue-400',
    bgColor: 'from-blue-500/20 to-cyan-600/20',
    borderColor: 'border-blue-400/40',
    priority: 'Medium',
    count: 8,
    timeframe: 'Pending',
    category: 'Approval'
  },
  { 
    text: '15 documents awaiting review', 
    icon: FileWarning, 
    color: 'text-purple-400',
    bgColor: 'from-purple-500/20 to-pink-600/20',
    borderColor: 'border-purple-400/40',
    priority: 'Low',
    count: 15,
    timeframe: '< 24h',
    category: 'Review'
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

const PendingTasksTile = () => {
  const [urgentPulse, setUrgentPulse] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setUrgentPulse(prev => !prev);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return 'text-red-400 bg-red-500/20';
      case 'High': return 'text-amber-400 bg-amber-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'Low': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getTotalTasks = () => tasks.reduce((sum, task) => sum + task.count, 0);
  const getCriticalTasks = () => tasks.filter(task => task.priority === 'Critical').reduce((sum, task) => sum + task.count, 0);

  return (
    <Card className="backdrop-blur-xl bg-white/10 border border-white/20 h-full rounded-2xl shadow-2xl hover:shadow-red-500/20 transition-all duration-300">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-white text-xl flex items-center gap-3 font-semibold">
          <div className={`p-2 rounded-lg bg-gradient-to-r from-red-400/20 to-amber-500/20 ${urgentPulse ? 'scale-110' : 'scale-100'} transition-transform duration-500`}>
            <Clock className={`w-5 h-5 text-red-400 ${urgentPulse ? 'animate-pulse' : ''}`} />
          </div>
          <span className="bg-gradient-to-r from-red-200 via-amber-200 to-yellow-200 bg-clip-text text-transparent">
            Pending Tasks
          </span>
          <div className="ml-auto flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full bg-red-400 ${urgentPulse ? 'animate-ping' : ''}`}></div>
            <span className="text-red-400 text-sm font-medium">
              {getCriticalTasks()} Urgent
            </span>
          </div>
        </CardTitle>
        
        {/* Summary Cards */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-400/40">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-red-300 text-sm font-medium">Critical</span>
            </div>
            <div className="text-white font-bold text-lg mt-1">{getCriticalTasks()}</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/40">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-300 text-sm font-medium">Total</span>
            </div>
            <div className="text-white font-bold text-lg mt-1">{getTotalTasks()}</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400/50 scrollbar-track-transparent">
          {tasks.map((task, index) => (
            <div
              key={index}
              className={`
                group relative p-4 rounded-xl 
                bg-gradient-to-r ${task.bgColor} 
                border ${task.borderColor}
                hover:scale-[1.02] transition-all duration-300 cursor-pointer
                ${hoveredIndex === index ? 'shadow-lg' : ''}
                ${task.priority === 'Critical' && urgentPulse ? 'ring-2 ring-red-400/50' : ''}
              `}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Background glow effect */}
              <div className={`
                absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 
                bg-gradient-to-r ${task.bgColor} blur-sm transition-opacity duration-300
              `}></div>
              
              <div className="relative z-10">
                {/* Task header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${task.bgColor} border ${task.borderColor} ${task.priority === 'Critical' ? 'animate-pulse' : ''}`}>
                      <task.icon className={`w-4 h-4 ${task.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm leading-relaxed">
                        {task.text}
                      </div>
                      <div className="text-blue-200/70 text-xs mt-1">
                        {task.category}
                      </div>
                    </div>
                  </div>
                  
                  {/* Priority and count */}
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <div className="flex items-center gap-1">
                      <div className={`w-6 h-6 rounded-full ${task.color.replace('text-', 'bg-').replace('-400', '-400/20')} flex items-center justify-center`}>
                        <span className={`text-xs font-bold ${task.color}`}>
                          {task.count}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Task footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className={`w-3 h-3 ${task.color}`} />
                    <span className={`text-xs ${task.color}`}>
                      {task.timeframe}
                    </span>
                  </div>
                  
                  {task.priority === 'Critical' && (
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
                  <div className={`absolute top-2 right-2 w-1 h-1 ${task.color.replace('text-', 'bg-')} rounded-full animate-ping`}></div>
                  <div className={`absolute bottom-2 left-2 w-1 h-1 ${task.color.replace('text-', 'bg-')} rounded-full animate-ping delay-150`}></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Action Footer */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-sm">Auto-refresh enabled</span>
            </div>
            <div className="text-blue-200/70 text-xs">
              Last updated: 2 min ago
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingTasksTile;