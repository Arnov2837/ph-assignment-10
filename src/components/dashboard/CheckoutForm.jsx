"use client";

import { useState, useEffect } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axiosSecure from "../../utils/axiosSecure";
import { useAuth } from "../../providers/AuthProvider";
import toast from "react-hot-toast";
import { FiLock, FiCheckCircle, FiShield, FiCreditCard } from "react-icons/fi";
import { motion } from "framer-motion";

export default function CheckoutForm({ onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();

  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState("");
  const price = 50;

  useEffect(() => {
    axiosSecure
      .post("/create-payment-intent", { amount: price })
      .then((res) => setClientSecret(res.data.clientSecret))
      .catch((err) => {
        console.error("Stripe Intent Error:", err);
        toast.error("Failed to connect to payment gateway.");
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error("Payment gateway is still loading...");
      return;
    }

    const card = elements.getElement(CardElement);
    if (card === null) {
      return;
    }

    setProcessing(true);
    setCardError("");
    const toastId = toast.loading("Verifying card details...");

    // কার্ডের ভ্যালিডেশন চেক
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setCardError(error.message);
      toast.error(error.message, { id: toastId });
      setProcessing(false);
      return;
    }

    // পেমেন্ট কনফার্মেশন
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            email: user?.email || "anonymous",
            name: user?.name || "anonymous",
          },
        },
      });

    if (confirmError) {
      setCardError(confirmError.message);
      toast.error(confirmError.message, { id: toastId });
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      toast.loading("Saving transaction...", { id: toastId });

      const paymentData = {
        user_email: user?.email,
        amount: price,
        transaction_id: paymentIntent.id,
        payment_status: "Completed",
      };

      try {
        await axiosSecure.post("/payments", paymentData);
        toast.success("Payment successful! Welcome to Premium.", {
          id: toastId,
        });
        onSuccess();
      } catch (saveError) {
        toast.error("Payment succeeded but database update failed.", {
          id: toastId,
        });
      }
    }

    setProcessing(false);
  };

  return (
    <div className="w-full">
      {/* Premium Package Details Header */}
      <div className="mb-8 pb-6 border-b border-slate-100">
        <div className="flex justify-between items-center mb-3">
          <span className="text-slate-500 font-semibold uppercase tracking-wider text-xs">
            Selected Plan
          </span>
          <span className="text-2xl font-black text-slate-900">
            ${price}.00
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
          <FiCheckCircle size={16} /> Unlimited Opportunity Posts
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <FiCreditCard className="text-blue-500" /> Enter Card Details
          </label>
          <div className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#1e293b",
                    fontFamily: "system-ui, sans-serif",
                    "::placeholder": { color: "#94a3b8" },
                  },
                  invalid: { color: "#ef4444" },
                },
              }}
            />
          </div>

          {/* Error Message Display */}
          {cardError && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-500 mt-2 font-medium bg-red-50 p-2 rounded-lg border border-red-100"
            >
              {cardError}
            </motion.p>
          )}
        </div>

        <button
          type="submit"
          disabled={!stripe || !clientSecret || processing}
          className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-200 disabled:opacity-50 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
        >
          {processing ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing Payment...
            </div>
          ) : (
            <>
              <FiLock size={18} /> Pay ${price}.00 Securely
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 mt-4">
          <FiShield size={14} /> Encrypted & Secure by Stripe
        </div>
      </form>
    </div>
  );
}
