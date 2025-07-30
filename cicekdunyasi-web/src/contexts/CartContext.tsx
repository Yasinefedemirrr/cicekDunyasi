import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Flower } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (flower: Flower, quantity: number) => void;
  removeFromCart: (flowerId: number) => void;
  updateQuantity: (flowerId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (flower: Flower, quantity: number) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.flower.id === flower.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.flower.id === flower.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { flower, quantity }];
      }
    });
  };

  const removeFromCart = (flowerId: number) => {
    setItems(prevItems => prevItems.filter(item => item.flower.id !== flowerId));
  };

  const updateQuantity = (flowerId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(flowerId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.flower.id === flowerId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.flower.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 