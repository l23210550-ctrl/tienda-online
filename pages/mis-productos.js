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

  const azul = "#1B396A";
  const gris = "#807E82";
  const naranja = "#FF8C00";

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
        setProductos(productos.filter((p) => p.ID_Producto !== productoSeleccionado.ID_Producto));
        setMensaje("Producto eliminado correctamente");
      } catch {
        setMensaje("Error al eliminar producto");
      }
    } else if (accion === "editar") {
      router.push(`/editar-producto?id=${productoSeleccionado.ID_Producto}`);
    }

    setModalVisible(false);
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.header}>
        <h1 style={{ color: azul }}>🧾 Mis Productos</h1>

        {/* 🔹 Botón para crear nueva publicación */}
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
            <h3 style={{ color: azul, textTransform: "uppercase" }}>{p.Nombre}</h3>
            <p style={{ color: gris }}>{p.Descripcion}</p>
            <p>
              <strong>${p.Precio}</strong>
            </p>
            <p style={{ color: gris, fontSize: "0.9rem" }}>
              Publicado por: <strong>{p.NombreVendedor}</strong>
            </p>

            <div style={{ position: "relative" }}>
              <button
                onClick={() =>
                  setMenuAbierto(menuAbierto === p.ID_Producto ? null : p.ID_Producto)
                }
                style={styles.menuBtn}
              >
                ⋮
              </button>

              {menuAbierto === p.ID_Producto && (
                <div style={styles.dropdown}>
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

      {/* 🔹 Modal de confirmación */}
      {modalVisible && productoSeleccionado && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <img
              src={productoSeleccionado.ImagenURL || "/placeholder.png"}
              alt={productoSeleccionado.Nombre}
              style={styles.modalImage}
            />
            <h2 style={{ color: azul }}>{productoSeleccionado.Nombre}</h2>
            <p>{productoSeleccionado.Descripcion}</p>
            <p style={{ fontWeight: "bold" }}>${productoSeleccionado.Precio}</p>

            <p style={{ color: gris, marginBottom: "10px" }}>
              {accion === "eliminar"
                ? "¿Seguro que deseas eliminar este producto? Esta acción no se puede deshacer."
                : "¿Quieres editar los detalles de este producto?"}
            </p>

            <div style={styles.modalActions}>
              <button
                onClick={() => setModalVisible(false)}
                style={styles.cancelBtn}
              >
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

// 🎨 Estilos TecNM + botón destacado
const styles = {
  container: {
    padding: "20px",
    fontFamily: "sans-serif",
    background: "#f5f5f5",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  newBtn: {
    background: "#FF8C00",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "10px 16px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    transition: "background 0.3s, transform 0.2s",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "10px",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  menuBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    fontSize: "1.4rem",
    cursor: "pointer",
  },
  dropdown: {
    position: "absolute",
    right: "10px",
    top: "40px",
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    zIndex: 10,
    width: "220px",
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
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    borderRadius: "10px",
    padding: "20px",
    maxWidth: "400px",
    textAlign: "center",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
  },
  modalImage: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  modalActions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
  },
  cancelBtn: {
    background: "#807E82",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "8px 12px",
    cursor: "pointer",
    flex: 1,
    marginRight: "5px",
  },
  deleteBtn: {
    background: "red",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "8px 12px",
    cursor: "pointer",
    flex: 1,
  },
  editBtn: {
    background: "#FF8C00",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "8px 12px",
    cursor: "pointer",
    flex: 1,
  },
};
