import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Clock, Play, AlertTriangle } from 'lucide-react';

const ClaimStats = ({ claims }) => {
  const statsData = [
    { label: 'Total Claims', value: claims.length, icon: FileText, color: 'from-[#39ff14] to-[#00ff88]' },
    { label: 'Pending Assignment', value: claims.filter(c => c.assignedTo === 'Unassigned').length, icon: Clock, color: 'from-yellow-500 to-orange-500' },
    { label: 'In Progress', value: claims.filter(c => c.status === 'In Progress').length, icon: Play, color: 'from-blue-500 to-purple-500' },
    { label: 'High Priority', value: claims.filter(c => c.priority === 'High').length, icon: AlertTriangle, color: 'from-red-500 to-pink-500' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <Card className="bg-glass-dark border-[#39ff14]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default ClaimStats;