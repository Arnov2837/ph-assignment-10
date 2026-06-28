"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../../providers/AuthProvider";
import axiosSecure from "../../../../utils/axiosSecure";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import {
  FiBriefcase,
  FiUser,
  FiExternalLink,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiFileText,
} from "react-icons/fi";

export default function FounderApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startup, setStartup] = useState(null);

  const fetchApplications = async () => {
    try {
      const startupRes = await axiosSecure.get(
        `/startups/founder/${user?.email}`,
      );
      if (!startupRes.data || startupRes.data.length === 0) {
        setLoading(false);
        return;
      }

      const foundStartup = startupRes.data[0];
      setStartup(foundStartup);

      const oppRes = await axiosSecure.get(
        `/opportunities/startup/${foundStartup._id}`,
      );
      const opportunities = oppRes.data;

      if (opportunities.length === 0) {
        setLoading(false);
        return;
      }

      const allAppsPromises = opportunities.map(async (opp) => {
        const appRes = await axiosSecure.get(
          `/applications/opportunity/${opp._id}`,
        );
        return appRes.data.map((app) => ({
          ...app,
          role_title: opp.role_title,
          work_type: opp.work_type,
        }));
      });

      const allAppsArrays = await Promise.all(allAppsPromises);
      const combinedApps = allAppsArrays
        .flat()
        .sort((a, b) => new Date(b.applied_at) - new Date(a.applied_at));

      setApplications(combinedApps);
    } catch (error) {
      toast.error("Failed to load applications data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchApplications();
    }
  }, [user]);

  const handleStatusUpdate = async (id, currentStatus, newStatus) => {
    if (currentStatus === newStatus) return;

    const actionText = newStatus === "Accepted" ? "accept" : "reject";
    const confirmColor = newStatus === "Accepted" ? "#10b981" : "#ef4444";

    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `You are about to ${actionText} this application.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: confirmColor,
      cancelButtonColor: "#64748b",
      confirmButtonText: `Yes, ${actionText}!`,
      background: "#ffffff",
      customClass: {
        popup: "rounded-3xl shadow-2xl border border-slate-100",
        confirmButton: "px-6 py-2.5 rounded-xl font-semibold text-white",
        cancelButton: "px-6 py-2.5 rounded-xl font-semibold text-white",
      },
    });

    if (result.isConfirmed) {
      const toastId = toast.loading("Updating status...");
      try {
        await axiosSecure.patch(`/applications/status/${id}`, {
          status: newStatus,
        });
        setApplications((prev) =>
          prev.map((app) =>
            app._id === id ? { ...app, status: newStatus } : app,
          ),
        );
        toast.success(`Application ${newStatus.toLowerCase()} successfully`, {
          id: toastId,
        });
      } catch (error) {
        toast.error("Failed to update status", { id: toastId });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!startup) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto mt-10 bg-white p-10 rounded-3xl border border-slate-100 shadow-xl text-center"
      >
        <FiBriefcase className="text-6xl text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          No Startup Profile
        </h2>
        <p className="text-slate-500 mb-8">
          Create a startup profile and post opportunities to receive
          applications.
        </p>
        <Link href="/dashboard/my-startup">
          <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer">
            Create Startup
          </button>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 px-4 relative">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Review Applications
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage and evaluate candidates who applied to your startup roles.
        </p>
      </motion.div>

      {applications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center"
        >
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <FiFileText className="text-3xl text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">
            No applications yet
          </h3>
          <p className="text-slate-500 mb-6">
            When candidates apply for your opportunities, they will appear here.
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {applications.map((app) => (
            <motion.div
              key={app._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all p-6 flex flex-col h-full relative"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {app.role_title}
                  </h3>
                  <p className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md inline-block mt-1">
                    {app.work_type}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    app.status === "Accepted"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : app.status === "Rejected"
                        ? "bg-red-50 text-red-600 border-red-100"
                        : "bg-amber-50 text-amber-600 border-amber-100"
                  }`}
                >
                  {app.status}
                </span>
              </div>

              <div className="space-y-4 flex-grow border-t border-slate-100 pt-4 mt-2">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <FiUser size={14} />
                  </span>
                  <div className="font-medium truncate">
                    {app.applicant_email}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <FiClock size={14} />
                  </span>
                  <div className="font-medium">
                    {new Date(app.applied_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <FiExternalLink size={14} />
                  </span>
                  <a
                    href={app.portfolio_link}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-blue-600 hover:underline truncate"
                  >
                    View Portfolio / Profile
                  </a>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Motivation Message
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed text-justify line-clamp-3 hover:line-clamp-none transition-all">
                    {app.motivation}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-5 mt-4 border-t border-slate-100">
                <button
                  onClick={() =>
                    handleStatusUpdate(app._id, app.status, "Accepted")
                  }
                  disabled={app.status === "Accepted"}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 cursor-pointer bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200"
                >
                  <FiCheckCircle /> Accept
                </button>
                <button
                  onClick={() =>
                    handleStatusUpdate(app._id, app.status, "Rejected")
                  }
                  disabled={app.status === "Rejected"}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 cursor-pointer bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                >
                  <FiXCircle /> Reject
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
