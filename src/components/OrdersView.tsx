import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, CheckCircle2, ChefHat, UtensilsCrossed, BellRing } from 'lucide-react';
import { useStore } from '../StoreContext';
import { OrderRecord } from '../types';

interface OrdersViewProps {
  onBackToMenu: () => void;
}

export function OrdersView({ onBackToMenu }: OrdersViewProps) {
  const { orders, tableNumber } = useStore();

  const activeOrders = orders.filter((o) => o.isActive);
  const pastOrders = orders.filter((o) => !o.isActive);

  return (
    <div className="flex-1 flex flex-col pb-24 overflow-y-auto">
      {/* Sticky header */}
      <header className="sticky top-0 z-20 bg-[#f2f3f5]/95 backdrop-blur-md px-3.5 pt-3.5 pb-3 border-b border-neutral-200/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBackToMenu}
            className="w-8 h-8 rounded-full bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-700 active:scale-95 shadow-xs"
            aria-label="Back to menu"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-base font-bold text-neutral-900 tracking-tight">
            My Orders
          </h1>
        </div>

        <span className="text-[11px] font-semibold text-neutral-600 uppercase bg-white border border-neutral-200/80 px-2.5 py-1 rounded-full shadow-xs">
          {tableNumber}
        </span>
      </header>

      <div className="p-3.5 space-y-5">
        {/* ACTIVE ORDERS SECTION */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              Active Order
            </span>
            {activeOrders.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#ff5722]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5722] animate-ping" />
                Live Tracking
              </span>
            )}
          </div>

          {activeOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-5 border border-neutral-200/70 text-center shadow-xs">
              <p className="text-neutral-500 text-xs">No active orders right now.</p>
              <button
                onClick={onBackToMenu}
                className="mt-3 text-xs font-bold text-[#ff5722] hover:underline"
              >
                Browse Menu & Order →
              </button>
            </div>
          ) : (
            activeOrders.map((order) => (
              <ActiveOrderCard key={order.id} order={order} />
            ))
          )}
        </div>

        {/* ORDER HISTORY SECTION */}
        <div>
          <div className="mb-2 px-1">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              Order History
            </span>
          </div>

          <div className="space-y-3">
            {pastOrders.map((order) => (
              <HistoryOrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActiveOrderCard({ order }: { order: OrderRecord }) {
  // Stepper statuses: Order received -> Preparing -> Ready -> Served
  const steps: { label: string; key: OrderRecord['status']; icon: React.ReactNode }[] = [
    { label: 'Received', key: 'Order received', icon: <BellRing className="w-3.5 h-3.5" /> },
    { label: 'Preparing', key: 'Preparing', icon: <ChefHat className="w-3.5 h-3.5" /> },
    { label: 'Ready', key: 'Ready', icon: <UtensilsCrossed className="w-3.5 h-3.5" /> },
    { label: 'Served', key: 'Served', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  ];

  const currentStepIndex = 1; // "Preparing"

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-4 border border-neutral-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
    >
      {/* Top Header */}
      <div className="flex items-start justify-between pb-3 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-neutral-900">
              Order #{order.id}
            </h2>
            <span className="text-[11px] text-neutral-400 font-medium">
              • {order.date}
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            {order.tableNumber} • Dine-in
          </p>
        </div>

        {/* Status indicator pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ff5722]/10 border border-[#ff5722]/20">
          <span className="w-2 h-2 rounded-full bg-[#ff5722] animate-pulse" />
          <span className="text-[11px] font-bold text-[#ff5722]">
            {order.status}
          </span>
        </div>
      </div>

      {/* Visual Status Stepper */}
      <div className="py-3.5 border-b border-neutral-100">
        <div className="flex items-center justify-between relative">
          {/* Connecting line */}
          <div className="absolute top-3.5 left-5 right-5 h-[2px] bg-neutral-100 -z-0">
            <div
              className="h-full bg-[#ff5722] transition-all"
              style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={step.label} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-[#ff5722] text-white shadow-[0_0_0_3px_rgba(255,87,34,0.2)]'
                      : isCompleted
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-400'
                  }`}
                >
                  {step.icon}
                </div>
                <span
                  className={`text-[10px] mt-1.5 font-semibold ${
                    isCurrent
                      ? 'text-[#ff5722]'
                      : isCompleted
                      ? 'text-neutral-800'
                      : 'text-neutral-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Estimated time callout */}
      {order.estimatedTime && (
        <div className="my-3 py-2 px-3 rounded-xl bg-orange-50/70 border border-orange-100/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#ff5722]" />
            <span className="text-xs font-semibold text-neutral-700">
              Estimated time
            </span>
          </div>
          <span className="text-xs font-bold text-[#ff5722]">
            {order.estimatedTime}
          </span>
        </div>
      )}

      {/* Ordered Items List */}
      <div className="pt-1 pb-2 space-y-1.5">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs text-neutral-700">
            <span className="font-medium truncate pr-2">
              {item.name} <span className="text-neutral-400 font-normal">× {item.quantity}</span>
            </span>
            <span className="font-semibold text-neutral-900 shrink-0">
              ₹{item.price}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="pt-2.5 mt-2 border-t border-neutral-100 flex items-center justify-between">
        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
          Total Amount
        </span>
        <span className="text-base font-extrabold text-neutral-900 tracking-tight">
          ₹{order.total}
        </span>
      </div>
    </motion.div>
  );
}

function HistoryOrderCard({ order }: { order: OrderRecord }) {
  return (
    <div className="bg-white rounded-2xl p-3.5 border border-neutral-200/70 shadow-xs">
      <div className="flex items-start justify-between pb-2 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-neutral-900">
              Order #{order.id}
            </h3>
            <span className="text-[11px] text-neutral-400">
              • {order.date}
            </span>
          </div>
          <span className="text-[11px] text-neutral-400">
            {order.tableNumber}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Completed</span>
        </div>
      </div>

      {/* Items list */}
      <div className="py-2 space-y-1 text-xs text-neutral-600">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <span className="truncate pr-2">
              {item.name} <span className="text-neutral-400 font-normal">× {item.quantity}</span>
            </span>
            <span className="font-medium text-neutral-800 shrink-0">
              ₹{item.price}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
        <span className="font-semibold text-neutral-500">Paid Total</span>
        <span className="font-bold text-neutral-900 text-sm">
          ₹{order.total}
        </span>
      </div>
    </div>
  );
}
