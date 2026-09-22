import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, MenuItem, OrderRecord } from './types';

interface StoreContextType {
  cart: CartItem[];
  orders: OrderRecord[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  placeOrder: () => OrderRecord | null;
  cartTotal: number;
  cartCount: number;
  tableNumber: string;
  setTableNumber: (table: string) => void;
  getItemQuantity: (menuItemId: string) => number;
  incrementMenuItem: (item: MenuItem) => void;
  decrementMenuItem: (menuItemId: string) => void;
}

const INITIAL_MOCK_ORDERS: OrderRecord[] = [
  {
    id: '1042',
    status: 'Preparing',
    estimatedTime: '20–25 min',
    date: 'Today, 2:15 PM',
    tableNumber: 'Table 12',
    items: [
      { name: 'Chicken Tandoori Sandwich', quantity: 1, price: 249 },
      { name: 'Peri Peri Fries', quantity: 1, price: 159 },
      { name: 'Cold Coffee', quantity: 1, price: 159 },
    ],
    total: 567,
    isActive: true,
  },
  {
    id: '1038',
    status: 'Completed',
    date: 'Yesterday',
    tableNumber: 'Table 12',
    items: [
      { name: 'Chicken Tikka Sandwich', quantity: 1, price: 259 },
      { name: 'Cheesy Fries', quantity: 1, price: 189 },
      { name: 'Cold Coffee', quantity: 1, price: 159 },
    ],
    total: 689,
    isActive: false,
  },
  {
    id: '1031',
    status: 'Completed',
    date: '18 Sep',
    tableNumber: 'Table 12',
    items: [
      { name: 'Paneer Tikka Sandwich', quantity: 1, price: 229 },
      { name: 'Mango Shake', quantity: 1, price: 179 },
    ],
    total: 459,
    isActive: false,
  },
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_MOCK_ORDERS);
  const [tableNumber, setTableNumber] = useState<string>('Table 12');

  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.menuItemId === newItem.menuItemId &&
          item.spiceLevel === newItem.spiceLevel &&
          JSON.stringify(item.addons) === JSON.stringify(newItem.addons)
      );

      if (existingIndex > -1) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...prev, newItem];
    });
  };

  const incrementMenuItem = (menuItem: MenuItem) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.menuItemId === menuItem.id);
      if (existingIndex > -1) {
        return prev.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: `${menuItem.id}-${Date.now()}`,
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
        },
      ];
    });
  };

  const decrementMenuItem = (menuItemId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.menuItemId === menuItemId);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter((item) => item.menuItemId !== menuItemId);
      }
      return prev.map((item) =>
        item.menuItemId === menuItemId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const getItemQuantity = (menuItemId: string): number => {
    return cart
      .filter((item) => item.menuItemId === menuItemId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = (): OrderRecord | null => {
    if (cart.length === 0) return null;
    const taxes = Math.round(cartTotal * 0.05);
    const finalTotal = cartTotal + taxes;
    const newOrderNumber = Math.floor(1043 + Math.random() * 50).toString();
    const newOrder: OrderRecord = {
      id: newOrderNumber,
      status: 'Preparing',
      estimatedTime: '20–25 min',
      date: 'Just now',
      tableNumber,
      items: cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price:
          (item.price + (item.addons?.reduce((s, a) => s + a.price, 0) || 0)) *
          item.quantity,
      })),
      total: finalTotal,
      isActive: true,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const cartTotal = cart.reduce((total, item) => {
    let itemTotal = item.price;
    if (item.addons) {
      itemTotal += item.addons.reduce((sum, addon) => sum + addon.price, 0);
    }
    return total + itemTotal * item.quantity;
  }, 0);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        cart,
        orders,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        placeOrder,
        cartTotal,
        cartCount,
        tableNumber,
        setTableNumber,
        getItemQuantity,
        incrementMenuItem,
        decrementMenuItem,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
