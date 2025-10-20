import { getConnection } from "../../../lib/db";

export default async function handler(req, res) {
  const pool = await getConnection();
  try {
    const result = await pool.request().query(`
      SELECT p.*, u.Nombre AS NombreVendedor
      FROM Productos p
      JOIN Usuarios u ON p.ID_Vendedor = u.ID_Usuario
      ORDER BY p.FechaPublicacion DESC
    `);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
