import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useStore } from '../StoreContext';
import { useNavigate } from 'react-router-dom';

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSheet({ isOpen, onClose }: CartSheetProps) {
  const { cart, updateQuantity, cartTotal, tableNumber, clearCart, placeOrder } = useStore();
  const navigate = useNavigate();

  // 5% taxes calculation rounded to integer as per demo
  const taxes = Math.round(cartTotal * 0.05);
  const finalTotal = cartTotal + taxes;

  const handlePlaceOrder = () => {
    placeOrder();
    onClose();
    navigate('/confirmation');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-xs"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-50 bg-white rounded-t-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#ff5722]" />
                <h2 className="text-base font-bold text-neutral-900">
                  Your Order
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-neutral-500 uppercase bg-neutral-100 px-2.5 py-0.5 rounded-full">
                  {tableNumber}
                </span>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 active:bg-neutral-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[260px]">
                <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center mb-3 text-neutral-400">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-neutral-800 mb-1">
                  Your cart is empty
                </h3>
                <p className="text-xs text-neutral-400 max-w-[200px] mb-4">
                  Add some delicious items from the menu to place an order.
                </p>
                <button
                  onClick={onClose}
                  className="text-xs font-bold text-[#ff5722] border border-[#ff5722] rounded-lg px-4 py-2 hover:bg-[#fff3ef] transition-colors"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-4 py-3 divide-y divide-neutral-100">
                  {cart.map((item) => {
                    const itemAddonsTotal = item.addons
                      ? item.addons.reduce((sum, a) => sum + a.price, 0)
                      : 0;
                    const itemUnitPrice = item.price + itemAddonsTotal;
                    const itemTotalPrice = itemUnitPrice * item.quantity;

                    return (
                      <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between">
                            <h4 className="font-semibold text-neutral-900 text-sm truncate">
                              {item.name}
                            </h4>
                          </div>
                          {item.quantity > 1 && (
                            <p className="text-[11px] text-neutral-400">
                              ₹{itemUnitPrice} × {item.quantity}
                            </p>
                          )}
                          {item.spiceLevel && (
                            <p className="text-[11px] text-neutral-400">
                              Spice: {item.spiceLevel}
                            </p>
                          )}
                          {item.addons && item.addons.length > 0 && (
                            <p className="text-[11px] text-neutral-400 truncate">
                              + {item.addons.map((a) => a.name).join(', ')}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {/* Compact quantity button matching reference */}
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-5 h-5 rounded-[3px] bg-[#1e1e20] text-white flex items-center justify-center hover:bg-black active:scale-90"
                            >
                              <Minus className="w-3 h-3 text-white" strokeWidth={2.5} />
                            </button>
                            <span className="text-xs font-bold text-neutral-800 w-3.5 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-5 h-5 rounded-[3px] bg-[#1e1e20] text-white flex items-center justify-center hover:bg-black active:scale-90"
                            >
                              <Plus className="w-3 h-3 text-white" strokeWidth={2.5} />
                            </button>
                          </div>

                          <span className="font-bold text-neutral-900 text-xs w-12 text-right">
                            ₹{itemTotalPrice}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Price breakdown */}
                  <div className="pt-3 pb-2 space-y-1.5 text-xs text-neutral-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium text-neutral-900">₹{cartTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes</span>
                      <span className="font-medium text-neutral-900">₹{taxes}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-100">
                      <span>Total</span>
                      <span>₹{finalTotal}</span>
                    </div>
                  </div>
                </div>

                {/* Footer button */}
                <div className="p-3.5 bg-white border-t border-neutral-100">
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full bg-[#ff5722] hover:bg-[#f04f1b] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-between shadow-md active:scale-[0.98] transition-all text-sm tracking-wide"
                  >
                    <span>Place Order</span>
                    <span>₹{finalTotal}</span>
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
