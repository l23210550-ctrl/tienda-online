// pages/index.js
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import { useCart } from "../context/CartContext"; // ← NUEVO

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [categoria, setCategoria] = useState("");
  const [minPrecio, setMinPrecio] = useState("");
  const [maxPrecio, setMaxPrecio] = useState("");
  const [ratings, setRatings] = useState({});

  const { addToCart } = useCart(); // ← NUEVO

  // 🛍️ Filtrar productos
  const aplicarFiltros = () => {
    setLoading(true);
    let query = "/api/productos?";
    if (categoria) query += `categoria=${categoria}&`;
    if (minPrecio) query += `minPrecio=${minPrecio}&`;
    if (maxPrecio) query += `maxPrecio=${maxPrecio}`;

    axios
      .get(query)
      .then((res) => {
        setProductos(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al aplicar filtros");
        setLoading(false);
      });
  };

  // 🛒 Agregar con contexto (no localStorage directo)
  const agregarAlCarrito = (producto) => {
    addToCart(producto); // ← CLAVE
    setToastMessage(`${producto.Nombre} agregado al carrito`);
    setToastVisible(true);
  };

  // Cargar productos
  useEffect(() => {
    axios
      .get("/api/productos")
      .then((res) => {
        setProductos(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar productos");
        setLoading(false);
      });
  }, []);

  // Ratings
  useEffect(() => {
    if (productos.length > 0) {
      productos.forEach((p) => {
        axios
          .get(`/api/comentarios/${p.ID_Producto}`)
          .then((res) => {
            setRatings((prev) => ({
              ...prev,
              [p.ID_Producto]: res.data.avg || 0,
            }));
          })
          .catch(() => {});
      });
    }
  }, [productos]);

  const renderStars = (rating = 0) => {
    const filled = Math.round(rating);
    return (
      <div style={{ color: "var(--color4)", fontSize: "1.2rem" }}>
        {"★".repeat(filled)}
        {"☆".repeat(5 - filled)}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <section style={styles.hero}>
        <h2 style={styles.heroTitle}>Bienvenido a ONYX</h2>
        <p>El estilo de tus compras</p>
      </section>

      <section style={styles.productsSection}>
        <h2 style={styles.sectionTitle}>Catálogo de Productos</h2>

        {loading && <p>Cargando productos...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Filtros */}
        <div style={styles.filtrosContainer}>
          <select
            style={styles.select}
            onChange={(e) => setCategoria(e.target.value)}
            value={categoria}
          >
            <option value="">Todas las categorías</option>
            <option value="Ropa">Ropa</option>
            <option value="Accesorios">Accesorios</option>
            <option value="Tecnología">Tecnología</option>
            <option value="Comida">Comida</option>
          </select>

          <input
            type="number"
            placeholder="Precio mínimo"
            style={styles.input}
            value={minPrecio}
            onChange={(e) => setMinPrecio(e.target.value)}
          />

          <input
            type="number"
            placeholder="Precio máximo"
            style={styles.input}
            value={maxPrecio}
            onChange={(e) => setMaxPrecio(e.target.value)}
          />

          <button onClick={aplicarFiltros} style={styles.filtroBtn}>
            Filtrar
          </button>
        </div>

        {/* Productos */}
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
              <h3 style={styles.productTitle}>{producto.Nombre}</h3>
              <p style={styles.productDesc}>{producto.Descripcion}</p>
              <p style={styles.vendedor}>
                Publicado por: {producto.NombreVendedor || "Anónimo"}
              </p>

              <div style={styles.ratingContainer}>
                {renderStars(ratings[producto.ID_Producto] || 0)}
                <small style={{ color: "gray" }}>
                  ({(ratings[producto.ID_Producto] || 0).toFixed(1)} / 5)
                </small>
                <br />
                <Link
                  href={`/productos/comentarios?id=${producto.ID_Producto}`}
                  style={styles.commentLink}
                >
                  💬 Ver comentarios
                </Link>
              </div>

              <strong style={styles.precio}>${producto.Precio}</strong>

              <div>
                <Link href={`/productos/${producto.ID_Producto}`}>
                  <button style={styles.detailsButton}>Ver Detalles</button>
                </Link>
                <button
                  style={styles.cartButton}
                  onClick={() => agregarAlCarrito(producto)}
                >
                  🛒 Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Toast
        message={toastMessage}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      <footer style={styles.footer}>
        <p>© {new Date().getFullYear()} ONYX - Proyecto Académico</p>
      </footer>
    </div>
  );
}

/* 🎨 Estilos (tus estilos ONYX ya existentes) */
const styles = {
  container: {
    fontFamily: "Poppins, sans-serif",
    backgroundColor: "var(--color1)",
    color: "var(--texto)",
  },
  hero: {
    textAlign: "center",
    padding: "60px 20px",
    background: "linear-gradient(135deg, var(--color5), var(--color3))",
    color: "white",
  },
  heroTitle: {
    fontSize: "2rem",
    marginBottom: "10px",
  },
  sectionTitle: { color: "var(--color5)", textAlign: "center" },
  productsSection: { padding: "20px", maxWidth: "1200px", margin: "0 auto" },
  filtrosContainer: {
    display: "flex", justifyContent: "center", alignItems: "center",
    gap: "10px", marginBottom: "20px", flexWrap: "wrap",
  },
  select: { padding: "8px", borderRadius: "6px", border: "1px solid var(--color4)" },
  input: { padding: "8px", borderRadius: "6px", border: "1px solid var(--color4)", width: "130px" },
  filtroBtn: {
    background: "var(--color5)", color: "#fff", border: "none",
    borderRadius: "6px", padding: "8px 12px", fontWeight: "bold", cursor: "pointer",
  },
  productsGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px", marginTop: "20px",
  },
  productCard: {
    background: "#fff", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    padding: "15px", textAlign: "center", transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  productImage: {
    width: "100%", height: "180px", objectFit: "cover", borderRadius: "8px", marginBottom: "10px",
  },
  productTitle: { color: "var(--color4)", fontWeight: "bold" },
  productDesc: { fontSize: "0.9rem", color: "#555" },
  vendedor: { color: "gray", fontSize: "0.8rem" },
  ratingContainer: { margin: "8px 0" },
  commentLink: { color: "var(--color4)", fontWeight: "bold", textDecoration: "none", cursor: "pointer" },
  precio: { color: "var(--color3)", fontSize: "1.2rem", fontWeight: "bold" },
  detailsButton: {
    background: "var(--color4)", color: "#fff", border: "none", borderRadius: "5px",
    padding: "8px 12px", marginRight: "8px", cursor: "pointer", fontWeight: "bold",
  },
  cartButton: {
    background: "var(--color5)", color: "#fff", border: "none", borderRadius: "5px",
    padding: "8px 12px", cursor: "pointer", fontWeight: "bold",
  },
  footer: {
    textAlign: "center", padding: "15px", background: "var(--color5)", color: "#fff", marginTop: "40px",
  },
};
