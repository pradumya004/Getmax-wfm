import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Building, MoreHorizontal } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ClientCard = ({ client, index }) => {
  const { toast } = useToast();

  const handleAction = (action, client) => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-[#39ff14] text-black';
      case 'suspended': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getContractTypeColor = (type) => {
    switch (type) {
      case 'End-to-End': return 'bg-blue-500 text-white';
      case 'FTE': return 'bg-purple-500 text-white';
      case 'Transactional': return 'bg-orange-500 text-white';
      case 'Hybrid': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <motion.div
      key={client.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card className="bg-glass-dark border-[#39ff14]/20 hover-glow h-full flex flex-col">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-[#39ff14] to-[#00ff88] rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-black" />
              </div>
              <div>
                <CardTitle className="text-lg text-white">{client.name}</CardTitle>
                <CardDescription className="text-gray-300">
                  {client.type} • {client.subType}
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(client.status)}>
                {client.status}
              </Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 flex-grow">
          <div className="flex items-center justify-between">
            <Badge className={getContractTypeColor(client.contractType)}>
              {client.contractType}
            </Badge>
            <span className="text-sm text-gray-400">{client.scopeFormat}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">SOWs</span>
              <span className="text-white">{client.sowCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Employees</span>
              <span className="text-white">{client.employeeCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Compliance</span>
              <span className="text-[#39ff14]">{client.compliance}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Revenue</span>
              <span className="text-white font-medium">{client.revenue}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <span className="text-sm text-gray-400">Services:</span>
            <div className="flex flex-wrap gap-1">
              {client.services.map((service) => (
                <Badge key={service} variant="outline" className="text-xs border-[#39ff14]/30 text-[#39ff14]">
                  {service}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>

        <div className="p-6 pt-0 mt-auto">
            <div className="flex space-x-2 pt-2">
                <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 border-[#39ff14]/30 text-[#39ff14] hover:bg-[#39ff14] hover:text-black"
                onClick={() => handleAction('view', client)}
                >
                <Eye className="h-4 w-4 mr-1" />
                View
                </Button>
                <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 border-[#39ff14]/30 text-[#39ff14] hover:bg-[#39ff14] hover:text-black"
                onClick={() => handleAction('edit', client)}
                >
                <Edit className="h-4 w-4 mr-1" />
                Edit
                </Button>
            </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ClientCard;