import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Navbar from "../../components/Navbar";

export default function ComentariosProducto() {
  const router = useRouter();
  const { id } = router.query;

  // Estado
  const [producto, setProducto] = useState(null);
  const [user, setUser] = useState(null);

  const [comentarios, setComentarios] = useState([]);
  const [total, setTotal] = useState(0);
  const [avg, setAvg] = useState(0);

  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [nuevoComentario, setNuevoComentario] = useState("");
  const [puntuacion, setPuntuacion] = useState(5);
  const [mensaje, setMensaje] = useState("");

  // Paleta rosa-vino
  const color1 = "#ffaac5";
  const color2 = "#d785a2";
  const color3 = "#af607e";
  const color4 = "#873c5a";
  const color5 = "#5f1736";

  // Cargar datos
  useEffect(() => {
    if (!id) return;
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    axios.get(`/api/productos/${id}`).then((res) => setProducto(res.data));
  }, [id]);

  const fetchComentarios = async (pageArg = 1) => {
    const res = await axios.get(`/api/comentarios/${id}`, {
      params: { page: pageArg, pageSize },
    });
    setComentarios(res.data.items);
    setTotal(res.data.total);
    setAvg(res.data.avg ?? 0);
    setPage(res.data.page);
  };

  useEffect(() => {
    if (!id) return;
    fetchComentarios(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, page]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total]
  );

  const enviarComentario = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Debes iniciar sesión para comentar");
    if (!nuevoComentario.trim()) return;

    try {
      await axios.post(
        `/api/comentarios/${id}`,
        { comentario: nuevoComentario, puntuacion },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNuevoComentario("");
      setPuntuacion(5);
      setMensaje("Comentario enviado ✅");
      await fetchComentarios(1); // vuelve a la primera página para ver el más reciente
    } catch {
      setMensaje("Error al enviar comentario");
    }
  };

  const eliminarComentario = async (idComentario) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("No autorizado");
    if (!confirm("¿Eliminar este comentario?")) return;

    try {
      await axios.delete(`/api/comentarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { idComentario },
      });

      // Recalcular: si eliminaste el único comentario de la página y no es la primera,
      // regresamos una página para no dejarla vacía.
      const quedaUno = comentarios.length === 1 && page > 1;
      const nextPage = quedaUno ? page - 1 : page;
      await fetchComentarios(nextPage);
    } catch {
      alert("Error al eliminar comentario");
    }
  };

  const Star = ({ filled, onClick }) => (
    <span
      onClick={onClick}
      style={{
        cursor: "pointer",
        fontSize: "1.4rem",
        color: filled ? color3 : "#ccc",
        marginRight: 4,
      }}
      title={filled ? "Quitar / bajar" : "Subir puntuación"}
    >
      ★
    </span>
  );

  const StarsReadOnly = ({ value }) => {
    const v = Math.round(Number(value ?? 0));
    return (
      <span aria-label={`Puntuación ${v} de 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} style={{ color: i <= v ? color3 : "#ccc", marginRight: 2 }}>
            ★
          </span>
        ))}
      </span>
    );
  };

  return (
    <div style={styles.container(color1)}>
      <Navbar />

      <h1 style={{ color: color5, textAlign: "center" }}>💬 Comentarios del producto</h1>

      {producto && (
        <div style={styles.productCard}>
          <img
            src={producto.ImagenURL || "/placeholder.png"}
            alt={producto.Nombre}
            style={styles.image}
          />
          <div>
            <h2 style={{ color: color3, margin: 0 }}>{producto.Nombre}</h2>
            <p style={{ marginTop: 6 }}>{producto.Descripcion}</p>

            {/* Promedio de calificación */}
            <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <StarsReadOnly value={avg} />
              <span style={{ color: color5, fontWeight: "bold" }}>
                {Number(avg).toFixed(1)} / 5
              </span>
              <span style={{ color: color4 }}>
                ({total} valoración{total !== 1 ? "es" : ""})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Contador */}
      <h3 style={{ textAlign: "center", color: color5, marginTop: 10 }}>
        💬 {total} comentario{total !== 1 ? "s" : ""}
      </h3>

      {/* Nueva opinión */}
      <div style={styles.newBox}>
        <div style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} filled={i <= puntuacion} onClick={() => setPuntuacion(i)} />
          ))}
          <span style={{ color: color4, fontWeight: 600, marginLeft: 8 }}>
            {puntuacion} / 5
          </span>
        </div>

        <div style={styles.row}>
          <textarea
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
            placeholder="Escribe tu comentario..."
            style={styles.textarea(color2)}
          />
          <button onClick={enviarComentario} style={styles.btn(color3)}>
            Enviar
          </button>
        </div>

        {mensaje && <p style={{ color: color5, marginTop: 6 }}>{mensaje}</p>}
      </div>

      {/* Listado */}
      <div style={styles.commentsList}>
        {comentarios.length === 0 ? (
          <p style={{ textAlign: "center" }}>
            No hay comentarios en esta página.
          </p>
        ) : (
          comentarios.map((c) => (
            <div key={c.ID_Comentario} style={styles.comment}>
              <div style={styles.commentHeader}>
                <div>
                  <p style={{ fontWeight: "bold", color: color3, margin: 0 }}>{c.Autor}</p>
                  <StarsReadOnly value={c.Puntuacion} />
                </div>

                {(user?.rol === "admin" || user?.id === c.ID_UsuarioAutor) && (
                  <button
                    onClick={() => eliminarComentario(c.ID_Comentario)}
                    style={styles.deleteBtn(color5)}
                    title="Eliminar comentario"
                  >
                    🗑️
                  </button>
                )}
              </div>

              <p style={{ margin: "6px 0" }}>{c.Comentario}</p>
              <small style={{ color: "#777" }}>
                {new Date(c.Fecha).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>

      {/* Paginación */}
      <div style={styles.pager}>
        <button
          style={styles.pagerBtn(color4)}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
        >
          ⟨ Anterior
        </button>

        <span style={{ color: color5, fontWeight: 600 }}>
          Página {page} de {totalPages}
        </span>

        <button
          style={styles.pagerBtn(color4)}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
        >
          Siguiente ⟩
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: (fondo) => ({
    padding: "20px",
    background: fondo,
    minHeight: "100vh",
    fontFamily: "sans-serif",
  }),
  productCard: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    background: "#fff",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "16px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
  },
  image: {
    width: "150px",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  newBox: {
    background: "#fff",
    borderRadius: "10px",
    padding: "12px",
    marginBottom: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  starsRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
  },
  row: {
    display: "flex",
    gap: "10px",
  },
  textarea: (color) => ({
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: `1px solid ${color}`,
    resize: "none",
    minHeight: 70,
  }),
  btn: (bg) => ({
    background: bg,
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "10px 15px",
    cursor: "pointer",
    fontWeight: "bold",
    alignSelf: "flex-start",
  }),
  commentsList: {
    background: "#fff",
    borderRadius: "8px",
    padding: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  comment: {
    borderBottom: "1px solid #eee",
    padding: "10px 0",
  },
  commentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteBtn: (color) => ({
    background: "transparent",
    border: "none",
    color,
    cursor: "pointer",
    fontSize: "1.2rem",
  }),
  pager: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
  },
  pagerBtn: (bg) => ({
    background: bg,
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    padding: "8px 14px",
    cursor: "pointer",
    fontWeight: "bold",
    opacity: 1,
    transition: "opacity .2s",
    disabled: {
      opacity: 0.6,
    },
  }),
};
