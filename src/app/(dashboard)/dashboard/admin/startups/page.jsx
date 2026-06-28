"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiLayers, FiCheck, FiX, FiTrash2 } from "react-icons/fi";
import axiosSecure from "@/utils/axiosSecure";
import toast from "react-hot-toast";

export default function ManageStartups() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const res = await axiosSecure.get("/startups");
        setStartups(res.data || []);
      } catch (error) {
        toast.error("Failed to load venture ecosystem data");
      } finally {
        setLoading(false);
      }
    };
    fetchStartups();
  }, []);

  const handleStartupStatus = async (id, newStatus) => {
    try {
      await axiosSecure.patch(`/startups/status/${id}`, { status: newStatus });
      toast.success(`Startup status updated to ${newStatus}`);
      setStartups(startups.map(s => s._id === id ? { ...s, status: newStatus } : s));
    } catch (error) {
      toast.error("Failed to transition verification status");
    }
  };

  const handleStartupDelete = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this startup venture?")) return;
    try {
      await axiosSecure.delete(`/startups/${id}`);
      toast.success("Startup profile permanently removed");
      setStartups(startups.filter(s => s._id !== id));
    } catch (error) {
      toast.error("Failed to delete venture registry entry");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <FiLayers className="text-blue-600" /> Manage Startups
        </h1>
        <p className="text-slate-500 font-medium mt-1">Review validation states, grant approvals, or remove platform ventures.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">Venture Profile</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">Founder Ecosystem</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">Verification State</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {startups.map((s) => (
                <tr key={s._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl border border-slate-100 bg-slate-50 p-1.5 flex items-center justify-center shrink-0">
                        <img src={s.logo} alt="" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{s.startup_name}</p>
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mt-0.5">{s.funding_stage}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <p className="text-sm font-bold text-slate-700">{s.founder_email}</p>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">{s.industry}</p>
                  </td>
                  <td className="p-5">
                    <span className={`px-3 py-1 text-xs font-bold rounded-lg border uppercase tracking-wider ${
                      s.status?.toLowerCase() === "approved" ? "bg-green-50 text-green-600 border-green-100" : s.status?.toLowerCase() === "rejected" ? "bg-red-50 text-red-600 border-red-100" : "bg-amber-50 text-amber-600 border-amber-100"
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {s.status?.toLowerCase() !== "approved" && (
                        <button onClick={() => handleStartupStatus(s._id, "Approved")} className="p-2.5 bg-green-50 hover:bg-green-100 text-green-600 border border-green-200 rounded-xl transition-colors cursor-pointer">
                          <FiCheck size={16} />
                        </button>
                      )}
                      {s.status?.toLowerCase() !== "rejected" && (
                        <button onClick={() => handleStartupStatus(s._id, "Rejected")} className="p-2.5 bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200 rounded-xl transition-colors cursor-pointer">
                          <FiX size={16} />
                        </button>
                      )}
                      <button onClick={() => handleStartupDelete(s._id)} className="p-2.5 bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 rounded-xl transition-colors cursor-pointer">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}