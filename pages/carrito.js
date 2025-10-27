import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";

export default function Carrito() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [productos, setProductos] = useState([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // 🧩 Verificar que los productos sigan existiendo
  useEffect(() => {
    const verificarProductos = async () => {
      try {
        const res = await axios.get("/api/productos");
        const productosActuales = res.data.map((p) => p.ID_Producto);
        const carritoGuardado = JSON.parse(localStorage.getItem("carrito") || "[]");

        // Filtramos los productos que todavía existen
        const carritoFiltrado = carritoGuardado.filter((p) =>
          productosActuales.includes(p.ID_Producto)
        );

        if (carritoFiltrado.length !== carritoGuardado.length) {
          clearCart();
          carritoFiltrado.forEach((p) => {
            localStorage.setItem("carrito", JSON.stringify(carritoFiltrado));
          });
          setToastMessage("⚠️ Se eliminaron productos que ya no están disponibles.");
          setToastVisible(true);
        }

        setProductos(carritoFiltrado);
      } catch (err) {
        console.error("Error al verificar productos:", err);
      }
    };

    verificarProductos();
  }, [cart]);

  // 🗑️ Eliminar un producto del carrito
  const eliminarProducto = (id) => {
    removeFromCart(id);
    setToastMessage("🗑️ Producto eliminado del carrito");
    setToastVisible(true);
  };

  // 💰 Calcular total
  const total = productos.reduce((acc, p) => acc + (p.Precio || 0), 0);

  return (
    <div style={styles.container}>
      <Navbar />
      <h1 style={styles.title}>🛒 Tu Carrito</h1>

      {productos.length === 0 ? (
        <p style={styles.emptyMsg}>Tu carrito está vacío.</p>
      ) : (
        <div style={styles.grid}>
          {productos.map((producto) => (
            <div key={producto.ID_Producto} style={styles.card}>
              <img
                src={producto.ImagenURL || "/placeholder.png"}
                alt={producto.Nombre}
                style={styles.image}
              />
              <div style={styles.info}>
                <h3 style={styles.name}>{producto.Nombre}</h3>
                <p style={styles.desc}>{producto.Descripcion}</p>
                <p style={styles.price}>${producto.Precio}</p>
                <button
                  style={styles.removeBtn}
                  onClick={() => eliminarProducto(producto.ID_Producto)}
                >
                  ❌ Quitar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {productos.length > 0 && (
        <div style={styles.summary}>
          <h2>Total: ${total.toFixed(2)}</h2>
          <button style={styles.checkoutBtn} onClick={() => alert("🧾 Función de pago próximamente...")}>
            Proceder al pago
          </button>
          <button style={styles.clearBtn} onClick={() => clearCart()}>
            Vaciar carrito
          </button>
        </div>
      )}

      <Toast
        message={toastMessage}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
}

/* 🎨 Estilos ONYX */
const styles = {
  container: {
    background: "var(--color1)",
    color: "#fff",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "Poppins, sans-serif",
  },
  title: {
    textAlign: "center",
    color: "var(--color5)",
    fontSize: "1.8rem",
    marginBottom: "20px",
  },
  emptyMsg: {
    textAlign: "center",
    color: "#fff",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    padding: "20px",
  },
  card: {
    background: "#fff",
    color: "#000",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    padding: "15px",
    boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
  },
  image: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "8px",
    marginRight: "15px",
  },
  info: {
    flex: 1,
  },
  name: {
    color: "var(--color4)",
    marginBottom: "4px",
  },
  desc: {
    color: "#555",
    fontSize: "0.9rem",
  },
  price: {
    color: "var(--color3)",
    fontWeight: "bold",
  },
  removeBtn: {
    background: "var(--color5)",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "6px 10px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "8px",
  },
  summary: {
    background: "#fff",
    color: "#000",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "center",
    maxWidth: "400px",
    margin: "30px auto",
    boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
  },
  checkoutBtn: {
    background: "var(--color4)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: "bold",
    marginRight: "10px",
  },
  clearBtn: {
    background: "var(--color3)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
