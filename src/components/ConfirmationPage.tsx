import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Check, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ConfirmationPage() {
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState('1042');

  useEffect(() => {
    // Generate order number or default to 1042
    const num = Math.floor(1000 + Math.random() * 900);
    setOrderNumber(num.toString());
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f6f8] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[430px] bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-6 text-center border border-neutral-100 flex flex-col items-center">
        {/* Animated Checkmark */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-5 border border-emerald-100"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', damping: 12 }}
          >
            <Check className="w-8 h-8 text-emerald-600" strokeWidth={3} />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-neutral-900 mb-1"
        >
          Order Confirmed
        </motion.h1>

        {/* Order Number */}
        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-5"
        >
          Order #{orderNumber}
        </motion.p>

        {/* Message */}
        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-neutral-600 mb-6 max-w-[260px] leading-relaxed"
        >
          Your order has been sent to the kitchen.
        </motion.p>

        {/* Estimated Time Card */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="w-full bg-[#f8f9fa] rounded-xl p-4 border border-neutral-100 mb-6"
        >
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
            Estimated time
          </span>
          <span className="text-xl font-bold text-[#ff5722]">
            20–25 min
          </span>
        </motion.div>

        {/* Action buttons */}
        <motion.button
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => navigate('/menu/table-12?tab=orders')}
          className="w-full bg-[#ff5722] hover:bg-[#e64a19] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider active:scale-[0.98] transition-all mb-2.5 shadow-sm"
        >
          <span>Track in My Orders</span>
        </motion.button>

        <motion.button
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45 }}
          onClick={() => navigate('/menu/table-12')}
          className="w-full bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider active:scale-[0.98] transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </motion.button>
      </div>
    </div>
  );
}
