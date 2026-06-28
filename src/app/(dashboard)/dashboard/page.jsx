"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import axiosSecure from "@/utils/axiosSecure";
import FounderOverview from "@/components/dashboard/FounderOverview";
import CollaboratorOverview from "@/components/dashboard/check";
import AdminOverview from "@/components/dashboard/AdminOverview";


import { motion } from "framer-motion";

export default function DashboardOverviewPage() {

console.log(typeof CollaboratorOverview);
console.log(CollaboratorOverview);

  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const role = user?.role || "Collaborator";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosSecure.get(
          `/dashboard/stats/${role.toLowerCase()}`,
        );
        setStats(res.data);
      } catch (error) {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchStats();
  }, [role, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Welcome back,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            {user?.name || "User"}
          </span>
          !
        </h1>
        <p className="text-base text-slate-500 mt-2 font-medium">
          Here is your <span className="text-slate-700 font-bold">{role}</span>{" "}
          dashboard overview for today.
        </p>
      </motion.div>

      {role === "Founder" && <FounderOverview stats={stats} />}

      {role === "Collaborator" && <CollaboratorOverview stats={stats} />}

      {role === "admin" && <AdminOverview stats={stats} />}
    </div>
  );
}
