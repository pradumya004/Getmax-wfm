import React from 'react';
import { LayoutDashboard, Users, FileText, Users2, FileInput, Clock, ShieldCheck, Gamepad2, BarChart2, FileBox, Settings, PlugZap, Home, Waves, BookText, FileScan } from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/clients', icon: Users, label: 'Clients' },
  { href: '/sow', icon: FileText, label: 'SOWs' },
  { href: '/sop-management', icon: BookText, label: 'SOPs' },
  { href: '/employees', icon: Users2, label: 'Employees' },
  { href: '/claims', icon: FileInput, label: 'Claim Intake' },
  { href: '/charge-entry', icon: FileScan, label: 'Charge Entry' },
  { href: '/floating-pool', icon: Waves, label: 'Floating Pool' },
  { href: '/sla', icon: Clock, label: 'SLA Timer' },
  { href: '/qa', icon: ShieldCheck, label: 'QA Audit' },
  { href: '/gamification', icon: Gamepad2, label: 'Gamification' },
  { href: '/productivity', icon: BarChart2, label: 'Productivity' },
  { href: '/reports', icon: FileBox, label: 'Reports' },
  { href: '/settings', icon: Settings, label: 'Settings' },
  { href: '/integrations', icon: PlugZap, label: 'Integrations' },
];

const Sidebar = () => {
  const [activeItem, setActiveItem] = React.useState('/dashboard');

  const handleItemClick = (href) => {
    setActiveItem(href);
  };

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-blue-950/95 via-purple-950/95 to-indigo-950/95 backdrop-blur-lg border-r border-white/10 flex-shrink-0 p-4 flex flex-col relative overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Subtle animated gradient accent */}
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-blue-400/50 via-purple-400/50 to-indigo-400/50"></div>
      
      <div className="relative z-10">
        {/* Logo Section */}
        <div className="text-2xl font-bold mb-10 flex items-center gap-3 px-2 group">
         <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
  <span className="text-white font-bold text-lg">G</span>
</div>
<span className="bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent">
  GetMax
</span>
        </div>
        
        {/* Navigation */}
        <nav className="flex flex-col space-y-1.5 flex-grow">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleItemClick(item.href)}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 group relative overflow-hidden ${
                activeItem === item.href
                  ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-purple-400/30 shadow-lg shadow-purple-500/10'
                  : 'text-purple-200/80 hover:bg-white/10 hover:text-white hover:border-white/20 border border-transparent'
              }`}
            >
              {/* Active item glow effect */}
              {activeItem === item.href && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl"></div>
              )}
              
              <item.icon className={`w-5 h-5 mr-3 transition-all duration-300 relative z-10 ${
                activeItem === item.href 
                  ? 'text-purple-400 group-hover:text-white' 
                  : 'text-purple-300/70 group-hover:text-white'
              }`} />
              <span className="relative z-10">{item.label}</span>
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          ))}
        </nav>
        
        {/* Bottom Section */}
        <div className="mt-auto pt-4 border-t border-white/10">
          <button
            onClick={() => handleItemClick('/')}
            className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 text-purple-200/80 hover:bg-white/10 hover:text-white group relative overflow-hidden border border-transparent hover:border-white/20"
          >
            <Home className="w-5 h-5 mr-3 text-purple-300/70 group-hover:text-white transition-colors duration-300" />
            <span>Back to Homepage</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
      
      {/* Subtle light effects */}
      <div className="absolute top-20 left-4 w-16 h-16 bg-blue-400/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-32 right-4 w-12 h-12 bg-purple-400/10 rounded-full blur-lg"></div>
    </aside>
  );
};

export default Sidebar;