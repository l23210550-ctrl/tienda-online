import sql from "mssql";
import jwt from "jsonwebtoken";
import { dbConfig } from "../../../lib/dbconfig";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token no proporcionado" });

    // ✅ Decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Conexión a la base de datos
    const pool = await sql.connect(dbConfig);

    let query;

    // ✅ Si el usuario es admin, traer todos los productos
    if (decoded.rol === "admin") {
      query = `
        SELECT p.*, u.Nombre AS NombreVendedor
        FROM Productos p
        JOIN Usuarios u ON p.ID_Vendedor = u.ID_Usuario
        ORDER BY p.FechaPublicacion DESC
      `;
    } else {
      // ✅ Si no es admin, solo sus productos
      query = `
        SELECT p.*, u.Nombre AS NombreVendedor
        FROM Productos p
        JOIN Usuarios u ON p.ID_Vendedor = u.ID_Usuario
        WHERE p.ID_Vendedor = ${decoded.id}
        ORDER BY p.FechaPublicacion DESC
      `;
    }

    const result = await pool.request().query(query);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}
