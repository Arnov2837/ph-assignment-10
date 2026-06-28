"use client";

import { useEffect, useState } from "react";
import axiosSecure from "../../../../utils/axiosSecure";
import { useAuth } from "../../../../providers/AuthProvider";
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiCalendar,
  FiExternalLink,
  FiFolder,
} from "react-icons/fi";
import { motion } from "framer-motion";

export default function MyApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const res = await axiosSecure.get(
          `/applications/collaborator/${user?.email}`,
        );
        setApplications(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.email) fetchMyApplications();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Accepted":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
            <FiCheckCircle /> Accepted
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded-full">
            <FiXCircle /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-full">
            <FiClock /> Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          My Applications
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Track all the roles you have applied for and their status.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white p-12 rounded-[2rem] border border-slate-100 shadow-sm text-center">
          <p className="text-slate-400 font-medium">
            You haven't applied for any opportunities yet.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100">
                  <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Role Details
                  </th>
                  <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Applied Date
                  </th>
                  <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Portfolio / Link
                  </th>
                  <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {applications.map((app) => (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={app._id}
                    className="hover:bg-slate-50/40 transition-colors"
                  >
                    <td className="p-5">
                      <div className="font-bold text-slate-800">
                        {app.opportunity_id?.role_title || "Role Unavailable"}
                      </div>
                      <div className="text-xs text-slate-400 font-bold mt-0.5 uppercase tracking-wider text-blue-600">
                        {app.opportunity_id?.work_type}
                      </div>
                    </td>
                    <td className="p-5 text-sm text-slate-500 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <FiCalendar className="text-slate-400" />{" "}
                        {new Date(
                          app.applied_at || app.createdAt,
                        ).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-5">
                      <a
                        href={app.portfolio_link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 hover:underline"
                      >
                        <FiFolder size={14} /> View Link{" "}
                        <FiExternalLink size={12} />
                      </a>
                    </td>
                    <td className="p-5">{getStatusBadge(app.status)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
