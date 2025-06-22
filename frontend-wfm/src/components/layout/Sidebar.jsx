import React from 'react';
    import { NavLink } from 'react-router-dom';
    import { LayoutDashboard, Users, FileText, Users2, FileInput, Clock, ShieldCheck, Gamepad2, BarChart2, FileBox, Settings, PlugZap, Home, Waves, BookText, FileScan } from 'lucide-react';
    import { cn } from '@/lib/utils';

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
      return (
        <aside className="w-64 bg-gray-900/50 border-r border-gray-800 flex-shrink-0 p-4 flex flex-col">
          <div className="text-2xl font-bold text-white mb-10 flex items-center gap-2 px-2">
            <span className="text-brand-green">GetMax</span>
          </div>
          <nav className="flex flex-col space-y-2 flex-grow">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300',
                    isActive
                      ? 'bg-brand-green text-brand-black shadow-glow-green'
                      : 'text-brand-gray hover:bg-gray-800 hover:text-white'
                  )
                }
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto">
            <NavLink
                to="/"
                className='flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors text-brand-gray hover:bg-gray-800 hover:text-white'
            >
                <Home className="w-5 h-5 mr-3" />
                Back to Homepage
            </NavLink>
          </div>
        </aside>
      );
    };

    export default Sidebar;