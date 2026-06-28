"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiUsers, FiUserCheck, FiUserMinus } from "react-icons/fi";
import axiosSecure from "@/utils/axiosSecure";
import toast from "react-hot-toast";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosSecure.get("/users");
        setUsers(res.data || []);
      } catch (error) {
        toast.error("Failed to load platform users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleBlockToggle = async (id, currentStatus) => {
    try {
      await axiosSecure.patch(`/users/block/${id}`, { isBlocked: !currentStatus });
      toast.success(`User successfully ${currentStatus ? "unblocked" : "blocked"}`);
      setUsers(users.map(u => u._id === id ? { ...u, isBlocked: !currentStatus } : u));
    } catch (error) {
      toast.error("Security authorization action failed");
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
          <FiUsers className="text-blue-600" /> Manage Users
        </h1>
        <p className="text-slate-500 font-medium mt-1">Audit profiles and regulate access authentication across the ecosystem.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">Identity Details</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">Platform Persona</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">Operational Status</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Access Governance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-black uppercase text-sm">
                        {u.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{u.name}</p>
                        <p className="text-xs text-slate-400 font-semibold mt-0.5">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg uppercase tracking-wider">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-5">
                    <span className={`px-3 py-1 text-xs font-bold rounded-lg border uppercase tracking-wider ${
                      u.isBlocked ? "bg-red-50 text-red-600 border-red-100" : "bg-green-50 text-green-600 border-green-100"
                    }`}>
                      {u.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <button
                      onClick={() => handleBlockToggle(u._id, u.isBlocked)}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border inline-flex items-center gap-1.5 ${
                        u.isBlocked ? "bg-green-600 hover:bg-green-700 text-white border-green-600" : "bg-white hover:bg-red-50 text-red-500 border-slate-200 hover:border-red-200"
                      }`}
                    >
                      {u.isBlocked ? <><FiUserCheck /> Unblock User</> : <><FiUserMinus /> Block User</>}
                    </button>
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