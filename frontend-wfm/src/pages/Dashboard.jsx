import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import StatCard from '@/components/dashboard/StatCard';
import ClaimSlaChart from '@/components/dashboard/ClaimSlaChart';
import EmployeeProductivityChart from '@/components/dashboard/EmployeeProductivityChart';
import SystemAlertsTile from '@/components/dashboard/SystemAlertsTile';
import PendingTasksTile from '@/components/dashboard/PendingTasksTile';
import ModuleHealthTile from '@/components/dashboard/ModuleHealthTile';
import GamificationFeedTile from '@/components/dashboard/GamificationFeedTile';

import { Users, FileText, ShieldCheck, BarChart, IndianRupee } from 'lucide-react';

const Dashboard = () => {
  const { toast } = useToast();
  const title = "Super Admin Dashboard";

  const handleExport = () => {
    toast({
      title: "🚧 Feature Not Implemented",
      description: "Exporting dashboard snapshots is not yet available.",
    });
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
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            <p className="text-gray-300">Centralized snapshot for top-level decision-making.</p>
          </div>
          <Button variant="outline" className="border-[#39ff14]/30 text-white hover:bg-[#39ff14]/10" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Snapshot
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {topCardsData.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StatCard {...card} />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ClaimSlaChart />
          </motion.div>
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <EmployeeProductivityChart />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <SystemAlertsTile />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <PendingTasksTile />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <ModuleHealthTile />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <GamificationFeedTile />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;