import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Plus,
  Minus,
  Coffee,
  Store,
  User,
  X,
  ShoppingBag,
} from 'lucide-react';
import { MOCK_MENU, CATEGORIES } from '../mockData';
import { useStore } from '../StoreContext';
import { MenuItem } from '../types';
import { ItemSheet } from './ItemSheet';
import { CartSheet } from './CartSheet';
import { OrdersView } from './OrdersView';

function RupeeReceiptIcon({
  className = 'w-5 h-5',
  strokeWidth = 1.8,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 2v19l2.5-1.5 2.5 1.5 2.5-1.5 2.5 1.5 2.5-1.5 2.5 1.5 2.5-1.5 2.5 1.5V2l-2.5 1.5L16.5 2 14 3.5 11.5 2 9 3.5 6.5 2 4 3.5Z" />
      <text
        x="12"
        y="14.5"
        textAnchor="middle"
        fontSize="9.5"
        fontWeight="800"
        fill="currentColor"
        stroke="none"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      >
        ₹
      </text>
    </svg>
  );
}

export function MenuPage() {
  const { tableId } = useParams();
  const [searchParams] = useSearchParams();
  const {
    setTableNumber,
    tableNumber,
    cartCount,
    cartTotal,
    getItemQuantity,
    decrementMenuItem,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'home' | 'categories' | 'beverages' | 'orders' | 'profile'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const mainRef = React.useRef<HTMLElement>(null);
  const categoryBarRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (searchParams.get('tab') === 'orders') {
      setActiveTab('orders');
    }
  }, [searchParams]);

  const openCustomization = (item: MenuItem) => {
    setSelectedItem(item);
  };

  const handleGoToMenu = () => {
    setActiveTab('home');
    handleSelectCategory('All');
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
    if (category === 'Beverages') {
      setActiveTab('beverages');
    } else if (category === 'All') {
      setActiveTab('home');
    } else {
      setActiveTab('categories');
    }

    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setTimeout(() => {
      const pill = categoryBarRef.current?.querySelector<HTMLElement>(`[data-category="${category}"]`);
      pill?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }, 10);
  };

  React.useEffect(() => {
    if (tableId) {
      const formatted = tableId
        .replace('-', ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      setTableNumber(formatted);
    }
  }, [tableId, setTableNumber]);

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return MOCK_MENU.filter((item) => {
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#f2f3f5] flex justify-center text-neutral-900 font-sans selection:bg-[#ff5722]/20">
      {/* Mobile container - fixed narrow width matching 375-430px smartphone */}
      <div className="w-full max-w-[430px] min-h-screen bg-[#f2f3f5] flex flex-col relative shadow-xl">
        
        {/* View Switch: Orders or Menu */}
        {activeTab === 'orders' ? (
          <OrdersView onBackToMenu={() => setActiveTab('home')} />
        ) : (
          <>
            {/* Compact Top Header with Search Field and Category Bar */}
            <header className="sticky top-0 z-20 bg-[#f2f3f5]/95 backdrop-blur-md px-3 pt-3 pb-2 border-b border-neutral-200/50">
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-neutral-400 flex items-center">
                  <Search className="w-4 h-4 text-neutral-400" strokeWidth={2} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find nearby food"
                  className="w-full h-9 pl-9 pr-8 bg-[#e8e9ec] hover:bg-[#e4e5e8] focus:bg-white text-neutral-800 placeholder-neutral-400 text-[13px] rounded-lg border-none focus:outline-none focus:ring-1 focus:ring-neutral-400/50 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 p-1 text-neutral-400 hover:text-neutral-600 rounded-full"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category quick navigation pills */}
              <div ref={categoryBarRef} className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 pb-0.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    data-category={cat}
                    onClick={() => handleSelectCategory(cat)}
                    className={`px-3 py-1 rounded-full text-[11.5px] font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#ff5722] text-white shadow-xs'
                        : 'bg-white/80 text-neutral-600 hover:text-neutral-900 border border-neutral-200/70'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </header>

            {/* Food List - High density vertical list */}
            <main ref={mainRef} className="flex-1 px-3 pt-2.5 pb-24 overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center pt-16 text-center text-neutral-400">
                  <Search className="w-10 h-10 mb-2 text-neutral-300 stroke-1" />
                  <p className="text-sm font-medium text-neutral-600">No dishes found</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Try searching for something else
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="mt-4 px-3.5 py-1.5 bg-white border border-neutral-300 rounded-md text-xs font-semibold text-neutral-700"
                  >
                    Reset search
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {filteredItems.map((item) => {
                    const quantity = getItemQuantity(item.id);

                    return (
                      <div
                        key={item.id}
                        onClick={() => openCustomization(item)}
                        className="bg-white rounded-2xl p-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-neutral-100 flex items-center cursor-pointer active:bg-neutral-50/50 transition-colors gap-3.5"
                      >
                        {/* Left: Rounded-square Food Image Container (84-88px, radius 18px) */}
                        <div className="relative w-[84px] h-[84px] sm:w-[88px] sm:h-[88px] rounded-[18px] overflow-hidden shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-neutral-200/60 bg-neutral-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover select-none pointer-events-none"
                            loading="lazy"
                          />
                        </div>

                        {/* Middle: Food Information */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
                          <h3 className="font-bold text-[14px] leading-snug text-neutral-900 truncate">
                            {item.name}
                          </h3>
                          <p className="text-neutral-400 text-[11px] leading-tight line-clamp-1 mt-0.5">
                            {item.description}
                          </p>

                          {/* Prominent Price */}
                          <div className="text-neutral-900 font-bold text-[14.5px] mt-1 tracking-tight flex items-baseline gap-1">
                            <span>₹</span>
                            <span>{item.price}</span>
                          </div>

                          {/* Small Rating/Review Indicators (5 coral squares matching reference) */}
                          <div
                            className="flex items-center gap-1 mt-1.5"
                            aria-label={`${item.rating || 5} out of 5 stars`}
                          >
                            {[1, 2, 3, 4, 5].map((star) => {
                              const isFilled = star <= (item.rating || 5);
                              return (
                                <div
                                  key={star}
                                  className={`w-2.5 h-2.5 rounded-[2px] transition-colors ${
                                    isFilled
                                      ? 'bg-[#ff5722]'
                                      : 'border border-[#ff5722] bg-white'
                                  }`}
                                />
                              );
                            })}
                          </div>
                        </div>

                        {/* Right: Compact Quantity Controls */}
                        <div
                          className="shrink-0 self-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {quantity === 0 ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openCustomization(item);
                              }}
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-[6px] bg-[#1e1e20] text-white flex items-center justify-center hover:bg-black active:scale-90 transition-transform shadow-xs"
                              aria-label={`Customize and add ${item.name}`}
                            >
                              <Plus className="w-4 h-4 text-white" strokeWidth={2.5} />
                            </button>
                          ) : (
                            <div className="flex items-center gap-1.5 bg-[#f4f4f5] px-1.5 py-1 rounded-[6px] border border-neutral-200/50">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  decrementMenuItem(item.id);
                                }}
                                className="w-5 h-5 rounded-[4px] bg-[#1e1e20] text-white flex items-center justify-center hover:bg-black active:scale-90 transition-transform shadow-xs"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3 text-white" strokeWidth={2.5} />
                              </button>
                              <span className="text-[12px] font-bold text-neutral-900 min-w-4 text-center select-none">
                                {quantity}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openCustomization(item);
                                }}
                                className="w-5 h-5 rounded-[4px] bg-[#1e1e20] text-white flex items-center justify-center hover:bg-black active:scale-90 transition-transform shadow-xs"
                                aria-label={`Customize and add another ${item.name}`}
                              >
                                <Plus className="w-3 h-3 text-white" strokeWidth={2.5} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </main>
          </>
        )}

        {/* Floating Cart Indicator (When cart has items and not in orders view) */}
        <AnimatePresence>
          {cartCount > 0 && !isCartOpen && activeTab !== 'orders' && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-[64px] left-0 right-0 max-w-[430px] mx-auto px-3.5 pointer-events-none z-30"
            >
              <button
                onClick={() => setIsCartOpen(true)}
                className="w-full bg-[#1e1e20] text-white py-2.5 px-4 rounded-xl shadow-[0_8px_25px_rgba(0,0,0,0.25)] flex items-center justify-between pointer-events-auto active:scale-[0.98] transition-all hover:bg-black"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🛒</span>
                  <span className="text-xs font-bold text-white tracking-wide">
                    {cartCount} {cartCount === 1 ? 'item' : 'items'}
                  </span>
                  <span className="text-neutral-500 text-xs">·</span>
                  <span className="text-xs font-bold text-white">
                    ₹{cartTotal}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#ff5722] bg-white/10 px-2.5 py-1 rounded-md">
                  <span>View Order</span>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fixed Bottom Navigation Bar (5 Items closely resembling screenshot) */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-neutral-200/70 z-30 h-14 px-4 flex items-center justify-between shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
          {/* 1. Home / Menu (Burger icon) */}
          <button
            onClick={handleGoToMenu}
            className="flex items-center justify-center p-1"
            aria-label="Menu"
          >
            {activeTab !== 'orders' && selectedCategory !== 'Beverages' ? (
              <div className="bg-[#ff5722] text-white px-4 py-1.5 rounded-full flex items-center justify-center shadow-xs">
                {/* Burger icon with buns & patty */}
                <svg
                  className="w-5 h-4 text-white"
                  viewBox="0 0 24 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.4}
                  strokeLinecap="round"
                >
                  <path d="M2 3.5h20" />
                  <path d="M4 9h16" />
                  <path d="M2 14.5h20" />
                </svg>
              </div>
            ) : (
              <svg
                className="w-5 h-5 text-neutral-400 hover:text-neutral-700"
                viewBox="0 0 24 18"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              >
                <path d="M2 3.5h20" />
                <path d="M4 9h16" />
                <path d="M2 14.5h20" />
              </svg>
            )}
          </button>

          {/* 2. Beverages (Coffee Cup icon) */}
          <button
            onClick={() => handleSelectCategory('Beverages')}
            className="flex items-center justify-center p-1.5 text-neutral-400 hover:text-neutral-700 transition-colors"
            aria-label="Beverages"
          >
            {selectedCategory === 'Beverages' && activeTab !== 'orders' ? (
              <div className="bg-[#ff5722] text-white px-4 py-1.5 rounded-full flex items-center justify-center shadow-xs">
                <Coffee className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
            ) : (
              <Coffee className="w-5 h-5" strokeWidth={1.8} />
            )}
          </button>

          {/* 3. Orders / Store */}
          <button
            onClick={() => {
              setIsCartOpen(true);
            }}
            className="flex items-center justify-center p-1.5 text-neutral-400 hover:text-neutral-700 transition-colors relative"
            aria-label="Cart"
          >
            <Store className="w-5 h-5" strokeWidth={1.8} />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#ff5722]" />
            )}
          </button>

          {/* 4. Orders Tracker (Rupee Receipt Icon) */}
          <button
            onClick={() => {
              setActiveTab('orders');
            }}
            className="flex items-center justify-center p-1.5 text-neutral-400 hover:text-neutral-700 transition-colors"
            aria-label="Orders"
          >
            {activeTab === 'orders' ? (
              <div className="bg-[#ff5722] text-white px-4 py-1.5 rounded-full flex items-center justify-center shadow-xs">
                <RupeeReceiptIcon className="w-4 h-4 text-white" strokeWidth={2.4} />
              </div>
            ) : (
              <RupeeReceiptIcon className="w-5 h-5" strokeWidth={1.8} />
            )}
          </button>

          {/* 5. Profile */}
          <button
            onClick={() => {
              setActiveTab('profile');
              setIsProfileOpen(true);
            }}
            className="flex items-center justify-center p-1.5 text-neutral-400 hover:text-neutral-700 transition-colors"
            aria-label="Profile"
          >
            {activeTab === 'profile' ? (
              <div className="bg-[#ff5722] text-white px-4 py-1.5 rounded-full flex items-center justify-center shadow-xs">
                <User className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
            ) : (
              <User className="w-5 h-5" strokeWidth={1.8} />
            )}
          </button>
        </nav>

        {/* Profile / Table Info Modal */}
        <AnimatePresence>
          {isProfileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 z-50 backdrop-blur-xs"
                onClick={() => setIsProfileOpen(false)}
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-50 bg-white rounded-t-2xl p-5 shadow-2xl"
              >
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-[#ff5722]" />
                    <h3 className="font-bold text-neutral-900 text-sm">Table Details</h3>
                  </div>
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="p-1 rounded-full text-neutral-400 hover:text-neutral-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="py-4 space-y-3">
                  <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                    <div>
                      <p className="text-xs text-neutral-400 uppercase font-bold tracking-wider">Active Table</p>
                      <p className="text-base font-bold text-neutral-900">{tableNumber}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Connected
                    </span>
                  </div>
                  <div className="text-xs text-neutral-500 leading-relaxed px-1">
                    Scan any table QR code to switch tables. Need a server or customized bill? Tap below to call staff.
                  </div>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                    }}
                    className="w-full py-2.5 bg-neutral-900 text-white text-xs font-bold rounded-xl active:scale-95 transition-all"
                  >
                    Call Server to {tableNumber}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Item customization modal */}
        <ItemSheet
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />

        {/* Compact Order Summary / Cart */}
        <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
