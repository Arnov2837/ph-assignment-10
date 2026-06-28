"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiClock, FiCalendar, FiArrowLeft, FiSend, FiX, FiLink, FiBriefcase , FiMessageSquare } from "react-icons/fi";
import axiosSecure from "@/utils/axiosSecure";
import { useAuth } from "@/providers/AuthProvider";
import toast from "react-hot-toast";
import Link from "next/link";

export default function OpportunityDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const res = await axiosSecure.get(`/opportunities/${id}`);
        setOpportunity(res.data);
      } catch (error) {
        toast.error("Failed to load details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOpportunity();
  }, [id]);

  const handleApplyClick = () => {
    if (!user) {
      toast.error("Please login to apply!");
      router.push("/login");
      return;
    }
    setIsModalOpen(true);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.target;
    
    const applicationData = {
      opportunity_id: id,
      applicant_email: user.email,
      portfolio_link: form.portfolio.value,
      motivation: form.motivation.value,
    };

    try {
      await axiosSecure.post("/applications", applicationData);
      toast.success("Application submitted successfully!");
      setIsModalOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#f4f7fe]">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!opportunity) return null;

  return (
    <div className="min-h-screen bg-[#f4f7fe] font-sans pb-20 pt-10">
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

          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between mb-10">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                {opportunity.startup_id?.logo ? (
                  <img src={opportunity.startup_id.logo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-black text-blue-600">
                    {opportunity.startup_id?.startup_name?.charAt(0) || "S"}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{opportunity.role_title}</h1>
                <p className="text-lg font-bold text-blue-600 mt-1">{opportunity.startup_id?.startup_name}</p>
              </div>
            </div>
            
            <button 
              onClick={handleApplyClick}
              className="w-full md:w-auto px-8 py-4 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              Apply Now <FiSend />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <FiMapPin className="text-blue-500 text-xl mb-2" />
              <p className="text-xs font-bold text-slate-400 uppercase">Location</p>
              <p className="font-bold text-slate-800">{opportunity.location || "Remote"}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <FiClock className="text-blue-500 text-xl mb-2" />
              <p className="text-xs font-bold text-slate-400 uppercase">Type</p>
              <p className="font-bold text-slate-800">{opportunity.work_type}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <FiBriefcase className="text-blue-500 text-xl mb-2" />
              <p className="text-xs font-bold text-slate-400 uppercase">Commitment</p>
              <p className="font-bold text-slate-800">{opportunity.commitment_level}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <FiCalendar className="text-blue-500 text-xl mb-2" />
              <p className="text-xs font-bold text-slate-400 uppercase">Deadline</p>
              <p className="font-bold text-slate-800">{new Date(opportunity.deadline).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {opportunity.required_skills.map((skill, index) => (
                  <span key={index} className="px-4 py-2 bg-blue-50 text-blue-700 font-bold text-sm rounded-xl border border-blue-100">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 mb-4">About the Startup</h3>
              <p className="text-slate-600 leading-relaxed font-medium bg-slate-50 p-6 rounded-2xl border border-slate-100">
                {opportunity.startup_id?.description || "No description provided."}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-lg bg-white rounded-[2rem] p-8 shadow-2xl border border-slate-100 z-50"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-slate-900">Apply for Role</h2>
                <button onClick={() => setIsModalOpen(false)} className="cursor-pointer p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-colors">
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitApplication} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <FiLink /> Portfolio / Resume Link
                  </label>
                  <input
                    type="url"
                    name="portfolio"
                    required
                    placeholder="https://your-portfolio.com"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium text-slate-800 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <FiMessageSquare /> Motivation Message
                  </label>
                  <textarea
                    name="motivation"
                    required
                    rows="4"
                    placeholder="Why are you a great fit for this role?"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium text-slate-800 outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>Submit Application <FiSend /></>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}