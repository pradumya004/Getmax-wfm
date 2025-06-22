import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import ProductivityFilters from '@/components/productivity/ProductivityFilters';
import KpiCard from '@/components/productivity/KpiCard';
import TeamPerformanceTable from '@/components/productivity/TeamPerformanceTable';
import ProductivityTrendChart from '@/components/productivity/ProductivityTrendChart';
import RevenueInsights from '@/components/productivity/RevenueInsights';
import AlertsWidget from '@/components/productivity/AlertsWidget';
import { CheckCircle, BarChart, TrendingUp, IndianRupee } from 'lucide-react';

const mockKpiData = {
  tasksCompleted: { value: '1,050', color: 'green', icon: CheckCircle },
  slaCompliance: { value: '92.6%', color: 'yellow', icon: BarChart },
  qaAccuracy: { value: '96.4%', color: 'green', icon: TrendingUp },
  revenuePerFte: { value: '₹1,12,000', color: 'green', icon: IndianRupee },
};

const ProductivityDashboard = () => {
  const title = "Productivity & Revenue Dashboard";
  const [filters, setFilters] = useState({
    client: 'all',
    sow: 'all',
    dateRange: { from: new Date(2025, 5, 1), to: new Date(2025, 5, 21) },
    viewType: 'team',
  });

  return (
    <>
      <Helmet>
        <title>{title} - GetMax</title>
        <meta name="description" content="Monitor individual, team, and project-based output metrics." />
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <p className="text-gray-300">Monitor output metrics, benchmark compliance, and real-time revenue contribution.</p>
        </div>

        <ProductivityFilters filters={filters} setFilters={setFilters} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard title="Tasks Completed" data={mockKpiData.tasksCompleted} />
          <KpiCard title="SLA Compliance Rate" data={mockKpiData.slaCompliance} />
          <KpiCard title="QA Accuracy %" data={mockKpiData.qaAccuracy} />
          <KpiCard title="Revenue Per FTE" data={mockKpiData.revenuePerFte} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TeamPerformanceTable />
          </div>
          <div className="space-y-6">
            <RevenueInsights />
            <AlertsWidget />
          </div>
        </div>
        
        <ProductivityTrendChart />

      </div>
    </>
  );
};

export default ProductivityDashboard;