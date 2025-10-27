import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";

export default function EditarProducto() {
  const router = useRouter();
  const { id } = router.query;

  const [producto, setProducto] = useState(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagen, setImagen] = useState("");
  const [preview, setPreview] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem("token");

    axios
      .get(`/api/productos/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const p = res.data;
        setProducto(p);
        setNombre(p.Nombre);
        setDescripcion(p.Descripcion);
        setPrecio(p.Precio);
        setCategoria(p.Categoria);
        setPreview(p.ImagenURL);
      })
      .catch(() => mostrarToast("⚠️ Error al cargar producto"));
  }, [id]);

  const mostrarToast = (mensaje) => {
    setToastMessage(mensaje);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagen(reader.result);
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !precio || !categoria.trim()) {
      mostrarToast("⚠️ Por favor completa todos los campos obligatorios");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await axios.put(
        "/api/productos/editar",
        {
          id,
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          precio: parseFloat(precio),
          categoria: categoria.trim(),
          imagenURL: imagen || preview, // usa la existente si no se cambió
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      mostrarToast("✅ Producto actualizado correctamente");
      setTimeout(() => router.push("/mis-productos"), 1500);
    } catch (error) {
      console.error("Error al editar producto:", error);
      mostrarToast("❌ Error al actualizar el producto");
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <h1 style={styles.title}>✏️ Editar Producto</h1>

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
          <input type="file" accept="image/*" onChange={handleImage} style={styles.inputFile} />
          {preview && <img src={preview} alt="Vista previa" style={styles.preview} />}

          <button type="submit" style={styles.button}>
            💾 Guardar Cambios
          </button>
        </form>
      </div>

      <Toast
        message={toastMessage}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
}

/* 🎨 Estilos tipo Dashboard centrado ONYX */
const styles = {
  container: {
    background: "var(--color1)",
    color: "#fff",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "Poppins, sans-serif",
  },
  title: {
    textAlign: "center",
    color: "var(--color5)",
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  card: {
    background: "#fff",
    color: "#000",
    maxWidth: "600px",
    margin: "0 auto",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  label: {
    alignSelf: "flex-start",
    marginBottom: "-5px",
    fontWeight: "bold",
    color: "var(--color4)",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid var(--color4)",
    fontSize: "1rem",
  },
  textarea: {
    width: "100%",
    height: "90px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid var(--color4)",
    resize: "none",
  },
  inputFile: {
    alignSelf: "flex-start",
    marginBottom: "10px",
  },
  preview: {
    width: "100%",
    maxHeight: "240px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "15px",
    border: "2px solid var(--color3)",
  },
  button: {
    background: "var(--color5)",
    color: "#fff",
    border: "none",
    padding: "12px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
    width: "100%",
    transition: "background 0.3s ease",
  },
};
