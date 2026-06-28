"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiUsers,
  FiTarget,
  FiZap,
  FiBriefcase,
} from "react-icons/fi";
import { BsRocket } from "react-icons/bs";
import axiosSecure from "../../utils/axiosSecure";

export default function HomePage() {
  const [recentOpportunities, setRecentOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await axiosSecure.get("/opportunities/recent");
        setRecentOpportunities(res.data);
      } catch (error) {
        setRecentOpportunities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunities();
  }, []);

  const steps = [
    {
      icon: <FiTarget className="text-3xl text-blue-500" />,
      title: "Publish Your Vision",
      description:
        "Founders can easily pitch their startup ideas, outline their goals, and list the exact skills they are looking for.",
    },
    {
      icon: <FiUsers className="text-3xl text-indigo-500" />,
      title: "Find Your Match",
      description:
        "Collaborators browse vetted startup opportunities and apply to the ones that align with their expertise and passion.",
    },
    {
      icon: <FiZap className="text-3xl text-purple-500" />,
      title: "Build Together",
      description:
        "Connect instantly, form your dream team, and start working on the next big thing with integrated collaboration tools.",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fafcff]">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 blur-[120px]" />
      </div>

      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20 pb-32 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-blue-100 text-blue-600 text-sm font-bold mb-8 shadow-sm tracking-wide uppercase"
          >
            <BsRocket className="text-blue-500 text-lg" />
            Empowering the next generation
          </motion.span>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
            Build your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              dream team
            </span>
            <br />
            shape the future.
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Connect with visionary founders and talented collaborators. Turn
            your startup idea into reality with the right people by your side.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="/opportunities" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg shadow-[0_8px_30px_rgb(79,70,229,0.3)] hover:shadow-[0_8px_30px_rgb(79,70,229,0.5)] transition-all"
              >
                Explore Opportunities
                <FiArrowRight className="text-xl" />
              </motion.button>
            </Link>
            <Link href="/startups" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white border-2 border-slate-200 text-slate-700 font-semibold text-lg hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
              >
                <FiUsers className="text-xl text-blue-600" />
                Browse Startups
              </motion.button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-20 w-full max-w-5xl"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/60 bg-white/40 backdrop-blur-md p-2">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 -z-10" />
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2850&auto=format&fit=crop"
              alt="Startup Team Collaboration"
              className="w-full h-auto object-cover rounded-2xl shadow-inner max-h-[600px]"
            />
          </div>
        </motion.div>
      </section>

      <section className="py-24 bg-white relative z-10 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              How StartupForge Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A seamless process designed to turn abstract ideas into fully
              functioning tech companies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 border border-slate-100">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 relative z-10 bg-[#fafcff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Live Opportunities
              </h2>
              <p className="text-lg text-slate-600">
                Real startups looking for talented people right now.
              </p>
            </div>
            <Link
              href="/opportunities"
              className="hidden md:flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              View All <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : recentOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentOpportunities.map((opp) => (
                <motion.div
                  key={opp._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xl">
                      {opp.startupName?.charAt(0) || "S"}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {opp.startupName}
                      </h3>
                      <p className="text-sm text-slate-500">{opp.roleNeeded}</p>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm mb-6 line-clamp-2">
                    {opp.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <FiBriefcase /> Equity: {opp.equity || "Negotiable"}
                    </span>
                    <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                      Apply Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <FiBriefcase className="text-5xl text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700 mb-2">
                No open opportunities yet
              </h3>
              <p className="text-slate-500 mb-6">
                Be the first founder to post a requirement and build your team.
              </p>
              <Link href="/dashboard">
                <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                  Post an Opportunity
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
