import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

export default function MisProductos() {
  const [productos, setProductos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [accion, setAccion] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) return router.push("/login");
    if (storedUser) setUser(JSON.parse(storedUser));

    axios
      .get("/api/productos/mis", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setProductos(res.data))
      .catch(() => setMensaje("Error al cargar productos"));
  }, []);

  const confirmarAccion = (tipo, producto) => {
    setAccion(tipo);
    setProductoSeleccionado(producto);
    setModalVisible(true);
  };

  const ejecutarAccion = async () => {
  if (!productoSeleccionado) return;
  const token = localStorage.getItem("token");

  if (accion === "eliminar") {
    try {
      await axios.delete("/api/productos/eliminar", {
        headers: { Authorization: `Bearer ${token}` },
        data: { id: productoSeleccionado.ID_Producto },
      });

      // 🔹 Quita el producto del listado visual
      setProductos((prev) =>
        prev.filter((p) => p.ID_Producto !== productoSeleccionado.ID_Producto)
      );

      // 🔹 Quita también del carrito local si existe
      const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
      const carritoActualizado = carrito.filter(
        (item) => item.ID_Producto !== productoSeleccionado.ID_Producto
      );
      localStorage.setItem("carrito", JSON.stringify(carritoActualizado));

      // 🔹 Mensaje visual de confirmación
      setMensaje("✅ Producto eliminado correctamente y quitado del carrito");
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      setMensaje("❌ Error al eliminar producto");
    }
  } else if (accion === "editar") {
    router.push(`/editar-producto?id=${productoSeleccionado.ID_Producto}`);
  }

  setModalVisible(false);
  setMenuAbierto(null);
};


  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.header}>
        <h1 style={{ color: "var(--color5)" }}>🧾 Mis Productos</h1>

        {(user?.rol === "vendedor" || user?.rol === "admin") && (
          <button
            style={styles.newBtn}
            onClick={() => router.push("/agregar-producto")}
          >
            ➕ Nueva publicación
          </button>
        )}
      </div>

      {mensaje && <p>{mensaje}</p>}

      <div style={styles.grid}>
        {productos.map((p) => (
          <div key={p.ID_Producto} style={styles.card}>
            <img
              src={p.ImagenURL || "/placeholder.png"}
              alt={p.Nombre}
              style={styles.image}
            />
            <h3 style={{ color: "var(--color4)", textTransform: "uppercase" }}>{p.Nombre}</h3>
            <p style={{ color: "#555" }}>{p.Descripcion}</p>
            <p>
              <strong>${p.Precio}</strong>
            </p>
            <p style={{ color: "gray", fontSize: "0.9rem" }}>
              Publicado por: <strong>{p.NombreVendedor}</strong>
            </p>

            <div style={styles.menuContainer}>
              <button
                onClick={() =>
                  setMenuAbierto(menuAbierto === p.ID_Producto ? null : p.ID_Producto)
                }
                style={styles.menuBtn}
              >
                ⋮
              </button>

              {menuAbierto === p.ID_Producto && (
                <div style={styles.dropdown} className="fade-slide">
                  {(user?.rol === "admin" || user?.id === p.ID_Vendedor) && (
                    <>
                      <button
                        onClick={() => confirmarAccion("editar", p)}
                        style={styles.optionBtn}
                      >
                        ✏️ Editar publicación
                      </button>
                      <button
                        onClick={() => confirmarAccion("eliminar", p)}
                        style={styles.optionBtn}
                      >
                        ❌ Eliminar publicación
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => router.push(`/productos/${p.ID_Producto}`)}
                    style={styles.optionBtn}
                  >
                    🔍 Ver detalles
                  </button>
                  <button
                    onClick={() =>
                      router.push(`/productos/comentarios?id=${p.ID_Producto}`)
                    }
                    style={styles.optionBtn}
                  >
                    💬 Ver comentarios
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de confirmación */}
      {modalVisible && productoSeleccionado && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <img
              src={productoSeleccionado.ImagenURL || "/placeholder.png"}
              alt={productoSeleccionado.Nombre}
              style={styles.modalImage}
            />
            <h2 style={{ color: "var(--color5)" }}>{productoSeleccionado.Nombre}</h2>
            <p>{productoSeleccionado.Descripcion}</p>
            <p style={{ fontWeight: "bold" }}>${productoSeleccionado.Precio}</p>

            <p style={{ color: "gray", marginBottom: "10px" }}>
              {accion === "eliminar"
                ? "¿Seguro que deseas eliminar este producto? Esta acción no se puede deshacer."
                : "¿Quieres editar los detalles de este producto?"}
            </p>

            <div style={styles.modalActions}>
              <button onClick={() => setModalVisible(false)} style={styles.cancelBtn}>
                Cancelar
              </button>
              <button
                onClick={ejecutarAccion}
                style={accion === "eliminar" ? styles.deleteBtn : styles.editBtn}
              >
                {accion === "eliminar" ? "Eliminar" : "Editar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* 🎨 Estilos ONYX */
const styles = {
  container: {
    padding: "20px",
    fontFamily: "Poppins, sans-serif",
    background: "var(--color1)",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  newBtn: {
    background: "var(--color5)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 16px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
    transition: "transform 0.2s ease, background 0.3s ease",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px",
  },
  card: {
    position: "relative",
    borderRadius: "12px",
    background: "#fff",
    padding: "15px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  menuContainer: {
    position: "absolute",
    top: "10px",
    right: "10px",
  },
  menuBtn: {
    background: "none",
    border: "none",
    fontSize: "1.4rem",
    cursor: "pointer",
    color: "var(--color5)",
  },
  dropdown: {
    position: "absolute",
    right: "0",
    top: "30px",
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    animation: "fadeSlide 0.3s ease forwards",
    zIndex: 10,
    width: "210px",
  },
  optionBtn: {
    display: "block",
    width: "100%",
    background: "none",
    border: "none",
    textAlign: "left",
    padding: "10px",
    cursor: "pointer",
    color: "#000",
    transition: "background 0.3s ease, color 0.3s ease",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#fff",
    borderRadius: "12px",
    padding: "25px",
    width: "380px",
    textAlign: "center",
  },
  modalImage: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  modalActions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
  },
  cancelBtn: {
    background: "var(--color3)",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "8px 12px",
    cursor: "pointer",
  },
  deleteBtn: {
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "8px 12px",
    cursor: "pointer",
  },
  editBtn: {
    background: "var(--color5)",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "8px 12px",
    cursor: "pointer",
  },
};
