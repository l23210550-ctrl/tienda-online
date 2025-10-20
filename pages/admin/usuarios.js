import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import AdminNavbar from "../../components/AdminNavbar";

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();

  const azul = "#1B396A";
  const gris = "#807E82";
  const naranja = "#FF8C00";

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
      <header style={styles.header}>
        <h1 style={{ color: "#fff" }}>👥 Administración de Usuarios</h1>
      </header>
    <div>
      <AdminNavbar />
      {/* Contenido del panel */}
    </div>
      {mensaje && <p style={{ color: "red", textAlign: "center" }}>{mensaje}</p>}

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={{ background: azul, color: "#fff" }}>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.ID_Usuario}>
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

const styles = {
  container: {
    fontFamily: "sans-serif",
    background: "#f5f5f5",
    minHeight: "100vh",
    paddingBottom: "30px",
  },
  header: {
    background: "#1B396A",
    padding: "15px",
    textAlign: "center",
  },
  tableContainer: {
    maxWidth: "900px",
    margin: "30px auto",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  select: {
    padding: "5px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginRight: "10px",
  },
  deleteBtn: {
    background: "red",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    padding: "6px 10px",
  },
};
