import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const router = useRouter();

  const azul = "#1B396A";
  const naranja = "#FF8C00";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <>
      <header style={styles.navbar}>
        <div style={styles.leftSection}>
          {/* 🛍️ Logo principal */}
          <Link href="/" style={{ textDecoration: "none", color: "white" }}>
            <h1 style={styles.logo}>🛍️ Tienda ITT</h1>
          </Link>
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
      </header>

      {/* 🟠 Botón flotante visible solo para admin en móviles */}
      {user?.rol === "admin" && (
        <button
          style={styles.fabButton}
          className="fab-btn"
          onClick={() => router.push("/admin")}
        >
          ⚙️
        </button>
      )}

      {/* ✅ Efectos CSS */}
      <style jsx>{`
        .admin-btn:hover {
          background: #e67e00;
          box-shadow: 0 0 10px rgba(255, 140, 0, 0.6);
          transform: scale(1.03);
          transition: all 0.2s ease-in-out;
        }
        .fab-btn:hover {
          background: #e67e00;
          box-shadow: 0 0 15px rgba(255, 140, 0, 0.7);
          transform: scale(1.1);
        }

        @media (max-width: 768px) {
          .admin-btn {
            display: none;
          }
        }
      `}</style>
    </>
  );
}

// 🎨 Estilos TecNM
const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#1B396A",
    padding: "10px 20px",
    color: "#fff",
    position: "relative",
    zIndex: 10,
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  logo: { margin: 0, fontSize: "1.5rem", cursor: "pointer" },
  adminBtn: {
    background: "#FF8C00",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "5px",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "0.9rem",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
  },
  navLink: {
    marginLeft: "15px",
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
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
    background: "red",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "8px",
    cursor: "pointer",
    width: "100%",
    fontWeight: "bold",
  },
  // 🔹 Botón flotante para móviles
  fabButton: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "#FF8C00",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "55px",
    height: "55px",
    fontSize: "1.5rem",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    zIndex: 100,
    transition: "all 0.2s ease-in-out",
  },
};
