import { getConnection } from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const pool = await getConnection();

    const [usuarios, ventas, productos, ratings] = await Promise.all([
      pool.request().query("SELECT COUNT(*) AS total FROM Usuarios"),
      pool.request().query("SELECT COUNT(*) AS total FROM Pedidos"),
      pool.request().query("SELECT COUNT(*) AS total FROM Productos"),
      pool.request().query(`
        SELECT 
          p.ID_Producto,
          p.Nombre,
          AVG(CAST(c.Puntuacion AS FLOAT)) AS Promedio
        FROM Comentarios c
        JOIN Productos p ON c.ID_Producto = p.ID_Producto
        GROUP BY p.ID_Producto, p.Nombre
      `)
    ]);

    res.status(200).json({
      usuarios: usuarios.recordset[0].total,
      ventas: ventas.recordset[0].total,
      productos: productos.recordset[0].total,
      ratings: ratings.recordset
    });
  } catch (error) {
    console.error("❌ Error al obtener resumen admin:", error);
    res.status(500).json({ error: "Error al obtener resumen" });
  }
}
