import sql from "mssql";
import jwt from "jsonwebtoken";
import { dbConfig } from "../../../lib/dbconfig";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token requerido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.rol !== "admin") {
      return res.status(403).json({ error: "Acceso denegado" });
    }

    const { id, nuevoRol } = req.body;

    if (!["cliente", "vendedor", "admin"].includes(nuevoRol)) {
      return res.status(400).json({ error: "Rol inválido" });
    }

    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("rol", sql.VarChar, nuevoRol)
      .query("UPDATE Usuarios SET Rol = @rol WHERE ID_Usuario = @id");

    res.status(200).json({ message: "Rol actualizado correctamente" });
  } catch (error) {
    console.error("Error al cambiar rol:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}
