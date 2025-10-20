import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Toast from "../../components/Toast";
import { useCart } from "../../context/CartContext";
import Link from "next/link";

export default function DetalleProducto() {
  const router = useRouter();
  const { id } = router.query;
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { addToCart } = useCart();

  const azul = "#1B396A";
  const gris = "#807E82";
  const naranja = "#FF8C00";

  useEffect(() => {
    if (!id) return;
    axios
      .get(`/api/productos/${id}`)
      .then((res) => {
        setProducto(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudo cargar el producto.");
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (producto) {
      addToCart(producto);
      setToastMessage(`${producto.Nombre} agregado al carrito`);
      setToastVisible(true);
    }
  };

  if (loading)
    return <p style={{ textAlign: "center" }}>Cargando producto...</p>;
  if (error)
    return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  if (!producto)
    return <p style={{ textAlign: "center" }}>Producto no encontrado</p>;

  return (
    <div style={styles.container}>
      {/* 🔹 Barra de navegación superior */}
      <Navbar />

      <main style={styles.main}>
        <div style={styles.card}>
          <img
            src={producto.ImagenURL || "/placeholder.png"}
            alt={producto.Nombre}
            style={styles.image}
          />

          <div style={styles.info}>
            <h2 style={{ color: azul }}>{producto.Nombre}</h2>
            <p style={{ color: gris }}>{producto.Descripcion}</p>
            <p>
              <strong>Precio:</strong> ${producto.Precio}
            </p>
            <p>
              <strong>Publicado por:</strong>{" "}
              {producto.NombreVendedor || "Vendedor anónimo"}
            </p>

            <div style={styles.buttons}>
              <button
                style={styles.cartButton}
                onClick={handleAddToCart}
              >
                🛒 Agregar al carrito
              </button>
              <Link href="/">
                <button style={styles.backButton}>
                  ← Volver al inicio
                </button>
              </Link>
              <Link href="/carrito">
                <button style={styles.viewCartButton}>
                  Ver carrito
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Toast de confirmación */}
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      <footer style={styles.footer}>
        <p>© {new Date().getFullYear()} Tienda ITT - Proyecto Académico</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "sans-serif",
    background: "#f5f5f5",
    minHeight: "100vh",
  },
  main: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
  },
  card: {
    display: "flex",
    flexWrap: "wrap",
    gap: "30px",
    background: "#fff",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    maxWidth: "900px",
  },
  image: {
    width: "350px",
    height: "350px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "2px solid #ddd",
  },
  info: {
    flex: 1,
    minWidth: "300px",
  },
  buttons: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "15px",
  },
  cartButton: {
    background: "#1B396A",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "10px 15px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  backButton: {
    background: "#FF8C00",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "10px 15px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  viewCartButton: {
    background: "#807E82",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "10px 15px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  footer: {
    textAlign: "center",
    padding: "15px",
    background: "#f0f0f0",
    marginTop: "40px",
  },
};
