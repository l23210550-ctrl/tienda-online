import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

export default function EditarProducto() {
  const [form, setForm] = useState({
    Nombre: "",
    Descripcion: "",
    Precio: "",
    Categoria: "",
    ImagenURL: "",
  });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [imagenPreview, setImagenPreview] = useState("");
  const router = useRouter();
  const { id } = router.query;

  const azul = "#1B396A";
  const gris = "#807E82";
  const naranja = "#FF8C00";

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem("token");

    axios
      .get(`/api/productos/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setForm(res.data);
        setImagenPreview(res.data.ImagenURL);
      })
      .catch(() => setMensaje("Error al cargar producto"));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ml_default"); // usa tu upload preset en Cloudinary

      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      const imageUrl = uploadRes.data.secure_url;
      setForm({ ...form, ImagenURL: imageUrl });
      setImagenPreview(imageUrl);
      setMensaje("✅ Imagen subida correctamente");
    } catch (error) {
      console.error("Error al subir imagen:", error);
      setMensaje("Error al subir la imagen");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        "/api/productos/editar",
        { id, ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensaje("✅ Producto actualizado correctamente");
      setTimeout(() => router.push("/mis-productos"), 1500);
    } catch (error) {
      console.error(error);
      setMensaje("Error al actualizar el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.formContainer}>
        <h1 style={{ color: azul, textAlign: "center" }}>✏️ Editar Producto</h1>

        {mensaje && <p style={{ color: azul, fontWeight: "bold" }}>{mensaje}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label>Nombre del producto:</label>
          <input
            type="text"
            name="Nombre"
            value={form.Nombre}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label>Descripción:</label>
          <textarea
            name="Descripcion"
            value={form.Descripcion}
            onChange={handleChange}
            rows="3"
            style={styles.textarea}
          ></textarea>

          <label>Precio:</label>
          <input
            type="number"
            name="Precio"
            value={form.Precio}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label>Categoría:</label>
          <input
            type="text"
            name="Categoria"
            value={form.Categoria}
            onChange={handleChange}
            style={styles.input}
          />

          <label>Imagen del producto:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={styles.inputFile}
          />

          {imagenPreview && (
            <img
              src={imagenPreview}
              alt="Vista previa"
              style={styles.preview}
            />
          )}

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? "Guardando..." : "💾 Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}

// 🎨 Estilos TecNM + profesional
const styles = {
  container: {
    fontFamily: "sans-serif",
    background: "#f5f5f5",
    minHeight: "100vh",
    paddingBottom: "40px",
  },
  formContainer: {
    maxWidth: "500px",
    background: "#fff",
    margin: "40px auto",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  textarea: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  inputFile: {
    padding: "6px",
  },
  preview: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "8px",
    marginTop: "10px",
  },
  submitBtn: {
    background: "#FF8C00",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background 0.2s",
  },
};
