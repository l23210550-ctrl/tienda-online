import sql from "mssql";
import jwt from "jsonwebtoken";
import { dbConfig } from "../../../lib/dbconfig";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token requerido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.rol !== "admin") {
      return res.status(403).json({ error: "Acceso denegado" });
    }

    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(`
      SELECT ID_Usuario, Nombre, Email, Rol, FechaRegistro
      FROM Usuarios
      ORDER BY FechaRegistro DESC
    `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}
