import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";


export default function AgregarProducto() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState("");
  const [toast, setToast] = useState({ visible: false, message: "" });

  const mostrarToast = (msg) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: "" }), 3000);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return mostrarToast("Debes iniciar sesión");

    try {
      let imageURL =
        "https://res.cloudinary.com/demo/image/upload/v1729999999/default-imagen.png";

      // 🔹 Subida directa a Cloudinary (solo si se seleccionó imagen)
      if (imagen) {
        const formData = new FormData();
        formData.append("file", imagen);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "ml_default"
        );

        const uploadRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );

        imageURL = uploadRes.data.secure_url;
      }

      await axios.post("/api/productos/nuevo", {
        nombre,
        descripcion,
        precio,
        categoria,
        imagenURL: imageURL,
        idVendedor: user.id,
      });

      mostrarToast("✅ Producto agregado correctamente");
      setNombre("");
      setDescripcion("");
      setPrecio("");
      setCategoria("");
      setImagen(null);
      setPreview("");
    } catch (error) {
      console.error("❌ Error al agregar producto:", error);
      mostrarToast("Error al agregar producto");
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <h1 style={styles.title}>🛍️ Agregar Producto</h1>

      <div style={styles.card}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Nombre del producto *"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={styles.input}
          />
          <textarea
            placeholder="Descripción (opcional)"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            style={styles.textarea}
          />
          <input
            type="number"
            placeholder="Precio *"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Categoría *"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}>📸 Imagen del producto:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            style={styles.inputFile}
          />

          {preview && (
            <img src={preview} alt="Vista previa" style={styles.preview} />
          )}

          <button type="submit" style={styles.button}>
            💾 Publicar producto
          </button>
        </form>
      </div>

      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast({ visible: false, message: "" })}
      />
    </div>
  );
}

/* 🎨 Estilos modernos tipo dashboard */
const styles = {
  container: {
    background: "var(--color1)",
    minHeight: "100vh",
    fontFamily: "Poppins, sans-serif",
    color: "#fff",
    padding: "20px",
  },
  title: {
    textAlign: "center",
    color: "var(--color5)",
    fontSize: "1.8rem",
    marginBottom: "20px",
  },
  card: {
    background: "#fff",
    maxWidth: "480px",
    margin: "0 auto",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid var(--color4)",
    marginBottom: "12px",
    fontSize: "1rem",
  },
  textarea: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid var(--color4)",
    marginBottom: "12px",
    resize: "none",
    height: "80px",
  },
  label: {
    color: "var(--color4)",
    fontWeight: "bold",
    marginBottom: "6px",
  },
  inputFile: {
    marginBottom: "10px",
  },
  preview: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "12px",
  },
  button: {
    background: "var(--color5)",
    color: "#fff",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1rem",
  },
};
