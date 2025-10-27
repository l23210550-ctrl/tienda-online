import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import AdminNavbar from "../../components/AdminNavbar";

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.rol !== "admin") {
      router.push("/login");
      return;
    }

    const token = localStorage.getItem("token");

    axios
      .get("/api/admin/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsuarios(res.data))
      .catch(() => setMensaje("Error al cargar usuarios"));
  }, []);

  const cambiarRol = async (id, nuevoRol) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        "/api/admin/cambiar-rol",
        { id, nuevoRol },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsuarios(
        usuarios.map((u) =>
          u.ID_Usuario === id ? { ...u, Rol: nuevoRol } : u
        )
      );
    } catch {
      setMensaje("Error al cambiar el rol del usuario");
    }
  };

  const eliminarUsuario = async (id) => {
    const token = localStorage.getItem("token");
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

    try {
      await axios.delete("/api/admin/eliminar-usuario", {
        headers: { Authorization: `Bearer ${token}` },
        data: { id },
      });
      setUsuarios(usuarios.filter((u) => u.ID_Usuario !== id));
    } catch {
      setMensaje("Error al eliminar el usuario");
    }
  };

  return (
    <div style={styles.container}>
      <AdminNavbar />
      <header style={styles.header}>
        <h1 style={styles.title}>👥 Administración de Usuarios - ONYX</h1>
      </header>

      {mensaje && <p style={styles.alert}>{mensaje}</p>}

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.ID_Usuario} style={styles.row}>
                <td>{u.ID_Usuario}</td>
                <td>{u.Nombre}</td>
                <td>{u.Email}</td>
                <td>{u.Rol}</td>
                <td>
                  <select
                    value={u.Rol}
                    onChange={(e) => cambiarRol(u.ID_Usuario, e.target.value)}
                    style={styles.select}
                  >
                    <option value="cliente">Cliente</option>
                    <option value="vendedor">Vendedor</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={() => eliminarUsuario(u.ID_Usuario)}
                    style={styles.deleteBtn}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* 🎨 Paleta ONYX (rosa–vino) */
const styles = {
  container: {
    fontFamily: "Poppins, sans-serif",
    background: "var(--color1)",
    minHeight: "100vh",
    paddingBottom: "30px",
    color: "#fff",
  },
  header: {
    background: "linear-gradient(135deg, var(--color5), var(--color3))",
    padding: "20px",
    textAlign: "center",
    borderBottom: "4px solid var(--color4)",
  },
  title: {
    color: "#fff",
    fontSize: "1.8rem",
    fontWeight: "bold",
  },
  alert: {
    color: "var(--color5)",
    textAlign: "center",
    fontWeight: "bold",
  },
  tableContainer: {
    maxWidth: "950px",
    margin: "40px auto",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    background: "var(--color4)",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  row: {
    textAlign: "center",
    color: "#000",
    borderBottom: "1px solid #ddd",
  },
  select: {
    padding: "6px",
    border: "1px solid var(--color3)",
    borderRadius: "6px",
    marginRight: "10px",
    background: "#fff",
    color: "#000",
    fontWeight: "bold",
  },
  deleteBtn: {
    background: "var(--color5)",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    padding: "6px 10px",
    transition: "transform 0.2s ease, background 0.3s ease",
  },
};
