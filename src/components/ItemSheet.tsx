import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus } from 'lucide-react';
import { MenuItem } from '../types';
import { useStore } from '../StoreContext';

interface ItemSheetProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const SPICE_LEVELS = ['Mild', 'Medium', 'Spicy'];
const CAFE_ADDONS = [
  { name: 'Extra Cheese', price: 40 },
  { name: 'Peri Peri Dip', price: 30 },
  { name: 'Garlic Toast (2 pcs)', price: 59 },
  { name: 'Extra Mint Mayo', price: 25 },
];

export function ItemSheet({ item, isOpen, onClose }: ItemSheetProps) {
  const { addToCart } = useStore();
  const [quantity, setQuantity] = React.useState(1);
  const [spiceLevel, setSpiceLevel] = React.useState('Medium');
  const [pastaVariation, setPastaVariation] = React.useState<'Veg' | 'Chicken'>('Veg');
  const [selectedAddons, setSelectedAddons] = React.useState<string[]>([]);
  const [instructions, setInstructions] = React.useState('');

  React.useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSpiceLevel('Medium');
      setPastaVariation('Veg');
      setSelectedAddons([]);
      setInstructions('');
    }
  }, [isOpen, item]);

  if (!item) return null;

  const isPasta = item.category === 'Pasta';
  const variationExtra = isPasta && pastaVariation === 'Chicken' ? 70 : 0;

  const handleAddonToggle = (addonName: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonName)
        ? prev.filter((name) => name !== addonName)
        : [...prev, addonName]
    );
  };

  const currentAddons = CAFE_ADDONS.filter((a) => selectedAddons.includes(a.name));
  const addonsTotal = currentAddons.reduce((sum, a) => sum + a.price, 0);
  const effectiveBasePrice = item.price + variationExtra;
  const itemTotal = (effectiveBasePrice + addonsTotal) * quantity;

  const handleAddToCart = () => {
    const displayName = isPasta && pastaVariation === 'Chicken'
      ? `${item.name} (Chicken)`
      : item.name;

    addToCart({
      id: `${item.id}-${pastaVariation}-${Date.now()}`,
      menuItemId: item.id,
      name: displayName,
      price: effectiveBasePrice,
      quantity,
      spiceLevel: item.customizable ? spiceLevel : undefined,
      addons: currentAddons,
      instructions: instructions.trim() || undefined,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-xs"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-50 bg-white rounded-t-2xl overflow-hidden max-h-[88vh] flex flex-col shadow-2xl"
          >
            {/* Header with image */}
            <div className="relative h-44 bg-[#1a1a1d] flex items-center justify-center overflow-hidden">
              <div className="w-36 h-36 rounded-[22px] overflow-hidden shadow-2xl border border-[#333] flex items-center justify-center bg-neutral-900">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={onClose}
                className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full text-neutral-700 shadow-sm active:scale-90 transition-transform"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 pb-28">
              <div className="flex justify-between items-start mb-1">
                <h2 className="text-lg font-bold text-neutral-900 leading-tight">
                  {item.name}
                </h2>
                <span className="text-base font-bold text-neutral-900">
                  ₹{effectiveBasePrice}
                </span>
              </div>
              <p className="text-neutral-500 text-xs leading-relaxed mb-5">
                {item.description}
              </p>

              {isPasta && (
                <div className="mb-5">
                  <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2.5">
                    Choose Variation
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPastaVariation('Veg')}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                        pastaVariation === 'Veg'
                          ? 'bg-[#ff5722] text-white border-[#ff5722]'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                      }`}
                    >
                      Veg (Included)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPastaVariation('Chicken')}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                        pastaVariation === 'Chicken'
                          ? 'bg-[#ff5722] text-white border-[#ff5722]'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                      }`}
                    >
                      Chicken (+₹70)
                    </button>
                  </div>
                </div>
              )}

              {item.customizable && (
                <div className="mb-5">
                  <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2.5">
                    Spice Level
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {SPICE_LEVELS.map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setSpiceLevel(level)}
                        className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                          spiceLevel === level
                            ? 'bg-[#ff5722] text-white border-[#ff5722]'
                            : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2.5">
                  Add-ons
                </h3>
                <div className="flex flex-col gap-2">
                  {CAFE_ADDONS.map((addon) => {
                    const isSelected = selectedAddons.includes(addon.name);
                    return (
                      <label
                        key={addon.name}
                        onClick={() => handleAddonToggle(addon.name)}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-200 bg-neutral-50/50 cursor-pointer active:bg-neutral-100 transition-colors"
                      >
                        <span className="text-neutral-800 text-xs font-medium">
                          {addon.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-500 text-xs">
                            +₹{addon.price}
                          </span>
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center border ${
                              isSelected
                                ? 'bg-[#ff5722] border-[#ff5722] text-white'
                                : 'border-neutral-300 bg-white'
                            }`}
                          >
                            {isSelected && (
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2">
                  Special Instructions
                </h3>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Less spicy, dressing on side..."
                  className="w-full p-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#ff5722]"
                />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-3.5 bg-white border-t border-neutral-100 flex items-center gap-3">
              <div className="flex items-center justify-between bg-neutral-100 rounded-lg p-1 w-24">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded bg-white text-neutral-800 flex items-center justify-center shadow-xs active:scale-95"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold text-neutral-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded bg-white text-neutral-800 flex items-center justify-center shadow-xs active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#ff5722] hover:bg-[#f04f1b] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-between shadow-sm active:scale-[0.98] transition-all text-xs tracking-wide uppercase"
              >
                <span>Add To Order</span>
                <span>₹{itemTotal}</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
