import { getConnection } from "../../../lib/db";

export default async function handler(req, res) {
  const { id } = req.query;

  // Validar parámetro
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "ID de producto inválido" });
  }

  try {
    const pool = await getConnection();

   const result = await pool
      .request()
      .input("id", id)
      .query(`
        SELECT 
          p.*, 
          u.Nombre AS NombreVendedor,
          ISNULL(AVG(c.Puntuacion), 0) AS PromedioRating
        FROM Productos p
        JOIN Usuarios u ON p.ID_Vendedor = u.ID_Usuario
        LEFT JOIN Comentarios c ON p.ID_Producto = c.ID_Producto
        WHERE p.ID_Producto = @id
        GROUP BY 
          p.ID_Producto, p.ID_Vendedor, p.Nombre, p.Descripcion, 
          p.Precio, p.Categoria, p.ImagenURL, p.FechaPublicacion, u.Nombre
      `);


    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error("❌ Error en GET /api/productos/[id]:", err);
    res.status(500).json({ error: "Error al obtener el producto", detalle: err.message });
  }
}
