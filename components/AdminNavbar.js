import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function AdminNavbar() {
  const [user, setUser] = useState(null);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <header style={styles.navbar}>
      <div style={styles.leftSection}>
        {/* Logo ONYX */}
      <h1 style={styles.logo}>
        <Link href="/" style={styles.logoLink}>
          ONYX<span style={styles.diamond}>◆</span>
        </Link>
      </h1>

        {/* ⚙️ Panel admin visible solo para admin */}
        {user?.rol === "admin" && (
          <Link href="/admin" style={styles.adminBtn}>
            ⚙️ Panel Admin
          </Link>
        )}
      </div>

      <nav>
        {user ? (
          <div style={{ display: "inline-block", position: "relative" }}>
            <button
              onClick={() => setMostrarPerfil(!mostrarPerfil)}
              style={styles.userButton}
            >
              👤 {user.nombre.toUpperCase()}
            </button>

            {mostrarPerfil && (
              <div style={styles.dropdown}>
                <p>
                  <strong>Nombre:</strong> {user.nombre}
                </p>
                <p>
                  <strong>Rol:</strong> {user.rol}
                </p>

                {(user.rol === "vendedor" || user.rol === "admin") && (
                  <button
                    onClick={() => router.push("/mis-productos")}
                    style={styles.menuBtn}
                  >
                    🧾 Mis productos
                  </button>
                )}

                <button
                  onClick={() =>
                    alert("Sección 'Mis compras' próximamente disponible 🛒")
                  }
                  style={styles.menuBtn}
                >
                  🛒 Mis compras
                </button>

                <button
                  onClick={() =>
                    alert("Sección de configuración en desarrollo ⚙️")
                  }
                  style={styles.menuBtn}
                >
                  ⚙️ Configuración
                </button>

                <hr style={{ margin: "10px 0" }} />

                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    router.push("/login");
                  }}
                  style={styles.logoutBtn}
                >
                  🚪 Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/carrito" style={styles.navLink}>
              Carrito
            </Link>
            <Link href="/agregar-producto" style={styles.navLink}>
              Agregar Producto
            </Link>
            <Link href="/login" style={styles.navLink}>
              Iniciar Sesión
            </Link>
          </>
        )}
      </nav>

      {/* Hover animado */}
      <style jsx>{`
        a:hover {
          opacity: 0.9;
        }
        .admin-btn:hover {
          background: var(--color3);
          box-shadow: 0 0 10px rgba(175, 96, 126, 0.7);
          transform: scale(1.05);
          transition: all 0.3s ease-in-out;
        }
      `}</style>
    </header>
  );
}

/* 🎨 Estilos con paleta rosa-vino ONYX */
const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "var(--color5)",
    padding: "12px 20px",
    color: "#fff",
    boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  logo: {
    margin: 0,
    fontSize: "1.6rem",
    fontWeight: "bold",
    letterSpacing: "1px",
    cursor: "pointer",
  },
  adminBtn: {
    background: "var(--color4)",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "0.9rem",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  },
  navLink: {
    marginLeft: "15px",
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "color 0.3s ease",
  },
  userButton: {
    background: "none",
    border: "none",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  dropdown: {
    position: "absolute",
    right: 0,
    background: "#fff",
    color: "#000",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    padding: "10px",
    marginTop: "5px",
    minWidth: "200px",
    zIndex: 50,
    textAlign: "left",
  },
  menuBtn: {
    display: "block",
    width: "100%",
    background: "none",
    border: "none",
    textAlign: "left",
    padding: "6px 0",
    color: "#000",
    cursor: "pointer",
  },
  logoutBtn: {
    background: "var(--color4)",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "8px",
    cursor: "pointer",
    width: "100%",
    fontWeight: "bold",
  },
};
