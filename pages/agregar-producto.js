import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function AgregarProducto() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    imagenURL: ""
  });
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!token || (user.rol !== "vendedor" && user.rol !== "admin")) {
      router.push("/login");
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post("/api/productos/nuevo", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensaje("✅ Producto publicado correctamente");
      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      console.error(err);
      setMensaje(err.response?.data?.error || "Error al publicar");
    }
  };

  return (
    <div style={styles.container}>
       {/* 🔹 Barra de navegación */}
      <Navbar />
      <h2 style={styles.title}>📌 Publicar nuevo producto</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
          required
          style={styles.textarea}
        />
        <input
          type="number"
          step="0.01"
          name="precio"
          placeholder="Precio"
          value={form.precio}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="categoria"
          placeholder="Categoría"
          value={form.categoria}
          onChange={handleChange}
          style={styles.input}
        />
        <label>Imagen del producto:</label>
<input
  type="file"
  accept="image/*"
  onChange={async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    // Indicamos que está cargando
    setMensaje("Subiendo imagen... ⏳");

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload", true);

      // 🔹 Escuchar progreso de carga
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setMensaje(`Subiendo imagen... ${percent}%`);
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          setForm({ ...form, imagenURL: data.url });
          setMensaje("Imagen subida correctamente");
        } else {
          setMensaje("Error al subir imagen");
        }
      };

      xhr.onerror = () => {
        setMensaje("Error de conexión al subir imagen");
      };

      xhr.send(formData);
    } catch (err) {
      console.error(err);
      setMensaje("Error al subir imagen");
    }
  }}
/>

{/* 🔹 Vista previa */}
{form.imagenURL && (
  <div style={{ marginTop: "10px" }}>
    <img
      src={form.imagenURL}
      alt="Vista previa"
      style={{
        width: "100%",
        maxHeight: "200px",
        objectFit: "cover",
        borderRadius: "8px",
      }}
    />
  </div>
)}
{mensaje && (
  <p
    style={{
      color: mensaje.includes("Error") ? "red" : "#1B396A",
      fontWeight: "bold",
      textAlign: "center",
      marginTop: "10px",
    }}
  >
    {mensaje}
  </p>
)}


        <button type="submit" style={styles.submitBtn}>Publicar</button>
      </form>
      {mensaje && <p style={styles.mensaje}>{mensaje}</p>}
    </div>
  );
}

const azul = "#1B396A";
const gris = "#807E82";
const naranja = "#FF8C00";

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  title: { textAlign: "center", color: azul, marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: {
    padding: "10px",
    border: `1px solid ${gris}`,
    borderRadius: "4px",
  },
  textarea: {
    padding: "10px",
    border: `1px solid ${gris}`,
    borderRadius: "4px",
    minHeight: "80px",
  },
  submitBtn: {
    background: naranja,
    color: "#fff",
    padding: "10px",
    fontSize: "1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  mensaje: { textAlign: "center", marginTop: "10px", fontWeight: "bold" },
};
