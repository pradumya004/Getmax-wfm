import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, AlertTriangle, Bot, UserCheck, Shuffle, Settings, ChevronUp, ChevronDown } from 'lucide-react';

const assignmentModes = [
  { 
    id: 'auto', 
    name: 'Auto Assignment', 
    description: 'AI-powered automatic distribution',
    icon: Bot
  },
  { 
    id: 'manual', 
    name: 'Manual Assignment', 
    description: 'Manual claim distribution',
    icon: UserCheck
  },
  { 
    id: 'hybrid', 
    name: 'Hybrid Mode', 
    description: 'Combination of auto and manual',
    icon: Shuffle
  }
];

const priorityRules = [
  'Aging (Days Outstanding)',
  'Denial Type Severity',
  'Payer Priority',
  'Claim Amount',
  'Client SLA Requirements'
];

const AllocationRulesTab = () => {
  const [assignmentMode, setAssignmentMode] = useState('auto');
  const [floatingPoolEnabled, setFloatingPoolEnabled] = useState(true);
  const [autoRedistribute, setAutoRedistribute] = useState(false);

  const handleAssignment = (mode) => {
    alert("🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀");
  };

  const handleConfigure = (rule) => {
    alert(`🔧 Configure ${rule} settings - Feature coming soon! 🚀`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Assignment Mode Card */}
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300">
          <CardHeader className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-t-lg"></div>
            <CardTitle className="text-white flex items-center space-x-3 relative z-10">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold">Assignment Mode</span>
            </CardTitle>
            <CardDescription className="text-blue-100/80 relative z-10 text-base">
              Configure how claims are distributed to employees
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/20 rounded-b-lg pointer-events-none"></div>
            {assignmentModes.map((mode) => {
              const IconComponent = mode.icon;
              return (
                <div
                  key={mode.id}
                  className={`relative p-5 rounded-xl border cursor-pointer transition-all duration-300 group ${
                    assignmentMode === mode.id
                      ? 'border-blue-400/60 bg-gradient-to-r from-blue-500/20 to-purple-500/20 shadow-lg shadow-blue-500/25'
                      : 'border-white/20 hover:border-blue-400/40 hover:bg-white/5'
                  }`}
                  onClick={() => setAssignmentMode(mode.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg transition-all duration-300 ${
                        assignmentMode === mode.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/50'
                          : 'bg-white/10 group-hover:bg-white/20'
                      }`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-lg">{mode.name}</h4>
                        <p className="text-blue-100/70 text-sm">{mode.description}</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                      assignmentMode === mode.id
                        ? 'border-blue-400 bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/50'
                        : 'border-white/40 group-hover:border-blue-400/60'
                    }`}>
                      {assignmentMode === mode.id && (
                        <div className="w-full h-full rounded-full bg-white/30 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  {assignmentMode === mode.id && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>
                  )}
                </div>
              );
            })}
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-[1.02] border-0"
              onClick={() => handleAssignment(assignmentMode)}
            >
              <Users className="h-5 w-5 mr-2" />
              Apply Assignment Mode
            </Button>
          </CardContent>
        </Card>

        {/* Priority Rules Card */}
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300">
          <CardHeader className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-t-lg"></div>
            <CardTitle className="text-white flex items-center space-x-3 relative z-10">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold">Priority Rules</span>
            </CardTitle>
            <CardDescription className="text-purple-100/80 relative z-10 text-base">
              Configure claim prioritization logic
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/20 rounded-b-lg pointer-events-none"></div>
            {priorityRules.map((rule, index) => (
              <div 
                key={rule} 
                className="flex items-center justify-between p-4 backdrop-blur-sm bg-white/10 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-lg flex items-center justify-center text-sm shadow-lg">
                      #{index + 1}
                    </span>
                  </div>
                  <span className="text-white font-medium">{rule}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-purple-200 hover:text-white hover:bg-white/20 transition-all duration-300"
                    onClick={() => handleConfigure(rule)}
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Configure
                  </Button>
                  <div className="flex flex-col space-y-1">
                    <Button variant="ghost" size="sm" className="p-1 h-6 w-6 text-purple-200 hover:text-white hover:bg-white/20">
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-1 h-6 w-6 text-purple-200 hover:text-white hover:bg-white/20">
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="pt-6 border-t border-white/20">
              <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400"></div>
                <span>Floating Pool Logic</span>
              </h4>
              <div className="space-y-4">
                <label className="flex items-center space-x-3 text-white cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={floatingPoolEnabled}
                      onChange={(e) => setFloatingPoolEnabled(e.target.checked)}
                    />
                    <div className={`w-5 h-5 rounded border-2 transition-all duration-300 ${
                      floatingPoolEnabled 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 border-purple-400 shadow-lg shadow-purple-500/50' 
                        : 'border-white/40 group-hover:border-purple-400/60'
                    }`}>
                      {floatingPoolEnabled && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-medium">Enable overflow to floating pool</span>
                </label>
                <label className="flex items-center space-x-3 text-white cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={autoRedistribute}
                      onChange={(e) => setAutoRedistribute(e.target.checked)}
                    />
                    <div className={`w-5 h-5 rounded border-2 transition-all duration-300 ${
                      autoRedistribute 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 border-purple-400 shadow-lg shadow-purple-500/50' 
                        : 'border-white/40 group-hover:border-purple-400/60'
                    }`}>
                      {autoRedistribute && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-medium">Auto-redistribute from pool</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Floating particles effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AllocationRulesTab;