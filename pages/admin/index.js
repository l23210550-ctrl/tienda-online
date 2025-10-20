import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const azul = "#1B396A";
  const gris = "#807E82";
  const naranja = "#FF8C00";

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
        <h2 style={styles.logo}>⚙️ Admin ITT</h2>

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
          <button
            onClick={() => alert("Reportes próximamente 📊")}
            style={styles.linkBtn}
          >
            📊 Reportes
          </button>
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
        <h1 style={styles.title}>Bienvenido al Panel de Administración</h1>
        <p style={styles.subtitle}>
          Aquí puedes gestionar usuarios, pedidos, productos y más.
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
            <p>Consulta y administra los pedidos realizados en la tienda.</p>
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
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "sans-serif",
    background: "#f5f5f5",
  },
  sidebar: {
    width: "240px",
    background: "#1B396A",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "20px",
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
  },
  logo: {
    fontSize: "1.3rem",
    marginBottom: "20px",
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
    borderTop: "1px solid #807E82",
    paddingTop: "10px",
  },
  logoutBtn: {
    background: "red",
    border: "none",
    borderRadius: "5px",
    color: "#fff",
    padding: "8px",
    cursor: "pointer",
    marginTop: "10px",
    width: "100%",
  },
  main: {
    marginLeft: "260px",
    padding: "40px",
    flex: 1,
  },
  title: {
    color: "#1B396A",
    fontSize: "1.8rem",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#807E82",
    marginBottom: "30px",
  },
  cardsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  btn: {
    background: "#FF8C00",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
  },
};
