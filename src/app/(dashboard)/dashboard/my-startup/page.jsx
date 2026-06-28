"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../../providers/AuthProvider";
import axiosSecure from "../../../../utils/axiosSecure";
import axios from "axios";
import toast from "react-hot-toast";
import { FiUploadCloud, FiTrash2, FiGlobe, FiLayers } from "react-icons/fi";

export default function MyStartupPage() {
  const { user } = useAuth();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");

  const [formData, setFormData] = useState({
    startup_name: "",
    logo: "",
    industry: "",
    description: "",
    funding_stage: "",
    founder_email: "",
  });

  const industries = [
    "SaaS",
    "Fintech",
    "Healthtech",
    "AI/ML",
    "E-commerce",
    "Edtech",
    "CleanTech",
  ];
  const fundingStages = [
    "Pre-seed",
    "Seed",
    "Series A",
    "Series B",
    "Bootstrapped",
  ];

  const fetchStartupData = async () => {
    try {
      const res = await axiosSecure.get(`/startups/founder/${user?.email}`);
      if (res.data && res.data.length > 0) {
        setStartup(res.data[0]);
      } else {
        setStartup(null);
      }
    } catch (error) {
      toast.error("Failed to load startup profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, founder_email: user.email }));
      fetchStartupData();
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imgbbFormData = new FormData();
    imgbbFormData.append("image", file);

    const toastId = toast.loading("Uploading logo to cloud...");
    try {
      const apiKey =
        process.env.NEXT_PUBLIC_IMGBB_API_KEY ||
        "8ea8bf517726d405ebc402b93478d1fb";
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        imgbbFormData,
      );
      const url = res.data.data.display_url;

      setFormData((prev) => ({ ...prev, logo: url }));
      setLogoPreview(url);
      toast.success("Logo uploaded successfully!", { id: toastId });
    } catch (error) {
      toast.error("Logo upload failed. Please try again.", { id: toastId });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!formData.founder_email && user?.email) {
      formData.founder_email = user.email;
    }

    if (!formData.logo) {
      toast.error("Please upload a startup logo first");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Creating your startup profile...");

    try {
      const res = await axiosSecure.post("/startups", formData);
      if (res.data) {
        toast.success("Startup profile created successfully!", { id: toastId });
        await fetchStartupData();
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Failed to create startup. Check console.";
      toast.error(errorMsg, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm("Are you sure you want to delete your startup profile?")
    )
      return;

    const toastId = toast.loading("Deleting startup profile...");
    try {
      await axiosSecure.delete(`/startups/${startup._id}`);
      toast.success("Startup profile deleted successfully", { id: toastId });
      setStartup(null);
      setLogoPreview("");
      setFormData({
        startup_name: "",
        logo: "",
        industry: "",
        description: "",
        funding_stage: "",
        founder_email: user?.email || "",
      });
    } catch (error) {
      toast.error("Failed to delete startup profile", { id: toastId });
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
    <div className="w-full max-w-4xl mx-auto space-y-10 px-4">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          My Startup
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage and present your startup venture to prospective partners.
        </p>
      </div>

      {startup ? (
        <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative" />
          <div className="px-8 pb-8 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 mb-8 gap-4">
              <img
                src={startup.logo}
                alt={startup.startup_name}
                className="w-32 h-32 rounded-2xl object-cover bg-white p-2 border border-slate-100 shadow-md ring-4 ring-white"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-medium text-sm transition-colors cursor-pointer"
                >
                  <FiTrash2 /> Delete Profile
                </button>
              </div>
            </div>

            <div className="space-y-6 w-full">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-3xl font-black text-slate-900">
                    {startup.startup_name}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      startup.status === "Approved"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : startup.status === "Rejected"
                          ? "bg-red-50 text-red-600 border border-red-100"
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                    }`}
                  >
                    {startup.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 mt-3 text-sm font-semibold text-slate-500">
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                    <FiGlobe className="text-blue-500" /> {startup.industry}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                    <FiLayers className="text-indigo-500" />{" "}
                    {startup.funding_stage}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 w-full">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Company Overview
                </h4>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap w-full text-justify">
                  {startup.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white p-6 md:p-10 rounded-3xl border border-slate-100 shadow-xl space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="space-y-2 w-full">
              <label className="text-sm font-bold text-slate-700">
                Startup Name
              </label>
              <input
                type="text"
                name="startup_name"
                required
                value={formData.startup_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 transition-shadow placeholder:text-slate-400"
                placeholder="Enter company legal or brand name"
              />
            </div>

            <div className="space-y-2 w-full">
              <label className="text-sm font-bold text-slate-700">
                Industry Sector
              </label>
              <select
                name="industry"
                required
                value={formData.industry}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white transition-shadow cursor-pointer"
              >
                <option value="">Select industry category</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 w-full">
              <label className="text-sm font-bold text-slate-700">
                Current Funding Stage
              </label>
              <select
                name="funding_stage"
                required
                value={formData.funding_stage}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white transition-shadow cursor-pointer"
              >
                <option value="">Select capital status</option>
                {fundingStages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 w-full">
              <label className="text-sm font-bold text-slate-700">
                Company Logo
              </label>
              <div className="relative flex items-center justify-center w-full border-2 border-dashed border-slate-200 rounded-xl hover:bg-slate-50 transition-colors p-3.5 group cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {logoPreview ? (
                  <div className="flex items-center gap-4 w-full px-2">
                    <img
                      src={logoPreview}
                      alt="Preview"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <span className="text-sm text-slate-500 font-medium truncate">
                      Change logo file
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <FiUploadCloud className="text-2xl text-slate-400 group-hover:text-blue-500 transition-colors mb-1" />
                    <span className="text-sm text-slate-500 font-medium">
                      Click to upload graphical file
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 space-y-2 w-full">
              <label className="text-sm font-bold text-slate-700">
                Detailed Description
              </label>
              <textarea
                name="description"
                required
                rows={6}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 transition-shadow resize-none placeholder:text-slate-400 text-justify"
                placeholder="Describe your market validation, product roadmap, and core business goals..."
              />
            </div>
          </div>

          <div className="flex justify-end w-full pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-md shadow-blue-200 disabled:opacity-70 transition-all cursor-pointer"
            >
              {submitting ? "Saving entry..." : "Create Startup Profile"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
