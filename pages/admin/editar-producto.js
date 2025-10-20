import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function EditarProducto() {
  const router = useRouter();
  const { id } = router.query;

  const [producto, setProducto] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    imagenURL: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const azul = "#1B396A";
  const gris = "#807E82";
  const naranja = "#FF8C00";

  // Obtener producto por ID
  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    axios
      .get(`/api/productos/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setProducto(res.data);
        setForm({
          nombre: res.data.Nombre,
          descripcion: res.data.Descripcion,
          precio: res.data.Precio,
          categoria: res.data.Categoria || "",
          imagenURL: res.data.ImagenURL || "",
        });
      })
      .catch(() => setMensaje("Error al cargar el producto."));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    const token = localStorage.getItem("token");
    try {
      await axios.put(
      "/api/admin/editar-producto",
      { id, ...form },
      { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensaje("✅ Producto actualizado correctamente");
      setTimeout(() => router.push("/mis-productos"), 1500);
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al actualizar el producto");
    } finally {
      setLoading(false);
    }
  };

  if (!producto) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Cargando producto...</p>;
  }

  return (
    <div style={styles.container}>
      <h1 style={{ color: azul, textAlign: "center" }}>✏️ Editar Producto</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Nombre del producto</label>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Descripción</label>
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          rows="3"
          required
          style={styles.textarea}
        />

        <label style={styles.label}>Precio</label>
        <input
          name="precio"
          type="number"
          min="0"
          step="0.01"
          value={form.precio}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Categoría</label>
        <input
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Imagen (URL)</label>
        <input
          name="imagenURL"
          value={form.imagenURL}
          onChange={handleChange}
          style={styles.input}
        />

        {form.imagenURL && (
          <img
            src={form.imagenURL}
            alt="Vista previa"
            style={{ width: "200px", margin: "10px auto", display: "block", borderRadius: "8px" }}
          />
        )}

        <button type="submit" style={styles.btn} disabled={loading}>
          {loading ? "Guardando..." : "💾 Guardar cambios"}
        </button>
      </form>

      {mensaje && <p style={{ textAlign: "center", marginTop: "10px" }}>{mensaje}</p>}
    </div>
  );
}

// 🎨 Estilos TecNM
const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    background: "#fff",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    fontFamily: "sans-serif",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  label: {
    color: "#1B396A",
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: `1px solid #807E82`,
  },
  textarea: {
    padding: "10px",
    borderRadius: "4px",
    border: `1px solid #807E82`,
    resize: "none",
  },
  btn: {
    background: "#FF8C00",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "10px",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
