// context/CartContext.js
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.ID_Producto === product.ID_Producto);
      if (existing) {
        return prev.map((p) =>
          p.ID_Producto === product.ID_Producto
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        );
      }
      return [...prev, { ...product, cantidad: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.ID_Producto !== id));
  };

  const updateQuantity = (id, cantidad) => {
    setCart((prev) =>
      prev.map((p) =>
        p.ID_Producto === id ? { ...p, cantidad: Math.max(1, cantidad) } : p
      )
    );
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, p) => sum + p.Precio * p.cantidad, 0);

  return (
    <CartContext.Provider
      value={{ cart, total, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
