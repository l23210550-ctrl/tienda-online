import { getConnection } from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT 
        c.ID_Comentario,
        u.Nombre AS NombreUsuario,
        p.Nombre AS NombreProducto,
        c.Comentario,
        c.Puntuacion,
        c.Fecha
      FROM Comentarios c
      INNER JOIN Usuarios u ON c.ID_Usuario = u.ID_Usuario
      INNER JOIN Productos p ON c.ID_Producto = p.ID_Producto
      ORDER BY c.Fecha DESC
    `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("❌ Error al obtener comentarios:", error);
    res.status(500).json({ error: "Error al obtener los comentarios" });
  }
}
