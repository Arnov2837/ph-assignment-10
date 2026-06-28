"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../../providers/AuthProvider";
import axiosSecure from "../../../../utils/axiosSecure";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEdit2,
  FiTrash2,
  FiBriefcase,
  FiClock,
  FiMapPin,
  FiPlus,
  FiX,
  FiCheckCircle,
} from "react-icons/fi";

export default function ManageOpportunitiesPage() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editingOpp, setEditingOpp] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    role_title: "",
    required_skills: "",
    work_type: "",
    commitment_level: "",
    deadline: "",
    location: "",
  });

  const workTypes = ["Remote", "Hybrid", "On-site"];
  const commitmentLevels = ["Full-time", "Part-time", "Contract", "Internship"];

  const fetchData = async () => {
    try {
      const startupRes = await axiosSecure.get(
        `/startups/founder/${user?.email}`,
      );
      if (startupRes.data && startupRes.data.length > 0) {
        const foundStartup = startupRes.data[0];
        setStartup(foundStartup);

        const oppRes = await axiosSecure.get(
          `/opportunities/startup/${foundStartup._id}`,
        );
        setOpportunities(oppRes.data);
      }
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchData();
    }
  }, [user]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Confirm Deletion",
      text: "This job listing will be permanently removed from StartupForge.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#ffffff",
      customClass: {
        popup: "rounded-3xl shadow-2xl border border-slate-100",
        confirmButton: "px-6 py-2.5 rounded-xl font-semibold text-white",
        cancelButton: "px-6 py-2.5 rounded-xl font-semibold text-white",
      },
    });

    if (result.isConfirmed) {
      const toastId = toast.loading("Deleting opportunity...");
      try {
        await axiosSecure.delete(`/opportunities/${id}`);
        setOpportunities(opportunities.filter((opp) => opp._id !== id));
        toast.success("Opportunity deleted successfully", { id: toastId });
        Swal.fire({
          title: "Deleted!",
          text: "The opportunity has been removed.",
          icon: "success",
          confirmButtonColor: "#2563eb",
          customClass: {
            popup: "rounded-3xl shadow-2xl border border-slate-100",
            confirmButton: "px-6 py-2.5 rounded-xl font-semibold text-white",
          },
        });
      } catch (error) {
        toast.error("Failed to delete", { id: toastId });
      }
    }
  };

  const openEditModal = (opp) => {
    setEditingOpp(opp);
    setEditForm({
      role_title: opp.role_title,
      required_skills: opp.required_skills.join(", "),
      work_type: opp.work_type,
      commitment_level: opp.commitment_level,
      deadline: new Date(opp.deadline).toISOString().split("T")[0],
      location: opp.location || "",
    });
  };

  const closeEditModal = () => {
    setEditingOpp(null);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const toastId = toast.loading("Updating opportunity...");

    try {
      const skillsArray = editForm.required_skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      const payload = {
        role_title: editForm.role_title,
        required_skills: skillsArray,
        work_type: editForm.work_type,
        commitment_level: editForm.commitment_level,
        deadline: editForm.deadline,
        location: editForm.location,
      };

      const res = await axiosSecure.patch(
        `/opportunities/${editingOpp._id}`,
        payload,
      );

      if (res.data) {
        toast.success("Opportunity updated successfully", { id: toastId });
        fetchData();
        closeEditModal();
      }
    } catch (error) {
      toast.error("Update failed", { id: toastId });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 px-4 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Opportunities
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review, update, or remove job listings for your startup.
          </p>
        </motion.div>
        <Link href="/dashboard/add-opportunity">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md transition-all cursor-pointer"
          >
            <FiPlus /> Post New
          </motion.button>
        </Link>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {opportunities.map((opp) => (
          <motion.div
            key={opp._id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -8 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all p-6 flex flex-col h-full relative group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl font-black border border-blue-100">
                {startup.startup_name.charAt(0)}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(opp)}
                  className="w-9 h-9 rounded-xl bg-slate-50 text-slate-500 hover:text-blue-600 hover:bg-blue-100 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(opp._id)}
                  className="w-9 h-9 rounded-xl bg-slate-50 text-slate-500 hover:text-red-600 hover:bg-red-100 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>

            <div className="flex-grow space-y-4">
              <h3 className="text-xl font-bold text-slate-900 leading-tight">
                {opp.role_title}
              </h3>

              <div className="space-y-2 text-sm font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-500">
                    <FiMapPin size={14} />
                  </span>
                  {opp.work_type} {opp.location && `• ${opp.location}`}
                </div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-500">
                    <FiBriefcase size={14} />
                  </span>
                  {opp.commitment_level}
                </div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-amber-50 text-amber-500">
                    <FiClock size={14} />
                  </span>
                  Deadline: {new Date(opp.deadline).toLocaleDateString()}
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-2">
                {opp.required_skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-slate-50 text-slate-600 text-[11px] font-bold rounded-lg border border-slate-100 uppercase tracking-tighter"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {editingOpp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-800">
                  Edit Opportunity
                </h3>
                <button
                  onClick={closeEditModal}
                  className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded-full cursor-pointer transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">
                      Role Title
                    </label>
                    <input
                      type="text"
                      name="role_title"
                      required
                      value={editForm.role_title}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 text-slate-900 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">
                      Deadline
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      required
                      value={editForm.deadline}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 text-slate-900 cursor-pointer outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">
                      Work Type
                    </label>
                    <select
                      name="work_type"
                      required
                      value={editForm.work_type}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer outline-none"
                    >
                      {workTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">
                      Commitment Level
                    </label>
                    <select
                      name="commitment_level"
                      required
                      value={editForm.commitment_level}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer outline-none"
                    >
                      {commitmentLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-sm font-bold text-slate-700">
                      Location (Optional)
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={editForm.location}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 text-slate-900 outline-none"
                      placeholder="e.g. Dhaka, Bangladesh"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-sm font-bold text-slate-700">
                      Required Skills (Comma separated)
                    </label>
                    <input
                      type="text"
                      name="required_skills"
                      required
                      value={editForm.required_skills}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 text-slate-900 outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-6 py-3 rounded-xl font-semibold text-slate-500 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg disabled:opacity-70 transition-all cursor-pointer"
                  >
                    {updating ? "Saving Changes..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
