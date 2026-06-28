"use client";

import {
  FiBriefcase,
  FiLayers,
  FiCheckCircle,
  FiTrendingUp,
  FiArrowUpRight,
} from "react-icons/fi";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

export default function FounderOverview({ stats }) {
  const totalOpp = stats?.totalOpportunities || 0;
  const totalApp = stats?.totalApplications || 0;
  const totalAcc = stats?.acceptedMembers || 0;

  const generateSparklineData = (baseValue) => {
    return Array.from({ length: 7 }).map((_, i) => ({
      name: `Day ${i + 1}`,
      value: Math.max(
        0,
        baseValue - Math.floor(Math.random() * (baseValue / 2)) + i * 2,
      ),
    }));
  };

  const oppData = generateSparklineData(totalOpp || 10);
  const appData = generateSparklineData(totalApp || 25);
  const accData = generateSparklineData(totalAcc || 5);

  const mainChartData = [
    {
      name: "Jan",
      Applications: Math.floor(totalApp * 0.2),
      Accepted: Math.floor(totalAcc * 0.1),
    },
    {
      name: "Feb",
      Applications: Math.floor(totalApp * 0.4),
      Accepted: Math.floor(totalAcc * 0.3),
    },
    {
      name: "Mar",
      Applications: Math.floor(totalApp * 0.6),
      Accepted: Math.floor(totalAcc * 0.5),
    },
    {
      name: "Apr",
      Applications: Math.floor(totalApp * 0.8),
      Accepted: Math.floor(totalAcc * 0.7),
    },
    {
      name: "May",
      Applications: Math.floor(totalApp * 0.9),
      Accepted: Math.floor(totalAcc * 0.8),
    },
    { name: "Jun", Applications: totalApp, Accepted: totalAcc },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-100/50 hover:shadow-xl transition-all relative overflow-hidden group"
        >
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Total Opportunities
              </p>
              <h3 className="text-4xl font-black text-slate-800">{totalOpp}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-blue-100">
              <FiBriefcase />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-500 mb-4 relative z-10">
            <FiArrowUpRight /> <span>+12% from last month</span>
          </div>
          <div className="h-16 w-full -mx-2 -mb-6 opacity-60 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={oppData}>
                <defs>
                  <linearGradient id="colorOpp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorOpp)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-100/50 hover:shadow-xl transition-all relative overflow-hidden group"
        >
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Total Applications
              </p>
              <h3 className="text-4xl font-black text-slate-800">{totalApp}</h3>
            </div>
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-indigo-100">
              <FiLayers />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-500 mb-4 relative z-10">
            <FiArrowUpRight /> <span>+24% from last month</span>
          </div>
          <div className="h-16 w-full -mx-2 -mb-6 opacity-60 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={appData}>
                <defs>
                  <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorApp)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-100/50 hover:shadow-xl transition-all relative overflow-hidden group"
        >
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Accepted Members
              </p>
              <h3 className="text-4xl font-black text-slate-800">{totalAcc}</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-emerald-100">
              <FiCheckCircle />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-500 mb-4 relative z-10">
            <FiArrowUpRight /> <span>+8% from last month</span>
          </div>
          <div className="h-16 w-full -mx-2 -mb-6 opacity-60 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={accData}>
                <defs>
                  <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorAcc)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={itemVariants}
        className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <FiTrendingUp className="text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-800">
              Recruitment Analytics
            </h3>
            <p className="text-slate-500 text-sm font-medium">
              Monthly applications vs accepted candidates
            </p>
          </div>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mainChartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
              />
              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                contentStyle={{
                  borderRadius: "1rem",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar
                dataKey="Applications"
                fill="#6366f1"
                radius={[6, 6, 6, 6]}
                barSize={30}
              />
              <Bar
                dataKey="Accepted"
                fill="#10b981"
                radius={[6, 6, 6, 6]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
}
