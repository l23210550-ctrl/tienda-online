import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import { useCart } from "../context/CartContext";

export default function Home() {
  const { addToCart } = useCart();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [hoverButton, setHoverButton] = useState(null); // 👈 control de hover

    const agregarAlCarrito = (producto) => {
    addToCart(producto);
    setToastMessage(`${producto.Nombre} agregado al carrito`);
    setToastVisible(true);
  };

  useEffect(() => {
    axios
      .get("/api/productos")
      .then((res) => {
        setProductos(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Error al cargar productos");
        setLoading(false);
      });
  }, []);

  const azul = "#1B396A";
  const gris = "#807E82";
  const naranja = "#FF8C00";

  return (
    <div style={styles.container}>
      {/* 🔹 Barra de navegación */}
      <Navbar />

      {/* 🔹 Sección Hero */}
      <section style={styles.hero}>
        <h2 style={styles.heroTitle}>Bienvenido a la tienda en línea ITT</h2>
        <p>Explora productos hechos por estudiantes y docentes</p>
      </section>

      {/* 🔹 Listado de productos */}
      <section style={styles.productsSection}>
        <h2>Catálogo de Productos</h2>

        {loading && <p>Cargando productos...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={styles.productsGrid}>
          {productos.length === 0 && !loading && (
            <p>No hay productos disponibles por el momento.</p>
          )}

          {productos.map((producto) => (
            <div key={producto.ID_Producto} style={styles.productCard}>
              <img
                src={producto.ImagenURL || "/placeholder.png"}
                alt={producto.Nombre}
                style={styles.productImage}
              />
              <h3>{producto.Nombre}</h3>
              <p>{producto.Descripcion}</p>

              {/* 👤 Nombre del vendedor */}
              <p
                style={{
                  color: gris,
                  fontSize: "0.9rem",
                  marginTop: "5px",
                }}
              >
                Publicado por: {producto.NombreVendedor || "Vendedor anónimo"}
              </p>

              <strong>${producto.Precio}</strong>

              <div style={{ marginTop: "10px" }}>
                <Link href={`/productos/${producto.ID_Producto}`}>
                  <button style={styles.detailsButton}>Ver Detalles</button>
                </Link>

                <button
                  style={{
                    ...styles.cartButton,
                    ...(hoverButton === producto.ID_Producto
                      ? styles.cartButtonHover
                      : {}),
                  }}
                  onMouseEnter={() => setHoverButton(producto.ID_Producto)}
                  onMouseLeave={() => setHoverButton(null)}
                  onClick={() => agregarAlCarrito(producto)}
                >
                  🛒 Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

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

const styles = {
  container: {
    fontFamily: "sans-serif",
  },
  hero: {
    textAlign: "center",
    padding: "40px 20px",
    background: "#f5f5f5",
  },
  heroTitle: {
    fontSize: "1.8rem",
    marginBottom: "10px",
  },
  productsSection: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  productsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  productCard: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "10px",
    textAlign: "center",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "transform 0.2s ease-in-out",
  },
  productImage: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  detailsButton: {
    background: "#FF8C00",
    color: "#fff",
    padding: "8px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "8px",
    fontWeight: "bold",
    marginRight: "6px",
    transition: "transform 0.2s ease, background 0.2s ease",
  },
  cartButton: {
    background: "#1B396A",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "8px",
    cursor: "pointer",
    marginTop: "10px",
    fontWeight: "bold",
    transition: "all 0.2s ease",
  },
  cartButtonHover: {
    background: "#16325c",
    transform: "scale(1.05)",
  },
  footer: {
    textAlign: "center",
    padding: "15px",
    background: "#f5f5f5",
    marginTop: "40px",
  },
};
