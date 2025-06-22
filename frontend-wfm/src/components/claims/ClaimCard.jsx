import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Trophy, ShieldCheck, Clock, Award } from 'lucide-react';

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'assigned': return 'bg-blue-500 text-white';
    case 'in progress': return 'bg-yellow-500 text-black';
    case 'pending': return 'bg-gray-500 text-white';
    case 'completed': return 'bg-[#39ff14] text-black';
    default: return 'bg-gray-500 text-white';
  }
};

const getPriorityColor = (priority) => {
  switch (priority.toLowerCase()) {
    case 'high': return 'bg-red-500 text-white';
    case 'medium': return 'bg-orange-500 text-white';
    case 'low': return 'bg-green-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

const getAgingColor = (aging) => {
  if (aging > 30) return 'text-red-500';
  if (aging > 15) return 'text-yellow-500';
  return 'text-[#39ff14]';
};

const ClaimCard = ({ claim, index, onViewDetails }) => {
  const { toast } = useToast();

  const handleAction = (action, claim) => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const badgeOpportunities = [
    { icon: Clock, text: "Earn 'SLA Champ' by closing within 48h.", color: 'text-blue-400' },
    { icon: ShieldCheck, text: "Earn 'QA Hero' with a 100% accuracy score.", color: 'text-green-400' },
    { icon: Award, text: "Potential 'High Value Closer' badge.", color: 'text-purple-400' },
  ];

  return (
    <motion.div
      key={claim.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card className="bg-glass-dark border-[#39ff14]/20 hover-glow">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg font-semibold text-white">{claim.id}</span>
                  <Badge className={getStatusColor(claim.status)}>
                    {claim.status}
                  </Badge>
                  <Badge className={getPriorityColor(claim.priority)}>
                    {claim.priority}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400">{claim.clientId}</p>
                <p className="text-sm text-gray-400">{claim.sowId}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Payer:</span>
                  <span className="text-white">{claim.payer}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white font-medium">{claim.amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Aging:</span>
                  <span className={`font-medium ${getAgingColor(claim.aging)}`}>
                    {claim.aging} days
                  </span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Denial Type:</span>
                  <span className="text-white">{claim.denialType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Assigned To:</span>
                  <span className="text-white">{claim.assignedTo}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Due Date:</span>
                  <span className="text-white">{new Date(claim.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="border-[#39ff14]/30 text-[#39ff14] hover:bg-[#39ff14] hover:text-black w-full sm:w-auto"
                onClick={() => onViewDetails(claim)}
              >
                View Details
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-[#39ff14]/30 text-[#39ff14] hover:bg-[#39ff14] hover:text-black w-full sm:w-auto"
                onClick={() => handleAction('reassign', claim)}
              >
                Reassign
              </Button>
               <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-300 w-full sm:w-auto"
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Badges
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-glass-dark border-[#39ff14]/30 text-white">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none text-[#39ff14]">Badge Opportunities</h4>
                      <p className="text-sm text-gray-400">Potential badges you can earn from this claim.</p>
                    </div>
                    <ul className="mt-4 space-y-3">
                      {badgeOpportunities.map((opp, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <opp.icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${opp.color}`} />
                           <span className="text-sm">{opp.text}</span>
                        </li>
                      ))}
                    </ul>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ClaimCard;