import React from 'react';
    import { Bell, UserCircle, ChevronDown } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';

    const Header = () => {
      const { toast } = useToast();

      const handleNotImplemented = () => {
        toast({
          title: "🚧 Feature Not Implemented",
          description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
        });
      };

      return (
        <header className="bg-gray-900/50 border-b border-gray-800 h-16 flex items-center px-6 justify-between flex-shrink-0">
          <div>
            <h1 className="text-xl font-semibold text-white">Welcome, Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={handleNotImplemented}>
              <Bell className="h-5 w-5 text-brand-gray" />
            </Button>
            <div className="flex items-center space-x-2 cursor-pointer" onClick={handleNotImplemented}>
              <UserCircle className="h-8 w-8 text-brand-gray" />
              <span className="text-white font-medium">Admin</span>
              <ChevronDown className="h-4 w-4 text-brand-gray" />
            </div>
          </div>
        </header>
      );
    };

    export default Header;