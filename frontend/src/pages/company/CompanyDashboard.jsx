import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '../../components/ui/button'; 

import StatCard from '../../components/dashboard/StatCard';
import ClaimSlaChart from '../../components/dashboard/ClaimSlaChart';
import EmployeeProductivityChart from '../../components/dashboard/EmployeeProductivityChart';
import SystemAlertsTile from '../../components/dashboard/SystemAlertsTile';
import PendingTasksTile from '../../components/dashboard/PendingTasksTile';
import ModuleHealthTile from '../../components/dashboard/ModuleHealthTile';
import GamificationFeedTile from '../../components/dashboard/GamificationFeedTile';

import { Users, FileText, ShieldCheck, BarChart, IndianRupee } from 'lucide-react';

const Dashboard = () => {
  const title = "Super Admin Dashboard";

  const handleExport = () => {
    toast.error("🚧 Feature Not Implemented: Exporting dashboard snapshots is not yet available.");
  };

  const topCardsData = [
    { title: 'Active Clients', value: 74, weeklyTrend: '+5 this week', icon: Users },
    { title: 'Total Claims Received', value: 1245, weeklyTrend: '+150 this week', icon: FileText },
    { title: 'Avg SLA Compliance', value: 96.2, weeklyTrend: '', icon: ShieldCheck, isPercentage: true },
    { title: 'QA Audit Score', value: 98.5, weeklyTrend: '', icon: BarChart, isPercentage: true },
    { title: 'Revenue Generated', value: 450000, weeklyTrend: 'this month', icon: IndianRupee, isCurrency: true },
  ];

  return (
    <>
      <Helmet>
        <title>{title} - GetMax</title>
        <meta name="description" content="Centralized snapshot for top-level decision-making." />
      </Helmet>
      
      <div className="min-h-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header Section */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{title}</h1>
              <p className="text-gray-300 text-lg">Centralized snapshot for top-level decision-making.</p>
            </div>
            <Button 
              variant="outline" 
              className="border-[#39ff14]/30 text-white hover:bg-[#39ff14]/10 hover:border-[#39ff14]/50 transition-all duration-200" 
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Snapshot
            </Button>
          </motion.div>

          {/* KPI Cards Section */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">Key Performance Indicators</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
              {topCardsData.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.3 + (index * 0.1),
                    type: "spring",
                    stiffness: 100
                  }}
                >
                  <StatCard {...card} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Analytics Section */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">Analytics Overview</h2>
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
              <motion.div
                className="xl:col-span-3"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <ClaimSlaChart />
              </motion.div>
              <motion.div
                className="xl:col-span-2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <EmployeeProductivityChart />
              </motion.div>
            </div>
          </motion.div>

          {/* Management Tiles Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">System Management</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 30, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 1.2,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <SystemAlertsTile />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 1.3,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <PendingTasksTile />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 1.4,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <ModuleHealthTile />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 1.5,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <GamificationFeedTile />
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;