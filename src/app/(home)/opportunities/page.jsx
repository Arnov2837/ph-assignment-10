"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiMapPin,
  FiClock,
  FiCalendar,
  FiArrowRight,
  FiBriefcase,
} from "react-icons/fi";
import axiosSecure from "@/utils/axiosSecure";
import toast from "react-hot-toast";

export default function BrowseOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [workType, setWorkType] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  const workTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Freelance",
    "Internship",
  ];

  useEffect(() => {
    const fetchOpportunities = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page,
          limit,
          ...(search && { search }),
          ...(workType && { work_type: workType }),
        });

        const res = await axiosSecure.get(`/opportunities?${queryParams}`);
        setOpportunities(res.data.result || []);
        setTotalPages(Math.ceil((res.data.total || 0) / limit));
      } catch (error) {
        toast.error("Failed to load opportunities");
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchOpportunities();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [search, workType, page]);

  return (
    <div className="min-h-screen bg-[#f4f7fe] font-sans pb-20">
      <div className="bg-white border-b border-slate-200 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Discover Your Next <span className="text-blue-600">Big Role</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium">
              Join top startups and build the future. Search by role, skills, or
              work type.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-10 max-w-4xl mx-auto bg-white p-4 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1 relative flex items-center bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
              <FiSearch className="text-slate-400 text-xl" />
              <input
                type="text"
                placeholder="Search by role or required skills..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-transparent border-none outline-none px-3 font-semibold text-slate-700 placeholder:text-slate-400"
              />
            </div>

            <div className="w-full md:w-64 relative flex items-center bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
              <FiBriefcase className="text-slate-400 text-xl" />
              <select
                value={workType}
                onChange={(e) => {
                  setWorkType(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-transparent border-none outline-none px-3 font-semibold text-slate-700 appearance-none cursor-pointer"
              >
                <option value="">All Work Types</option>
                {workTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <AnimatePresence>
            {opportunities.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-[2rem] border border-slate-200 shadow-sm"
              >
                <FiSearch className="mx-auto text-6xl text-slate-300 mb-4" />
                <h3 className="text-2xl font-black text-slate-800">
                  No opportunities found
                </h3>
                <p className="text-slate-500 font-medium mt-2">
                  Try adjusting your search or filters.
                </p>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {opportunities.map((opp, index) => (
                    <motion.div
                      key={opp._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col h-full group"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                          {opp.startup_id?.logo ? (
                            <img
                              src={opp.startup_id.logo}
                              alt="Logo"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xl font-black text-blue-600">
                              {opp.startup_id?.startup_name?.charAt(0) || "S"}
                            </span>
                          )}
                        </div>
                        <span className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider rounded-lg">
                          {opp.work_type}
                        </span>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {opp.role_title}
                        </h3>
                        <Link
                          href={`/startups/${opp.startup_id?._id}`}
                          className="hover:text-blue-600 hover:underline transition-all"
                        >
                          <p className="text-sm font-bold text-slate-500 mt-1">
                            {opp.startup_id?.startup_name || "Unknown Startup"}
                          </p>
                        </Link>

                        <div className="flex flex-wrap gap-2 mt-4">
                          {opp.required_skills.slice(0, 3).map((skill, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 bg-slate-50 border border-slate-100 text-slate-600 text-xs font-semibold rounded-md"
                            >
                              {skill}
                            </span>
                          ))}
                          {opp.required_skills.length > 3 && (
                            <span className="px-2.5 py-1 bg-slate-50 border border-slate-100 text-slate-600 text-xs font-semibold rounded-md">
                              +{opp.required_skills.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                        <div className="flex items-center justify-between text-sm text-slate-500 font-medium">
                          <span className="flex items-center gap-1.5">
                            <FiMapPin /> {opp.location || "Remote"}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <FiClock /> {opp.commitment_level}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-500 font-medium pb-4">
                          <span className="flex items-center gap-1.5">
                            <FiCalendar />{" "}
                            {new Date(opp.deadline).toLocaleDateString()}
                          </span>
                        </div>

                        <Link
                          href={`/opportunities/${opp._id}`}
                          className="block w-full"
                        >
                          <button className="w-full py-3.5 bg-slate-900 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                            View Details <FiArrowRight />
                          </button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold disabled:opacity-50 transition-colors hover:bg-slate-50"
                    >
                      Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-lg font-bold transition-all ${
                          page === i + 1
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                      className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold disabled:opacity-50 transition-colors hover:bg-slate-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
