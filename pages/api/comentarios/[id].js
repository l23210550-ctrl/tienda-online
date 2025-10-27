import { getConnection } from "../../../lib/db";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const { id } = req.query; // ID_Producto
  const pool = await getConnection();

  try {
    if (req.method === "GET") {
      // Paginación
      const page = Number(req.query.page ?? 1);
      const pageSize = Number(req.query.pageSize ?? 5);
      const offset = (page - 1) * pageSize;

      // Items paginados (más recientes primero)
      const itemsQuery = await pool
        .request()
        .input("id", id)
        .input("offset", offset)
        .input("pageSize", pageSize)
        .query(`
          SELECT c.ID_Comentario,
                 c.Comentario,
                 c.Puntuacion,
                 c.Fecha,
                 u.Nombre AS Autor,
                 u.ID_Usuario AS ID_UsuarioAutor
          FROM Comentarios c
          JOIN Usuarios u ON c.ID_Usuario = u.ID_Usuario
          WHERE c.ID_Producto = @id
          ORDER BY c.Fecha DESC
          OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
        `);

      // Conteo total y promedio
      const statsQuery = await pool
        .request()
        .input("id", id)
        .query(`
          SELECT COUNT(*) AS count,
                 AVG(CAST(Puntuacion AS float)) AS avg
          FROM Comentarios
          WHERE ID_Producto = @id
        `);

      const total = statsQuery.recordset[0]?.count ?? 0;
      const avg = statsQuery.recordset[0]?.avg ?? 0;

      return res.status(200).json({
        items: itemsQuery.recordset,
        total,
        avg,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      });
    }

    if (req.method === "POST") {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ error: "Token no proporcionado" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { comentario, puntuacion } = req.body;

      if (!comentario || comentario.trim() === "") {
        return res.status(400).json({ error: "El comentario no puede estar vacío" });
      }

      const score = Math.min(5, Math.max(1, Number(puntuacion ?? 5)));

      await pool
        .request()
        .input("id", id)
        .input("usuario", decoded.id)
        .input("comentario", comentario)
        .input("puntuacion", score)
        .query(`
          INSERT INTO Comentarios (ID_Producto, ID_Usuario, Comentario, Puntuacion)
          VALUES (@id, @usuario, @comentario, @puntuacion)
        `);

      return res.status(201).json({ message: "Comentario agregado correctamente" });
    }

    if (req.method === "DELETE") {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ error: "Token no proporcionado" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { idComentario } = req.body;

      const result = await pool
        .request()
        .input("idComentario", idComentario)
        .query("SELECT ID_Usuario FROM Comentarios WHERE ID_Comentario = @idComentario");

      if (result.recordset.length === 0) {
        return res.status(404).json({ error: "Comentario no encontrado" });
      }

      const owner = result.recordset[0].ID_Usuario;
      if (owner !== decoded.id && decoded.rol !== "admin") {
        return res.status(403).json({ error: "No tienes permiso para eliminar este comentario" });
      }

      await pool
        .request()
        .input("idComentario", idComentario)
        .query("DELETE FROM Comentarios WHERE ID_Comentario = @idComentario");

      return res.status(200).json({ message: "Comentario eliminado correctamente" });
    }

    return res.status(405).json({ error: "Método no permitido" });
  } catch (error) {
    console.error("Error en /api/comentarios/[id]:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
