"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";

/* ========================================
   Menu Item Type Definition
   ======================================== */
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  story?: string;
  portion?: string;
  taste?: string;
}

/* ========================================
   Cart Item = MenuItem + quantity
   ======================================== */
export interface CartItem extends MenuItem {
  quantity: number;
}

/* ========================================
   Cart State & Actions
   ======================================== */
interface CartState {
  items: CartItem[];
  bookingFee: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: MenuItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" };

const BOOKING_FEE = 50000; // Rp 50.000

/* ========================================
   Reducer
   ======================================== */
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
      };
    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.id !== action.payload.id),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    }
    case "CLEAR_CART":
      return { ...state, items: [] };
    default:
      return state;
  }
}

/* ========================================
   Context
   ======================================== */
interface CartContextType {
  items: CartItem[];
  bookingFee: number;
  subtotal: number;
  total: number;
  totalItems: number;
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    bookingFee: BOOKING_FEE,
  });

  const subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + state.bookingFee;
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = (item: MenuItem) =>
    dispatch({ type: "ADD_ITEM", payload: item });
  const removeItem = (id: string) =>
    dispatch({ type: "REMOVE_ITEM", payload: id });
  const updateQuantity = (id: string, quantity: number) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        bookingFee: state.bookingFee,
        subtotal,
        total,
        totalItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
