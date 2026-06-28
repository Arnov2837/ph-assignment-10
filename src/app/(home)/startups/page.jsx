"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiBriefcase,
  FiDollarSign,
  FiActivity,
  FiLayers,
} from "react-icons/fi";
import axiosSecure from "@/utils/axiosSecure";
import toast from "react-hot-toast";

export default function BrowseStartups() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchStartups = async () => {
    try {
      const res = await axiosSecure.get("/startups");
      const approvedStartups = (res.data || []).filter(
        (item) => item.status?.toLowerCase() === "approved"
      );
      setStartups(approvedStartups);
    } catch (error) {
      toast.error("Failed to load startups");
    } finally {
      setLoading(false);
    }
  };
  fetchStartups();
}, []);

  return (
    <div className="min-h-screen bg-[#f4f7fe] font-sans pb-20 pt-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-4 mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Explore Visionary <span className="text-blue-600">Startups</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium">
            Discover innovative companies building the future and find your next
            ecosystem to collaborate.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : startups.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-200 shadow-sm max-w-4xl mx-auto">
            <FiLayers className="mx-auto text-6xl text-slate-300 mb-4" />
            <h3 className="text-2xl font-black text-slate-800">
              No startups registered yet
            </h3>
            <p className="text-slate-500 font-medium mt-2">
              Approved companies will appear here dynamically.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {startups.map((startup, index) => (
              <motion.div
                key={startup._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col h-full group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                    <img
                      src={startup.logo}
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {startup.startup_name}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mt-0.5">
                      <FiActivity /> {startup.industry}
                    </p>
                  </div>
                </div>

                <p className="text-slate-500 font-medium text-sm leading-relaxed line-clamp-3 flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100/50 mb-6">
                  {startup.description}
                </p>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 font-bold text-slate-400 uppercase text-xs tracking-wider">
                      <FiDollarSign className="text-blue-500" /> Funding
                    </span>
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-600 font-bold text-xs rounded-lg uppercase tracking-wider">
                      {startup.funding_stage}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 font-bold text-slate-400 uppercase text-xs tracking-wider">
                      <FiBriefcase className="text-blue-500" /> Contact
                    </span>
                    <span className="text-slate-700 font-semibold truncate max-w-[180px]">
                      {startup.founder_email}
                    </span>
                  </div>

                  <Link
                    href={`/startups/${startup._id}`}
                    className="block w-full pt-2"
                  >
                    <button className="w-full py-3.5 bg-slate-900 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                      View Company Profile <FiArrowRight />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
