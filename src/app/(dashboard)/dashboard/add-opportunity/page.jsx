"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import axiosSecure from "../../../../utils/axiosSecure";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FiBriefcase,
  FiAlertCircle,
  FiMapPin,
  FiCheckCircle,
  FiStar,
} from "react-icons/fi";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../../../../components/dashboard/CheckoutForm";
import { useAuth } from "@/providers/AuthProvider";

// Replace with your actual Stripe publishable key
// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
// );

const stripePromise = loadStripe(
  "pk_test_51SWT0pDZgzip4lF0h1kDFwd7ydg4P6K8lBzXHtqCm77thdpuLZNFPHCZQjcPPJFbo1JhoK4X0k2xzTuAPLCm8Kts00Wq7gb9yF",
);

export default function AddOpportunityPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [startupData, setStartupData] = useState(null);

  // States for payment logic
  const [isPremium, setIsPremium] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    role_title: "",
    required_skills: "",
    work_type: "",
    commitment_level: "",
    deadline: "",
    location: "",
  });

  const workTypes = ["Remote", "Hybrid", "On-site"];
  const commitmentLevels = ["Full-time", "Part-time", "Contract", "Internship"];

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user?.email) return;

      try {
        // 1. Fetch Founder's Startup
        const startupRes = await axiosSecure.get(
          `/startups/founder/${user.email}`,
        );
        let foundStartup = null;

        if (startupRes.data && startupRes.data.length > 0) {
          foundStartup = startupRes.data[0];
          setStartupData(foundStartup);
        }

        // 2. Fetch Payment Status
        const paymentRes = await axiosSecure.get("/payments");
        const userPayment = paymentRes.data.find(
          (p) =>
            p.user_email === user.email && p.payment_status === "Completed",
        );
        if (userPayment) {
          setIsPremium(true);
        }

        // 3. Count Total Posted Opportunities (if startup exists)
        if (foundStartup) {
          const oppRes = await axiosSecure.get(
            `/opportunities/startup/${foundStartup._id}`,
          );
          setTotalPosts(oppRes.data.length);
        }
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaymentSuccess = () => {
    setIsPremium(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!startupData) {
      toast.error("You need to create a startup profile first!");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Publishing opportunity...");

    try {
      const skillsArray = formData.required_skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      const payload = {
        startup_id: startupData._id,
        role_title: formData.role_title,
        required_skills: skillsArray,
        work_type: formData.work_type,
        commitment_level: formData.commitment_level,
        deadline: formData.deadline,
        location: formData.location,
      };

      const res = await axiosSecure.post("/opportunities", payload);

      if (res.data) {
        toast.success("Opportunity published successfully!", { id: toastId });
        setFormData({
          role_title: "",
          required_skills: "",
          work_type: "",
          commitment_level: "",
          deadline: "",
          location: "",
        });
        setTimeout(() => {
          router.push("/dashboard/manage-opportunities");
        }, 1500);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to publish opportunity",
        { id: toastId },
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // CONDITION 1: No Startup Found
  if (!startupData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto mt-10 bg-white p-10 rounded-3xl border border-slate-100 shadow-xl text-center"
      >
        <FiAlertCircle className="text-6xl text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Startup Profile Required
        </h2>
        <p className="text-slate-500 mb-8">
          You must have an active startup profile before you can post
          opportunities and recruit team members.
        </p>
        <Link href="/dashboard/my-startup">
          <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer">
            Create My Startup Now
          </button>
        </Link>
      </motion.div>
    );
  }

  // CONDITION 2: Reached Limit & Not Premium
  if (totalPosts >= 3 && !isPremium) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl mx-auto mt-6 bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-10 text-center text-white">
          <FiStar className="text-5xl text-amber-400 mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold mb-2">Upgrade to Premium</h2>
          <p className="text-slate-300 max-w-lg mx-auto">
            You have reached the free limit of 3 opportunity posts. Unlock
            unlimited posting capabilities to build your dream team.
          </p>
        </div>

        <div className="p-10 bg-white">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">
              Complete Secure Payment
            </h3>
            <Elements stripe={stripePromise}>
              <CheckoutForm onSuccess={handlePaymentSuccess} />
            </Elements>
          </div>
        </div>
      </motion.div>
    );
  }

  // CONDITION 3: Normal Form View (Free Limit NOT Reached OR Premium Activated)
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full max-w-4xl mx-auto space-y-8 px-4"
    >
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Post New Opportunity
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Publish a new role for{" "}
            <span className="font-bold text-blue-600">
              {startupData.startup_name}
            </span>
            .
          </p>
        </div>
        {isPremium && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 text-xs font-bold uppercase rounded-lg border border-amber-200">
            <FiStar /> Premium Active
          </span>
        )}
      </div>

      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="w-full bg-white p-6 md:p-10 rounded-3xl border border-slate-100 shadow-xl space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="space-y-2 w-full">
            <label className="text-sm font-bold text-slate-700">
              Role Title
            </label>
            <input
              type="text"
              name="role_title"
              required
              value={formData.role_title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 transition-shadow placeholder:text-slate-400"
              placeholder="e.g. Senior Frontend Developer"
            />
          </div>

          <div className="space-y-2 w-full">
            <label className="text-sm font-bold text-slate-700">Deadline</label>
            <input
              type="date"
              name="deadline"
              required
              value={formData.deadline}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 transition-shadow cursor-pointer"
            />
          </div>

          <div className="space-y-2 w-full">
            <label className="text-sm font-bold text-slate-700">
              Work Type
            </label>
            <select
              name="work_type"
              required
              value={formData.work_type}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white transition-shadow cursor-pointer"
            >
              <option value="">Select work location</option>
              {workTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 w-full">
            <label className="text-sm font-bold text-slate-700">
              Commitment Level
            </label>
            <select
              name="commitment_level"
              required
              value={formData.commitment_level}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white transition-shadow cursor-pointer"
            >
              <option value="">Select commitment level</option>
              {commitmentLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 space-y-2 w-full">
            <label className="text-sm font-bold text-slate-700">
              Required Skills
            </label>
            <input
              type="text"
              name="required_skills"
              required
              value={formData.required_skills}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 transition-shadow placeholder:text-slate-400"
              placeholder="e.g. React, Node.js, UI/UX Design (Separate with commas)"
            />
          </div>

          <div className="md:col-span-2 space-y-2 w-full">
            <label className="text-sm font-bold text-slate-700">
              Location (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <FiMapPin />
              </span>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 transition-shadow placeholder:text-slate-400"
                placeholder="e.g. Dhaka, Bangladesh"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end w-full pt-4 border-t border-slate-100">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-md shadow-blue-200 disabled:opacity-70 transition-all cursor-pointer"
          >
            <FiCheckCircle className="text-lg" />
            {submitting ? "Publishing..." : "Publish Opportunity"}
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
}
