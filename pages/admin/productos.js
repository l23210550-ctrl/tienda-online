import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import AdminNavbar from "../../components/AdminNavbar";

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();

  const azul = "#1B396A";
  const gris = "#807E82";
  const naranja = "#FF8C00";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || user?.rol !== "admin") {
      router.push("/login");
      return;
    }

    axios
      .get("/api/productos", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setProductos(res.data))
      .catch(() => setMensaje("Error al cargar productos"));
  }, []);

  const eliminarProducto = async (id) => {
    const token = localStorage.getItem("token");
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

    try {
      await axios.delete("/api/productos/eliminar", {
        headers: { Authorization: `Bearer ${token}` },
        data: { id },
      });
      setProductos(productos.filter((p) => p.ID_Producto !== id));
    } catch {
      setMensaje("Error al eliminar producto");
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif", background: "#f5f5f5", minHeight: "100vh" }}>
      <AdminNavbar />

      <h1 style={{ color: azul, textAlign: "center", marginTop: "20px" }}>🧾 Todos los Productos</h1>
      {mensaje && <p>{mensaje}</p>}

      <div style={styles.grid}>
        {productos.map((p) => (
          <div key={p.ID_Producto} style={styles.card}>
            <img
              src={p.ImagenURL || "/placeholder.png"}
              alt={p.Nombre}
              style={styles.image}
            />
            <h3 style={{ color: azul }}>{p.Nombre}</h3>
            <p style={{ color: gris }}>{p.Descripcion}</p>
            <p><strong>${p.Precio}</strong></p>
            <p style={{ color: gris, fontSize: "0.9rem" }}>
              Publicado por: <strong>{p.NombreVendedor || "Desconocido"}</strong>
            </p>

            <div style={styles.actions}>
              <button
                onClick={() => router.push(`/admin/editar-producto?id=${p.ID_Producto}`)}
                style={styles.editBtn}
              >
                ✏️ Editar
              </button>
              <button
                onClick={() => eliminarProducto(p.ID_Producto)}
                style={styles.deleteBtn}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
    padding: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    padding: "15px",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  editBtn: {
    background: "#FF8C00",
    border: "none",
    color: "#fff",
    borderRadius: "5px",
    padding: "6px 10px",
    cursor: "pointer",
  },
  deleteBtn: {
    background: "red",
    border: "none",
    color: "#fff",
    borderRadius: "5px",
    padding: "6px 10px",
    cursor: "pointer",
  },
};
