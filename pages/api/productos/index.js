import { getConnection } from "../../../lib/db";

export default async function handler(req, res) {
  const pool = await getConnection();
  const { categoria, minPrecio, maxPrecio } = req.query;

  try {
    let query = `
      SELECT p.*, u.Nombre AS NombreVendedor
      FROM Productos p
      JOIN Usuarios u ON p.ID_Vendedor = u.ID_Usuario
      WHERE 1=1
    `;

    if (categoria) query += " AND p.Categoria = @categoria";
    if (minPrecio) query += " AND p.Precio >= @minPrecio";
    if (maxPrecio) query += " AND p.Precio <= @maxPrecio";

    const request = pool.request();
    if (categoria) request.input("categoria", categoria);
    if (minPrecio) request.input("minPrecio", Number(minPrecio));
    if (maxPrecio) request.input("maxPrecio", Number(maxPrecio));

    const result = await request.query(query);
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).json({ error: err.message });
  }
}
