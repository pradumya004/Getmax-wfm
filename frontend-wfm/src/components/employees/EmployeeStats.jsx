import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { UserCheck, Shield, Award, Mail } from 'lucide-react';

const EmployeeStats = ({ employees }) => {
  const stats = [
    { label: 'Total Employees', value: employees.length, icon: UserCheck },
    { label: 'Active', value: employees.filter(e => e.status === 'Active').length, icon: Shield },
    { label: 'Avg Productivity', value: `${employees.length > 0 ? Math.round(employees.reduce((acc, e) => acc + e.productivity, 0) / employees.length) : 0}%`, icon: Award },
    { label: 'Login Activated', value: employees.filter(e => e.loginActivated).length, icon: Mail }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
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
                <div className="w-10 h-10 bg-gradient-to-r from-[#39ff14] to-[#00ff88] rounded-lg flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-black" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default EmployeeStats;