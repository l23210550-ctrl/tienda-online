import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.rol !== "admin") {
      router.push("/login");
    } else {
      setUser(storedUser);
    }
  }, []);

  const cerrarSesion = () => {
    if (confirm("¿Seguro que deseas cerrar sesión?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    }
  };

  return (
    <div style={styles.container}>
      {/* 🔹 Sidebar fijo */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>
          
          <Link href="/" style={styles.logoLink}>
          ONYX<span style={styles.diamond}>◆</span>
          </Link>
        
        </h2>

        <nav style={styles.nav}>
          <Link href="/admin" style={styles.link}>
            🏠 Inicio
          </Link>
          <Link href="/admin/usuarios" style={styles.link}>
            👥 Usuarios
          </Link>
          <Link href="/admin/pedidos" style={styles.link}>
            🧾 Pedidos
          </Link>
          <Link href="/admin/panel-admin" style={styles.link}>
            📊 Panel general
          </Link>
        </nav>

        <div style={styles.footer}>
          <p style={{ fontSize: "0.9rem" }}>👤 {user?.nombre}</p>
          <button onClick={cerrarSesion} style={styles.logoutBtn}>
            🚪 Cerrar sesión
          </button>
        </div>
      </aside>

      {/* 🔹 Contenido principal */}
      <main style={styles.main}>
        <h1 style={styles.title}>Bienvenido al Panel de Administración ONYX</h1>
        <p style={styles.subtitle}>
          Gestiona usuarios, productos, pedidos y más desde un solo lugar.
        </p>

        <div style={styles.cardsContainer}>
          <div style={styles.card}>
            <h3>👥 Usuarios</h3>
            <p>Gestiona roles y permisos de los usuarios registrados.</p>
            <Link href="/admin/usuarios">
              <button style={styles.btn}>Ver usuarios</button>
            </Link>
          </div>

          <div style={styles.card}>
            <h3>🧾 Pedidos</h3>
            <p>Consulta y administra los pedidos realizados en ONYX.</p>
            <Link href="/admin/pedidos">
              <button style={styles.btn}>Ver pedidos</button>
            </Link>
          </div>

          <div style={styles.card}>
            <h3>📦 Productos</h3>
            <p>Supervisa los productos publicados por los vendedores.</p>
            <Link href="/mis-productos">
              <button style={styles.btn}>Ver productos</button>
            </Link>
          </div>

          <div style={styles.card}>
            <h3>💬 Comentarios</h3>
            <p>Modera las opiniones y calificaciones de los usuarios.</p>
            <Link href="/admin/panel-admin">
              <button style={styles.btn}>Ver panel</button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

/* 🎨 Estilos ONYX - Paleta rosa-vino */
const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Poppins, sans-serif",
    background: "var(--color1)",
    color: "#fff",
  },
  sidebar: {
    width: "240px",
    background: "var(--color5)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "20px",
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    boxShadow: "2px 0 8px rgba(0,0,0,0.3)",
  },
  logo: {
    fontSize: "1.4rem",
    marginBottom: "30px",
    fontWeight: "bold",
    letterSpacing: "1px",
    color: "#fff",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    padding: "8px 0",
    transition: "color 0.3s ease",
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#fff",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: "bold",
  },
  footer: {
    borderTop: "1px solid rgba(255,255,255,0.3)",
    paddingTop: "10px",
  },
  logoutBtn: {
    background: "var(--color3)",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    padding: "8px",
    cursor: "pointer",
    marginTop: "10px",
    width: "100%",
    fontWeight: "bold",
    transition: "background 0.3s ease",
  },
  main: {
    marginLeft: "260px",
    padding: "40px",
    flex: 1,
  },
  title: {
    color: "var(--color5)",
    fontSize: "1.9rem",
    marginBottom: "10px",
  },
  subtitle: {
    color: "var(--color3)",
    marginBottom: "30px",
    fontSize: "1rem",
  },
  cardsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "25px",
  },
  card: {
    background: "#fff",
    color: "var(--color5)",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  btn: {
    background: "var(--color4)",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "8px 14px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
    transition: "background 0.3s ease",
  },
};
