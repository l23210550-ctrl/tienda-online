// context/CartContext.js
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
const STORAGE_KEY = "carrito";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // 🔹 Cargar carrito desde localStorage (compatibilidad con "cart")
  useEffect(() => {
    const storedCarrito = localStorage.getItem(STORAGE_KEY);
    const storedCartLegacy = localStorage.getItem("cart"); // por si había datos viejos
    if (storedCarrito) {
      setCart(JSON.parse(storedCarrito));
    } else if (storedCartLegacy) {
      const legacy = JSON.parse(storedCartLegacy);
      setCart(legacy);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));
      localStorage.removeItem("cart");
    }
  }, []);

  // 💾 Guardar en localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // 🛒 Agregar al carrito
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.ID_Producto === product.ID_Producto);
      if (existing) {
        return prev.map((p) =>
          p.ID_Producto === product.ID_Producto
            ? { ...p, cantidad: (p.cantidad || 1) + 1 }
            : p
        );
      }
      return [...prev, { ...product, cantidad: 1 }];
    });
  };

  // ❌ Eliminar
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.ID_Producto !== id));
  };

  // 🔄 Cambiar cantidad
  const updateQuantity = (id, cantidad) => {
    setCart((prev) =>
      prev.map((p) =>
        p.ID_Producto === id ? { ...p, cantidad: Math.max(1, cantidad) } : p
      )
    );
  };

  // 🧹 Vaciar
  const clearCart = () => setCart([]);

  // 💰 Total
  const total = cart.reduce((sum, p) => sum + (p.Precio || 0) * (p.cantidad || 1), 0);

  return (
    <CartContext.Provider
      value={{ cart, total, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
