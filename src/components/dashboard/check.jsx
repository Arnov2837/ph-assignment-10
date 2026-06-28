"use client";

import {
  FiSend,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiTrendingUp,
} from "react-icons/fi";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export default function check({ stats }) {
  const total = stats?.totalApplied || 0;
  const accepted = stats?.accepted || 0;
  const pending = stats?.pending || 0;
  const rejected = stats?.rejected || 0;

  const chartData = [
    { name: "Accepted", value: accepted, color: "#10b981" },
    { name: "Pending", value: pending, color: "#f59e0b" },
    { name: "Rejected", value: rejected, color: "#ef4444" },
  ].filter((item) => item.value > 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl transition-all flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Total Applied
            </p>
            <h3 className="text-3xl font-black mt-2">{total}</h3>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
            <FiSend />
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl transition-all flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Accepted
            </p>
            <h3 className="text-3xl font-black mt-2">{accepted}</h3>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
            <FiCheckCircle />
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl transition-all flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Pending
            </p>
            <h3 className="text-3xl font-black mt-2">{pending}</h3>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-yellow-50 text-yellow-600 flex items-center justify-center text-xl">
            <FiClock />
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl transition-all flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Rejected
            </p>
            <h3 className="text-3xl font-black mt-2">{rejected}</h3>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-xl">
            <FiXCircle />
          </div>
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-3xl border border-slate-100 shadow-lg p-8 grid md:grid-cols-2 gap-8 items-center"
      >
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
              <FiTrendingUp className="text-xl" />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Application Analytics
              </h2>

              <p className="text-sm text-slate-500">
                Your application performance overview
              </p>
            </div>
          </div>

          <p className="text-slate-500 leading-7">
            Track all your applications in one place. Monitor accepted,
            pending and rejected applications with a beautiful visual report.
          </p>
        </div>

        <div className="h-[280px]">
          {chartData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                >
                  {chartData.map((item, index) => (
                    <Cell key={index} fill={item.color} />
                  ))}
                </Pie>

                <Tooltip />

                <Legend
                  iconType="circle"
                  verticalAlign="bottom"
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-full text-slate-400 font-semibold">
              No Data Available
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}