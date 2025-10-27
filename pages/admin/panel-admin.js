import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";

export default function PanelAdmin() {
  const [resumen, setResumen] = useState(null);
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    axios.get("/api/admin/resumen").then((res) => setResumen(res.data));
    axios.get("/api/admin/comentarios").then((res) => setComentarios(res.data));
  }, []);

  const eliminarComentario = async (id) => {
    if (!confirm("¿Eliminar este comentario?")) return;
    await axios.delete(`/api/admin/comentarios/${id}`);
    setComentarios((prev) => prev.filter((c) => c.ID_Comentario !== id));
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <h1 style={styles.title}>📊 Panel de Administración ONYX</h1>

      {/* 🔹 Resumen general */}
      <div style={styles.cards}>
        <div style={styles.card}>
          <h3>👥 Usuarios</h3>
          <p>{resumen?.usuarios || 0}</p>
        </div>
        <div style={styles.card}>
          <h3>💰 Ventas</h3>
          <p>{resumen?.ventas || 0}</p>
        </div>
        <div style={styles.card}>
          <h3>🧾 Productos</h3>
          <p>{resumen?.productos || 0}</p>
        </div>
      </div>

      {/* 🔹 Comentarios */}
      <section style={styles.commentsSection}>
        <h2 style={styles.commentsTitle}>💬 Comentarios Recientes</h2>
        {comentarios.length === 0 ? (
          <p style={styles.noComments}>No hay comentarios.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Producto</th>
                <th>Comentario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {comentarios.map((c) => (
                <tr key={c.ID_Comentario}>
                  <td>{c.NombreUsuario}</td>
                  <td>{c.NombreProducto}</td>
                  <td>{c.Contenido}</td>
                  <td>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => eliminarComentario(c.ID_Comentario)}
                    >
                      ❌ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

/* 🎨 Estilos ONYX - Paleta rosa-vino */
const styles = {
  container: {
    background: "var(--color1)",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "Poppins, sans-serif",
    color: "var(--color5)",
  },
  title: {
    textAlign: "center",
    color: "var(--color5)",
    fontSize: "2rem",
    marginTop: "10px",
    marginBottom: "30px",
  },
  cards: {
    display: "flex",
    justifyContent: "center",
    gap: "25px",
    flexWrap: "wrap",
    marginBottom: "40px",
  },
  card: {
    background: "linear-gradient(145deg, var(--color4), var(--color3))",
    padding: "25px 20px",
    borderRadius: "12px",
    width: "200px",
    textAlign: "center",
    color: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "default",
  },
  cardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
  },
  commentsSection: {
    background: "#fff",
    color: "#000",
    borderRadius: "10px",
    padding: "25px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    marginBottom: "40px",
  },
  commentsTitle: {
    color: "var(--color5)",
    marginBottom: "15px",
  },
  noComments: {
    color: "#555",
    fontStyle: "italic",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },
  "table th": {
    background: "var(--color4)",
    color: "#fff",
    padding: "10px",
    textAlign: "left",
  },
  "table td": {
    borderBottom: "1px solid #ddd",
    padding: "10px",
    verticalAlign: "top",
  },
  deleteBtn: {
    background: "var(--color5)",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "6px 10px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background 0.3s ease",
  },
  "@media (max-width: 768px)": {
    cards: {
      flexDirection: "column",
      alignItems: "center",
    },
    table: {
      fontSize: "0.9rem",
    },
  },
};
