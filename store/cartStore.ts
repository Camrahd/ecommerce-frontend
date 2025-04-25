import { create } from "zustand";

interface CartItem {
  cartId: number;
  productId: number;
  name: string;
  cost: number;
  quantity: number;
  categoryId: number;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartId: number) => void;
  updateQuantity: (cartId: number, quantity: number) => void;
  clearCart: () => void;
  setCartItems: (items: CartItem[]) => void;
}

export const useCartStore = create<CartState>((set) => ({
  cartItems: [],
  addToCart: (item) =>
    set((state) => {
      const existingItem = state.cartItems.find((i) => i.productId === item.productId);
      if (existingItem) {
        return {
          cartItems: state.cartItems.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { cartItems: [...state.cartItems, item] };
    }),
  removeFromCart: (cartId) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.cartId !== cartId),
    })),
  updateQuantity: (cartId, quantity) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.cartId === cartId ? { ...item, quantity } : item
      ),
    })),
  clearCart: () => set({ cartItems: [] }),
  setCartItems: (items) => set({ cartItems: items }),
}));