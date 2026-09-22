export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating?: number; // 1 to 5
  popular?: boolean;
  dietary?: ('veg' | 'non-veg' | 'vegan' | 'gluten-free')[];
  customizable?: boolean;
}

export interface CartItem {
  id: string; // unique ID for this cart entry (can be item id + options hash)
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  spiceLevel?: string;
  addons?: { name: string; price: number }[];
  instructions?: string;
}

export interface OrderState {
  items: CartItem[];
  tableNumber: string | null;
}

export interface OrderItemRecord {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderRecord {
  id: string;
  status: 'Order received' | 'Preparing' | 'Ready' | 'Served' | 'Completed';
  estimatedTime?: string;
  date: string;
  tableNumber: string;
  items: OrderItemRecord[];
  total: number;
  isActive: boolean;
}
