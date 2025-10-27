import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <header style={styles.navbar}>
      {/* Logo ONYX */}
      <h1 style={styles.logo}>
        <Link href="/" style={styles.logoLink}>
          ONYX<span style={styles.diamond}>◆</span>
        </Link>
      </h1>

      <nav style={styles.nav}>
        <Link href="/" style={styles.link}>Inicio</Link>
        <Link href="/carrito" style={styles.link}>Carrito</Link>

        {user ? (
          <>
            {(user.rol === "vendedor" || user.rol === "admin") && (
              <Link href="/mis-productos" style={styles.link}>Mis Productos</Link>
            )}
            {user.rol === "admin" && (
              <Link href="/admin" style={styles.link}>Panel Admin</Link>
            )}

            <button onClick={logout} style={styles.logoutBtn}>Cerrar sesión</button>
          </>
        ) : (
          <Link href="/login" style={styles.link}>Iniciar sesión</Link>
        )}
      </nav>
    </header>
  );
}

const styles = {
  navbar: {
    background: "linear-gradient(90deg, var(--color5), var(--color3))",
    padding: "15px 25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  },
  logo: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    margin: 0,
  },
  logoLink: {
    textDecoration: "none",
    color: "#fff",
    fontFamily: "Poppins, sans-serif",
    letterSpacing: "1px",
  },
  diamond: {
    color: "var(--color1)",
    fontSize: "1.3rem",
    marginLeft: "5px",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "color 0.3s",
  },
  logoutBtn: {
    background: "var(--color1)",
    color: "#5f1736",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
