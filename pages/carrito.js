import Link from "next/link";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import { useState } from "react";

export default function Carrito() {
  const { cart, total, removeFromCart, updateQuantity, clearCart } = useCart();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleClearCart = () => {
    clearCart();
    setToastMessage("🗑️ Carrito vaciado correctamente");
    setToastVisible(true);
  };

  const handleCheckout = () => {
    clearCart();
    setToastMessage("✅ Compra finalizada con éxito");
    setToastVisible(true);
  };

  return (
    <div style={styles.container}>
      {/* 🔹 Barra de navegación */}
      <Navbar />

      <div style={styles.content}>
        <h2 style={styles.title}>🛒 Carrito de Compras</h2>

        {cart.length === 0 ? (
          <p style={{ textAlign: "center", color: styles.gray }}>
            No hay productos en el carrito.
          </p>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item.ID_Producto} style={styles.item}>
                <img
                  src={item.ImagenURL || "/placeholder.png"}
                  alt={item.Nombre}
                  style={styles.image}
                />

                <div style={styles.info}>
                  <h3 style={styles.name}>{item.Nombre}</h3>
                  <p style={{ color: styles.gray }}>${item.Precio}</p>

                  {/* 🔹 Controles de cantidad */}
                  <div style={styles.controls}>
                    <button
                      style={styles.qtyBtn}
                      onClick={() =>
                        updateQuantity(item.ID_Producto, item.cantidad - 1)
                      }
                    >
                      -
                    </button>
                    <span>{item.cantidad}</span>
                    <button
                      style={styles.qtyBtn}
                      onClick={() =>
                        updateQuantity(item.ID_Producto, item.cantidad + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  {/* 🔹 Botón de eliminar */}
                  <button
                    style={styles.removeBtn}
                    onClick={() => removeFromCart(item.ID_Producto)}
                  >
                    ❌ Eliminar
                  </button>
                </div>
              </div>
            ))}

            {/* 🔹 Resumen del carrito */}
            <div style={styles.summary}>
              <h3 style={styles.total}>Total: ${total.toFixed(2)}</h3>

              <div>
                <button style={styles.checkoutBtn} onClick={handleCheckout}>
                  💳 Finalizar Compra
                </button>
                <button style={styles.clearBtn} onClick={handleClearCart}>
                  🗑️ Vaciar Carrito
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 🔹 Toast */}
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      {/* 🔹 Footer */}
      <footer style={styles.footer}>
        <p>© {new Date().getFullYear()} Tienda ITT - Proyecto Académico</p>
      </footer>
    </div>
  );
}

// 🎨 Colores institucionales TecNM
const azul = "#1B396A";
const gris = "#807E82";
const negro = "#000";
const naranja = "#FF8C00";

const styles = {
  container: {
    fontFamily: "sans-serif",
    minHeight: "100vh",
    background: "#f5f5f5",
  },
  content: {
    maxWidth: "900px",
    margin: "30px auto",
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  title: {
    color: azul,
    marginBottom: "20px",
    textAlign: "center",
  },
  item: {
    display: "flex",
    gap: "20px",
    borderBottom: `1px solid ${gris}`,
    paddingBottom: "10px",
    marginBottom: "15px",
    alignItems: "center",
  },
  image: {
    width: "120px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "8px",
    border: `2px solid ${azul}`,
  },
  info: {
    flex: 1,
  },
  name: {
    color: azul,
    margin: "5px 0",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "8px",
  },
  qtyBtn: {
    background: naranja,
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "5px 10px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.2s ease",
  },
  removeBtn: {
    marginTop: "8px",
    background: "transparent",
    color: "red",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
  summary: {
    textAlign: "right",
    marginTop: "20px",
    borderTop: `2px solid ${azul}`,
    paddingTop: "15px",
  },
  total: {
    fontSize: "1.3rem",
    color: azul,
    marginBottom: "10px",
  },
  checkoutBtn: {
    background: naranja,
    color: "#fff",
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    marginRight: "10px",
    transition: "transform 0.2s ease, background 0.2s ease",
  },
  clearBtn: {
    background: gris,
    color: "#fff",
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "transform 0.2s ease, background 0.2s ease",
  },
  footer: {
    textAlign: "center",
    padding: "15px",
    background: "#f0f0f0",
    marginTop: "40px",
  },
  gray: gris,
};
