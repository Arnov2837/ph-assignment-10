"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCreditCard, FiDollarSign } from "react-icons/fi";
import axiosSecure from "@/utils/axiosSecure";
import toast from "react-hot-toast";

export default function ManageTransactions() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axiosSecure.get("/payments");
        setPayments(res.data || []);
      } catch (error) {
        toast.error("Failed to load platform transaction records");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

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
          <FiCreditCard className="text-blue-600" /> Transaction Ledger
        </h1>
        <p className="text-slate-500 font-medium mt-1">Audit Stripe checkout streams, verify transaction hashes, and review financial inputs.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">Account</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">Transaction Identity</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">Financial Value</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">Status</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center font-bold text-slate-400">
                    No platform pipeline transactions recorded yet.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                          <FiDollarSign size={16} />
                        </div>
                        <p className="font-bold text-slate-800 text-sm">{p.user_email}</p>
                      </div>
                    </td>
                    <td className="p-5">
                      <code className="text-xs font-mono font-black text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                        {p.transaction_id}
                      </code>
                    </td>
                    <td className="p-5">
                      <p className="font-black text-emerald-600 text-sm">+${p.amount}</p>
                    </td>
                    <td className="p-5">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border uppercase tracking-wider ${
                        p.payment_status?.toLowerCase() === "succeeded" || p.payment_status?.toLowerCase() === "completed"
                          ? "bg-green-50 text-green-600 border-green-100"
                          : "bg-amber-50 text-amber-600 border-amber-100"
                      }`}>
                        {p.payment_status}
                      </span>
                    </td>
                    <td className="p-5">
                      <p className="text-xs text-slate-500 font-bold">
                        {new Date(p.paid_at || p.createdAt).toLocaleString()}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}