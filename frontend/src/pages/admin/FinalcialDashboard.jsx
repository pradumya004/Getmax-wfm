import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Banknote,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  Calendar,
  Users,
  Building,
  Target,
  Crown,
  Package,
  Star,
  CheckCircle,
  AlertTriangle,
  Eye,
  Filter,
} from "lucide-react";

const FinancialDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  const theme = {
    primary: "from-slate-900 via-gray-900 to-black",
    secondary: "from-red-600 to-orange-600",
    text: "white",
    textSecondary: "white/70",
    border: "white/10",
    glass: "bg-white/5 backdrop-blur-xl border-white/10",
    button:
      "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white",
  };

  const financialData = {
    overview: {
      totalRevenue: 284750,
      monthlyGrowth: 15.3,
      totalCustomers: 156,
      averageRevenuePerCustomer: 1825,
      churnRate: 2.1,
      lifetimeValue: 24500,
    },
    revenueBreakdown: [
      { plan: "Enterprise", revenue: 135000, customers: 45, percentage: 47.4 },
      {
        plan: "Professional",
        revenue: 100500,
        customers: 67,
        percentage: 35.3,
      },
      { plan: "Basic", revenue: 49250, customers: 44, percentage: 17.3 },
    ],
    monthlyTrends: [
      { month: "Jan", revenue: 195000, customers: 120, churn: 1.8 },
      { month: "Feb", revenue: 218000, customers: 128, churn: 2.1 },
      { month: "Mar", revenue: 242000, customers: 135, churn: 1.9 },
      { month: "Apr", revenue: 263000, customers: 142, churn: 2.3 },
      { month: "May", revenue: 284750, customers: 156, churn: 2.1 },
    ],
    outstandingInvoices: [
      {
        company: "TechCorp Solutions",
        amount: 15000,
        daysOverdue: 5,
        plan: "Enterprise",
      },
      {
        company: "Global Manufacturing",
        amount: 28500,
        daysOverdue: 12,
        plan: "Enterprise",
      },
      {
        company: "Creative Agency",
        amount: 2500,
        daysOverdue: 3,
        plan: "Basic",
      },
    ],
    topPayingCustomers: [
      {
        company: "Global Manufacturing",
        monthlyRevenue: 28500,
        plan: "Enterprise",
        growth: 23,
      },
      {
        company: "TechCorp Solutions",
        monthlyRevenue: 15000,
        plan: "Enterprise",
        growth: 18,
      },
      {
        company: "Digital Innovations",
        monthlyRevenue: 12000,
        plan: "Professional",
        growth: 15,
      },
      {
        company: "Finance Experts",
        monthlyRevenue: 10200,
        plan: "Professional",
        growth: 12,
      },
      {
        company: "Creative Agency",
        monthlyRevenue: 8500,
        plan: "Professional",
        growth: 31,
      },
    ],
  };

  const MetricCard = ({
    title,
    value,
    change,
    trend,
    icon: Icon,
    format = "currency",
  }) => {
    const formatValue = (val) => {
      if (format === "currency") return `$${val.toLocaleString()}`;
      if (format === "percentage") return `${val}%`;
      if (format === "number") return val.toLocaleString();
      return val;
    };

    const trendColor = trend === "up" ? "text-green-400" : "text-red-400";
    const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;

    return (
      <div
        className={`${theme.glass} backdrop-blur-xl border border-${theme.border} rounded-xl p-6`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-${theme.textSecondary} text-sm`}>{title}</p>
            <p className={`text-2xl font-bold text-${theme.text}`}>
              {formatValue(value)}
            </p>
            <div className="flex items-center space-x-1 mt-1">
              <TrendIcon className={`w-4 h-4 ${trendColor}`} />
              <span className={`${trendColor} text-sm`}>
                {change > 0 ? "+" : ""}
                {change}%
              </span>
            </div>
          </div>
          <div className="p-3 bg-green-500/20 rounded-lg">
            <Icon className="w-6 h-6 text-green-400" />
          </div>
        </div>
      </div>
    );
  };

  const RevenueChart = ({ data, title }) => {
    const maxValue = Math.max(...data.map((d) => d.revenue));

    return (
      <div className="space-y-4">
        <h4 className={`text-${theme.text} font-medium`}>{title}</h4>
        <div className="h-48 flex items-end justify-between space-x-2">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-2 flex-1"
            >
              <div className="flex flex-col items-center space-y-1">
                <span className={`text-${theme.textSecondary} text-xs`}>
                  ${(item.revenue / 1000).toFixed(0)}K
                </span>
                <div
                  className="w-full bg-gradient-to-t from-green-600 to-emerald-500 rounded-t"
                  style={{
                    height: `${(item.revenue / maxValue) * 160}px`,
                    minHeight: "8px",
                  }}
                />
              </div>
              <span
                className={`text-${theme.textSecondary} text-xs text-center`}
              >
                {item.month}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getPlanColor = (plan) => {
    const colors = {
      Enterprise: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      Professional: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      Basic: "bg-green-500/20 text-green-400 border-green-500/30",
    };
    return colors[plan] || colors.Basic;
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.primary} text-${theme.text}`}
    >
      {/* Header */}
      <div
        className={`sticky top-0 z-40 ${theme.glass} backdrop-blur-xl border-b border-${theme.border}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className={`text-2xl font-bold bg-gradient-to-r ${theme.secondary} bg-clip-text text-transparent`}
              >
                Financial Dashboard
              </h1>
              <p className={`text-${theme.textSecondary} text-sm`}>
                Revenue analytics and financial insights
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className={`px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50`}
              >
                <option value="weekly" className="bg-gray-800">
                  This Week
                </option>
                <option value="monthly" className="bg-gray-800">
                  This Month
                </option>
                <option value="quarterly" className="bg-gray-800">
                  This Quarter
                </option>
                <option value="yearly" className="bg-gray-800">
                  This Year
                </option>
              </select>

              <button
                onClick={() => {}}
                className={`flex items-center space-x-2 px-4 py-2 border border-${theme.border} ${theme.glass} rounded-lg text-${theme.text} text-sm hover:bg-white/10 transition-colors`}
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>

              <button
                onClick={() => setRefreshing(!refreshing)}
                className={`flex items-center space-x-2 px-4 py-2 ${theme.button} rounded-lg text-sm transition-colors`}
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value={financialData.overview.totalRevenue}
            change={financialData.overview.monthlyGrowth}
            trend="up"
            icon={DollarSign}
            format="currency"
          />
          <MetricCard
            title="Paying Customers"
            value={financialData.overview.totalCustomers}
            change={9.9}
            trend="up"
            icon={Users}
            format="number"
          />
          <MetricCard
            title="Avg Revenue Per Customer"
            value={financialData.overview.averageRevenuePerCustomer}
            change={7.2}
            trend="up"
            icon={Target}
            format="currency"
          />
          <MetricCard
            title="Churn Rate"
            value={financialData.overview.churnRate}
            change={-0.3}
            trend="up"
            icon={TrendingDown}
            format="percentage"
          />
        </div>

        {/* Revenue Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Trend Chart */}
          <div
            className={`${theme.glass} backdrop-blur-xl border border-${theme.border} rounded-xl p-6`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold text-${theme.text}`}>
                Revenue Trend
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedMetric("revenue")}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    selectedMetric === "revenue"
                      ? theme.button
                      : `text-${theme.textSecondary} hover:text-${theme.text}`
                  }`}
                >
                  Revenue
                </button>
                <button
                  onClick={() => setSelectedMetric("customers")}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    selectedMetric === "customers"
                      ? theme.button
                      : `text-${theme.textSecondary} hover:text-${theme.text}`
                  }`}
                >
                  Customers
                </button>
              </div>
            </div>
            <RevenueChart
              data={financialData.monthlyTrends}
              title="Monthly Revenue Growth"
            />
          </div>

          {/* Revenue Breakdown by Plan */}
          <div
            className={`${theme.glass} backdrop-blur-xl border border-${theme.border} rounded-xl p-6`}
          >
            <h3 className={`text-lg font-semibold text-${theme.text} mb-6`}>
              Revenue by Plan
            </h3>
            <div className="space-y-4">
              {financialData.revenueBreakdown.map((plan, index) => (
                <div key={index} className={`p-4 ${theme.glass} rounded-lg`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-2 py-1 rounded text-xs border ${getPlanColor(
                          plan.plan
                        )}`}
                      >
                        {plan.plan}
                      </span>
                      <span className={`text-${theme.text} font-medium`}>
                        ${plan.revenue.toLocaleString()}
                      </span>
                    </div>
                    <span className={`text-${theme.textSecondary} text-sm`}>
                      {plan.customers} customers
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1 bg-white/10 rounded-full h-2 mr-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                        style={{ width: `${plan.percentage}%` }}
                      />
                    </div>
                    <span className={`text-${theme.text} text-sm font-medium`}>
                      {plan.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Financial Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Paying Customers */}
          <div
            className={`${theme.glass} backdrop-blur-xl border border-${theme.border} rounded-xl p-6`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold text-${theme.text}`}>
                Top Paying Customers
              </h3>
              <button
                className={`text-${theme.textSecondary} hover:text-${theme.text} transition-colors`}
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {financialData.topPayingCustomers.map((customer, index) => (
                <div key={index} className={`p-3 ${theme.glass} rounded-lg`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-${theme.text} font-medium text-sm`}>
                      {customer.company}
                    </span>
                    <span className="text-green-400 text-xs">
                      +{customer.growth}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded text-xs border ${getPlanColor(
                          customer.plan
                        )}`}
                      >
                        {customer.plan}
                      </span>
                    </div>
                    <span className={`text-${theme.text} font-medium`}>
                      ${customer.monthlyRevenue.toLocaleString()}/mo
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Outstanding Invoices */}
          <div
            className={`${theme.glass} backdrop-blur-xl border border-${theme.border} rounded-xl p-6`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold text-${theme.text}`}>
                Outstanding Invoices
              </h3>
              <span className="text-red-400 text-sm font-medium">
                $
                {financialData.outstandingInvoices
                  .reduce((sum, inv) => sum + inv.amount, 0)
                  .toLocaleString()}
              </span>
            </div>
            <div className="space-y-3">
              {financialData.outstandingInvoices.map((invoice, index) => (
                <div
                  key={index}
                  className={`p-4 border border-red-500/30 bg-red-500/10 rounded-lg`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-${theme.text} font-medium text-sm`}>
                      {invoice.company}
                    </span>
                    <span className="text-red-400 font-medium">
                      ${invoice.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`px-2 py-1 rounded border ${getPlanColor(
                        invoice.plan
                      )}`}
                    >
                      {invoice.plan}
                    </span>
                    <span className="text-red-400">
                      {invoice.daysOverdue} days overdue
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div
          className={`${theme.glass} backdrop-blur-xl border border-${theme.border} rounded-xl p-6`}
        >
          <h3 className={`text-lg font-semibold text-${theme.text} mb-6`}>
            Financial Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`p-4 ${theme.glass} rounded-lg text-center`}>
              <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className={`text-${theme.textSecondary} text-sm`}>
                Monthly Recurring Revenue
              </p>
              <p className={`text-xl font-bold text-${theme.text}`}>
                ${financialData.overview.totalRevenue.toLocaleString()}
              </p>
            </div>

            <div className={`p-4 ${theme.glass} rounded-lg text-center`}>
              <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className={`text-${theme.textSecondary} text-sm`}>
                Customer Lifetime Value
              </p>
              <p className={`text-xl font-bold text-${theme.text}`}>
                ${financialData.overview.lifetimeValue.toLocaleString()}
              </p>
            </div>

            <div className={`p-4 ${theme.glass} rounded-lg text-center`}>
              <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className={`text-${theme.textSecondary} text-sm`}>
                Total Customers
              </p>
              <p className={`text-xl font-bold text-${theme.text}`}>
                {financialData.overview.totalCustomers}
              </p>
            </div>

            <div className={`p-4 ${theme.glass} rounded-lg text-center`}>
              <Target className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <p className={`text-${theme.textSecondary} text-sm`}>
                Growth Rate
              </p>
              <p className={`text-xl font-bold text-green-400`}>
                +{financialData.overview.monthlyGrowth}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
