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
    rol: "cliente",
  });
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      if (isLogin) {
        const res = await axios.post("/api/auth/login", {
          email: form.email,
          password: form.password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        setMensaje("Inicio de sesión exitoso");
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
        const res = await axios.post("/api/auth/register", {
          nombre: form.nombre,
          email: form.email,
          password: form.password,
          rol: form.rol,
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
      {/* 🔹 Barra superior */}
      <header style={styles.navbar}>
        <h1 style={styles.logo}>ONYX<span style={styles.diamond}>◆</span></h1>
        <Link href="/" style={styles.navLink}>
          Inicio
        </Link>
      </header>

      {/* 🔹 Formulario */}
      <div style={styles.overlay}>
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

          <p style={{ marginTop: "10px" }}>
            {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={styles.toggleBtn}
            >
              {isLogin ? "Regístrate aquí" : "Inicia sesión"}
            </button>
          </p>

          {mensaje && <p style={styles.mensaje}>{mensaje}</p>}
        </div>
      </div>
    </div>
  );
}

/* 🎨 Estilos ONYX con fondo degradado translúcido */
const styles = {
  container: {
    fontFamily: "Poppins, sans-serif",
    minHeight: "100vh",
    background: "linear-gradient(135deg, var(--color5), var(--color3))",
    display: "flex",
    flexDirection: "column",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(0, 0, 0, 0.25)",
    backdropFilter: "blur(10px)",
    padding: "10px 20px",
    color: "#fff",
  },
  logo: {
    margin: 0,
    fontSize: "1.7rem",
    fontWeight: "bold",
    letterSpacing: "2px",
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  formContainer: {
    width: "100%",
    maxWidth: "400px",
    background: "rgba(255, 255, 255, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "15px",
    padding: "30px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    backdropFilter: "blur(12px)",
    textAlign: "center",
  },
  title: {
    color: "#fff",
    marginBottom: "15px",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    background: "rgba(255,255,255,0.9)",
    outlineColor: "var(--color4)",
  },
  submitBtn: {
    background: "var(--color4)",
    color: "#fff",
    padding: "10px",
    fontSize: "1rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
    transition: "transform 0.2s ease, background 0.3s ease",
  },
  toggleBtn: {
    background: "none",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    textDecoration: "underline",
  },
  mensaje: {
    marginTop: "10px",
    color: "#fff",
    fontWeight: "bold",
  },
};
