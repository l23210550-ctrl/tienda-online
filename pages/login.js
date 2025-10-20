import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "cliente", // valor por defecto
  });
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();

  const azul = "#1B396A";
  const gris = "#807E82";
  const negro = "#000";
  const naranja = "#FF8C00";

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      if (isLogin) {
        // 🔹 LOGIN
        const res = await axios.post("/api/auth/login", {
          email: form.email,
          password: form.password,
        });

        // Guardar token y datos de usuario
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

       setMensaje("Inicio de sesión exitoso");
      // 🔹 Si el usuario es admin, lo mandamos al panel
      setTimeout(() => {
      if (res.data.user.rol === "admin") {
          router.push("/admin");
          } else if (res.data.user.rol === "vendedor") {
            router.push("/mis-productos");
          } else {
          router.push("/");
          }
      }, 1000);

      } else {
        // 🔹 REGISTRO
        const res = await axios.post("/api/auth/register", {
          nombre: form.nombre,
          email: form.email,
          password: form.password,
          rol: form.rol, // ahora incluye el tipo de cuenta
        });
        setMensaje(res.data.message);
        setIsLogin(true);
      }
    } catch (err) {
      setMensaje(err.response?.data?.error || "Error inesperado");
    }
  };

  return (
    <div style={styles.container}>
      {/* 🔹 Barra de navegación */}
      <header style={styles.navbar}>
        <h1 style={styles.logo}>🛍️ Tienda ITT</h1>
        <Link href="/" style={styles.navLink}>
          Inicio
        </Link>
      </header>

      {/* 🔹 Formulario principal */}
      <div style={styles.formContainer}>
        <h2 style={styles.title}>
          {isLogin ? "Iniciar Sesión" : "Crear una cuenta"}
        </h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre completo"
                value={form.nombre}
                onChange={handleChange}
                required
                style={styles.input}
              />

              {/* 🔸 Selector de tipo de cuenta */}
              <select
                name="rol"
                value={form.rol}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="cliente">Soy comprador</option>
                <option value="vendedor">Soy vendedor</option>
              </select>
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.submitBtn}>
            {isLogin ? "Entrar" : "Registrarse"}
          </button>
        </form>

        {/* 🔹 Alternar entre login y registro */}
        <p style={{ marginTop: "10px" }}>
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={styles.toggleBtn}
          >
            {isLogin ? "Regístrate aquí" : "Inicia sesión"}
          </button>
        </p>

        {/* 🔹 Mensaje de estado */}
        {mensaje && <p style={styles.mensaje}>{mensaje}</p>}
      </div>
    </div>
  );
}

// 🎨 Estilos TecNM
const azul = "#1B396A";
const gris = "#807E82";
const negro = "#000";
const naranja = "#FF8C00";

const styles = {
  container: {
    fontFamily: "sans-serif",
    background: "#f5f5f5",
    minHeight: "100vh",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: azul,
    padding: "10px 20px",
    color: "#fff",
  },
  logo: { margin: 0, fontSize: "1.5rem" },
  navLink: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
  },
  formContainer: {
    maxWidth: "400px",
    background: "#fff",
    margin: "60px auto",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    color: azul,
    marginBottom: "15px",
    fontWeight: "bold",
  },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: {
    padding: "10px",
    border: `1px solid ${gris}`,
    borderRadius: "4px",
    fontSize: "1rem",
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
    marginTop: "10px",
  },
  toggleBtn: {
    background: "none",
    border: "none",
    color: naranja,
    cursor: "pointer",
    fontWeight: "bold",
  },
  mensaje: {
    marginTop: "10px",
    color: negro,
    fontWeight: "bold",
  },
};
