import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Toast from "../../components/Toast";
import { useCart } from "../../context/CartContext";

export default function DetalleProducto() {
  const router = useRouter();
  const { id } = router.query;
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    axios
      .get(`/api/productos/${id}`)
      .then((res) => {
        setProducto(res.data);
        setLoading(false);
      })
      .catch(() => {
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

  const renderStars = (rating = 0) => {
    const filledStars = Math.round(rating);
    return (
      <div style={{ color: "var(--color4)", fontSize: "1.3rem" }}>
        {"★".repeat(filledStars)}
        {"☆".repeat(5 - filledStars)}
      </div>
    );
  };

  if (loading)
    return <p style={{ textAlign: "center" }}>Cargando producto...</p>;
  if (error)
    return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  if (!producto)
    return <p style={{ textAlign: "center" }}>Producto no encontrado</p>;

  return (
    <div style={styles.container}>
      <Navbar />

      <div style={styles.productContainer}>
        <img
          src={producto.ImagenURL || "/placeholder.png"}
          alt={producto.Nombre}
          style={styles.image}
        />

        <div style={styles.details}>
          <h2 style={styles.title}>{producto.Nombre}</h2>
          <p style={styles.desc}>{producto.Descripcion}</p>
          <p style={styles.price}>${producto.Precio}</p>
          <p style={styles.vendedor}>
            Publicado por: {producto.NombreVendedor || "Vendedor anónimo"}
          </p>

          {/* ⭐ Rating promedio */}
          <div style={styles.ratingBox}>
            {renderStars(producto.PromedioRating || 0)}
            <small style={{ color: "gray" }}>
              ({producto.PromedioRating?.toFixed(1) || "0.0"} / 5)
            </small>
            <br />
            <a
              href={`/productos/comentarios?id=${producto.ID_Producto}`}
              style={styles.commentLink}
            >
              💬 Ver comentarios
            </a>
          </div>

          <div style={styles.buttons}>
            <button style={styles.cartButton} onClick={handleAddToCart}>
              🛒 Agregar al carrito
            </button>
            <button style={styles.backButton} onClick={() => router.push("/")}>
              ← Volver al catálogo
            </button>
          </div>
        </div>
      </div>

      <Toast
        message={toastMessage}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      <footer style={styles.footer}>
        <p>© {new Date().getFullYear()} Tienda ONYX - Proyecto Académico</p>
      </footer>
    </div>
  );
}

/* 🌸 Estilos con paleta rosa–vino */
const styles = {
  container: {
    fontFamily: "Poppins, sans-serif",
    backgroundColor: "var(--color1)",
    minHeight: "100vh",
    color: "var(--texto)",
  },
  productContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: "30px",
    padding: "40px 20px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  image: {
    width: "350px",
    height: "350px",
    objectFit: "cover",
    borderRadius: "10px",
    border: "4px solid var(--color3)",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },
  details: {
    flex: 1,
    minWidth: "300px",
    background: "#fff",
    borderRadius: "10px",
    padding: "25px",
    boxShadow: "0 3px 15px rgba(0,0,0,0.15)",
  },
  title: {
    color: "var(--color5)",
    fontSize: "1.8rem",
    marginBottom: "10px",
  },
  desc: {
    color: "#555",
    marginBottom: "10px",
  },
  price: {
    color: "var(--color3)",
    fontWeight: "bold",
    fontSize: "1.3rem",
  },
  vendedor: {
    fontSize: "0.9rem",
    color: "gray",
  },
  ratingBox: {
    marginTop: "10px",
    marginBottom: "15px",
  },
  commentLink: {
    color: "var(--color4)",
    textDecoration: "none",
    fontWeight: "bold",
  },
  buttons: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  },
  cartButton: {
    background: "var(--color5)",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "10px 15px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background 0.3s ease",
  },
  backButton: {
    background: "var(--color4)",
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
    background: "var(--color5)",
    color: "#fff",
    marginTop: "40px",
  },
};
