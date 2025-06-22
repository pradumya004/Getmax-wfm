import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, MoreHorizontal, Eye, Edit } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'active': return 'bg-[#39ff14] text-black';
    case 'inactive': return 'bg-red-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

const getRoleColor = (role) => {
  switch (role) {
    case 'Admin': return 'bg-purple-500 text-white';
    case 'Manager': return 'bg-blue-500 text-white';
    case 'Team Lead': return 'bg-orange-500 text-white';
    case 'QA Specialist': return 'bg-green-500 text-white';
    default: return 'bg-gray-600 text-white';
  }
};

const getProductivityColor = (productivity) => {
  if (productivity >= 90) return 'text-[#39ff14]';
  if (productivity >= 75) return 'text-yellow-500';
  if (productivity >= 60) return 'text-orange-500';
  return 'text-red-500';
};

const EmployeeCard = ({ employee, index }) => {
  const { toast } = useToast();

  const handleAction = (action, emp) => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  return (
    <motion.div
      key={employee.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card className="bg-glass-dark border-[#39ff14]/20 hover-glow h-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-[#39ff14] to-[#00ff88] rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <CardTitle className="text-lg text-white">{employee.name}</CardTitle>
                <CardDescription className="text-gray-300">
                  {employee.id}
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(employee.status)}>
                {employee.status}
              </Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-300">{employee.email}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <Badge className={getRoleColor(employee.role)}>
                {employee.role}
              </Badge>
              {employee.loginActivated ? (
                <Badge className="bg-[#39ff14] text-black">
                  Login Active
                </Badge>
              ) : (
                <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                  Pending
                </Badge>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Assigned SOW</span>
              <span className="text-white">{employee.assignedSOW || 'Unassigned'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Productivity</span>
              <span className={`font-medium ${getProductivityColor(employee.productivity)}`}>
                {employee.productivity}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">QA Score</span>
              <span className="text-[#39ff14] font-medium">{employee.qaScore}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">XP Points</span>
              <span className="text-white font-medium">{employee.xpPoints.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Join Date</span>
              <span className="text-white">{new Date(employee.joinDate).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex space-x-2 pt-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 border-[#39ff14]/30 text-[#39ff14] hover:bg-[#39ff14] hover:text-black"
              onClick={() => handleAction('view', employee)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 border-[#39ff14]/30 text-[#39ff14] hover:bg-[#39ff14] hover:text-black"
              onClick={() => handleAction('edit', employee)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EmployeeCard;