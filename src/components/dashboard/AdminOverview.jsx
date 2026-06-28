"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiUsers, FiBriefcase, FiTarget, FiDollarSign } from "react-icons/fi";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function AdminOverview({ stats }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !stats) {
    return (
      <div className="min-h-[40vh] flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalRev = stats.totalRevenue || 0;
  const totalUsr = stats.totalUsers || 0;
  const totalStrt = stats.totalStartups || 0;
  const totalOpp = stats.totalOpportunities || 0;

  const revenueData = [
    { name: "Jan", amount: totalRev * 0.15 },
    { name: "Feb", amount: totalRev * 0.3 },
    { name: "Mar", amount: totalRev * 0.45 },
    { name: "Apr", amount: totalRev * 0.6 },
    { name: "May", amount: totalRev * 0.8 },
    { name: "Jun", amount: totalRev },
  ];

  const userData = [
    { name: "Jan", users: Math.floor(totalUsr * 0.2) },
    { name: "Feb", users: Math.floor(totalUsr * 0.35) },
    { name: "Mar", users: Math.floor(totalUsr * 0.5) },
    { name: "Apr", users: Math.floor(totalUsr * 0.65) },
    { name: "May", users: Math.floor(totalUsr * 0.85) },
    { name: "Jun", users: totalUsr },
  ];

  const startupData = [
    { name: "Jan", count: Math.floor(totalStrt * 0.1) },
    { name: "Feb", count: Math.floor(totalStrt * 0.25) },
    { name: "Mar", count: Math.floor(totalStrt * 0.45) },
    { name: "Apr", count: Math.floor(totalStrt * 0.65) },
    { name: "May", count: Math.floor(totalStrt * 0.8) },
    { name: "Jun", count: totalStrt },
  ];

  const opportunityData = [
    { name: "Engineering", value: Math.floor(totalOpp * 0.4) || 1 },
    { name: "Design", value: Math.floor(totalOpp * 0.25) || 1 },
    { name: "Marketing", value: Math.floor(totalOpp * 0.2) || 1 },
    { name: "Management", value: Math.floor(totalOpp * 0.15) || 1 },
  ];

  const pieColors = ["#6366f1", "#3b82f6", "#10b981", "#f59e0b"];

  const cards = [
    {
      title: "Total Users",
      value: totalUsr,
      icon: <FiUsers size={24} />,
      gradient: "from-blue-500/10 to-indigo-500/10",
      iconColor: "text-blue-600",
      borderColor: "hover:border-blue-500/30",
    },
    {
      title: "Total Startups",
      value: totalStrt,
      icon: <FiBriefcase size={24} />,
      gradient: "from-indigo-500/10 to-purple-500/10",
      iconColor: "text-indigo-600",
      borderColor: "hover:border-indigo-500/30",
    },
    {
      title: "Total Opportunities",
      value: totalOpp,
      icon: <FiTarget size={24} />,
      gradient: "from-purple-500/10 to-pink-500/10",
      iconColor: "text-purple-600",
      borderColor: "hover:border-purple-500/30",
    },
    {
      title: "Total Revenue",
      value: `$${totalRev}`,
      icon: <FiDollarSign size={24} />,
      gradient: "from-emerald-500/10 to-teal-500/10",
      iconColor: "text-emerald-600",
      borderColor: "hover:border-emerald-500/30",
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-slate-800">
          <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
            {label || payload[0].name}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-black text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color || entry.fill }} />
              <span className="capitalize">{entry.name}:</span>
              <span>{entry.name === "amount" ? "$" : ""}{Math.round(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={`bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all duration-300 flex items-center gap-5 group hover:shadow-xl hover:shadow-slate-200/50 ${card.borderColor}`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br ${card.gradient} ${card.iconColor} transition-transform duration-300 group-hover:scale-105`}>
              {card.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {card.title}
              </p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight mt-0.5">
                {card.value}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm"
        >
          <div className="mb-6">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Revenue Stream</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Monthly progression matrix</p>
          </div>
          <div className="w-full">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: "600" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: "600" }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm"
        >
          <div className="mb-6">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">User Acquisition</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Platform growth scale</p>
          </div>
          <div className="w-full">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={userData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: "600" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: "600" }} />
                <Tooltip cursor={{ fill: "#f8fafc" }} content={<CustomTooltip />} />
                <Bar dataKey="users" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm"
        >
          <div className="mb-6">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Startup Velocity</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Onboarding pipeline metrics</p>
          </div>
          <div className="w-full">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={startupData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: "600" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: "600" }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm"
        >
          <div className="mb-6">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Opportunities Distribution</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Categorized structural matrix</p>
          </div>
          <div className="w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={opportunityData}
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {opportunityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px", fontWeight: "700", color: "#64748b", pt: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}