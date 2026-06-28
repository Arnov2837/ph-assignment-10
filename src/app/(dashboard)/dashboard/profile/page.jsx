"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../../providers/AuthProvider";
import axiosSecure from "../../../../utils/axiosSecure";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiImage,
  FiBookOpen,
  FiStar,
  FiSave,
  FiUploadCloud,
} from "react-icons/fi";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const imgbbApiKey =
    process.env.NEXT_PUBLIC_IMGBB_API_KEY || "YOUR_IMGBB_API_KEY_HERE";

useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("Fetching profile for:", user?.email); // চেক করার জন্য
        const res = await axiosSecure.get(`/users/profile/${user?.email}`);
        console.log("Profile Data Found:", res.data); // চেক করার জন্য
        setProfile(res.data);
      } catch (error) {
        console.error("Profile Fetch Error Details:", error.response || error);
        toast.error(`Failed: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
      }
    };
    if (user?.email) fetchProfile();
  }, [user]);
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading("Updating profile...");

    let imageUrl = profile?.image;

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const imgRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
          {
            method: "POST",
            body: formData,
          },
        );
        const imgData = await imgRes.json();
        if (imgData.success) {
          imageUrl = imgData.data.url;
        } else {
          throw new Error("Image upload failed");
        }
      }

      const form = e.target;
      const updatedData = {
        name: form.name.value,
        bio: form.bio.value,
        skills: form.skills.value
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        image: imageUrl,
      };

      await axiosSecure.patch(`/users/profile/${user?.email}`, updatedData);
      setProfile({ ...profile, ...updatedData });
      toast.success("Profile updated successfully!", { id: toastId });
    } catch (error) {
      toast.error(error.message || "Failed to update profile", { id: toastId });
    } finally {
      setSaving(false);
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
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Personal Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Manage your personal information and portfolio settings.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600 to-indigo-600 z-0"></div>

            <div className="relative z-10 w-32 h-32 rounded-full p-1 bg-white shadow-lg mt-8 mb-4">
              <img
                src={
                  preview ||
                  profile?.image ||
                  "https://i.ibb.co/1GZvK7K/user-avatar.png"
                }
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
              <label className="absolute bottom-0 right-0 p-2.5 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-md border-2 border-white">
                <FiUploadCloud size={16} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <h3 className="text-xl font-black text-slate-800 relative z-10">
              {profile?.name}
            </h3>
            <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mt-1 relative z-10">
              {profile?.role}
            </p>

            <div className="w-full mt-8 pt-6 border-t border-slate-100 relative z-10 text-left space-y-4">
              <div className="flex items-center gap-3 text-slate-600">
                <FiMail className="text-slate-400 text-lg" />
                <span className="text-sm font-medium">{profile?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <FiStar className="text-slate-400 text-lg" />
                <span className="text-sm font-medium">
                  {profile?.skills?.length || 0} Skills Added
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <form
            onSubmit={handleUpdateProfile}
            className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FiUser /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={profile?.name}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-700 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FiMail /> Email Address
                </label>
                <input
                  type="email"
                  defaultValue={profile?.email}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 font-medium outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FiBookOpen /> Professional Bio
              </label>
              <textarea
                name="bio"
                defaultValue={profile?.bio}
                rows="4"
                placeholder="Tell us about your experience and motivation..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-700 outline-none resize-none"
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FiStar /> Skills (Comma separated)
              </label>
              <input
                type="text"
                name="skills"
                defaultValue={profile?.skills?.join(", ")}
                placeholder="e.g. React, Node.js, UI/UX Design"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-700 outline-none"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FiSave size={18} />
                )}
                {saving ? "Saving Changes..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
