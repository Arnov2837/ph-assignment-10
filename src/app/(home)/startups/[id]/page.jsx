"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FiArrowLeft, FiBriefcase, FiDollarSign, FiActivity, FiMail, FiCalendar } from "react-icons/fi";
import axiosSecure from "@/utils/axiosSecure";
import toast from "react-hot-toast";
import Link from "next/link";

export default function StartupDetails() {
  const { id } = useParams();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStartupDetails = async () => {
      try {
        const res = await axiosSecure.get(`/startups/${id}`);
        setStartup(res.data);
      } catch (error) {
        toast.error("Failed to load startup details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchStartupDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#f4f7fe]">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#f4f7fe]">
        <h2 className="text-2xl font-black text-slate-800">Startup Not Found</h2>
        <Link href="/opportunities" className="mt-4 text-blue-600 font-bold hover:underline">
          Back to Opportunities
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fe] font-sans pb-20 pt-24">
      <div className="max-w-4xl mx-auto px-6">
        
        <Link href="/opportunities" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold mb-8 transition-colors">
          <FiArrowLeft /> Back to Opportunities
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-10 pb-8 border-b border-slate-100">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center overflow-hidden shadow-md shrink-0">
                <img src={startup.logo} alt="Startup Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{startup.startup_name}</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg uppercase tracking-wider flex items-center gap-1">
                    <FiActivity /> {startup.industry}
                  </span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg uppercase tracking-wider flex items-center gap-1">
                    <FiDollarSign /> {startup.funding_stage}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3">About the Company</h3>
              <p className="text-slate-600 leading-relaxed font-medium bg-slate-50 p-6 rounded-2xl border border-slate-100">
                {startup.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <FiMail size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Founder Contact</p>
                  <p className="text-slate-800 font-bold mt-0.5">{startup.founder_email}</p>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <FiCalendar size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Member Since</p>
                  <p className="text-slate-800 font-bold mt-0.5">{new Date(startup.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}