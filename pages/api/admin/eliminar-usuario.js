import sql from "mssql";
import jwt from "jsonwebtoken";
import { dbConfig } from "../../../lib/dbconfig";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token requerido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.rol !== "admin") {
      return res.status(403).json({ error: "Acceso denegado" });
    }

    const { id } = req.body;

    const pool = await sql.connect(dbConfig);

    // ⚠️ Evitar que el admin se elimine a sí mismo
    if (decoded.id === id) {
      return res.status(400).json({ error: "No puedes eliminar tu propia cuenta" });
    }

    // Eliminar registros relacionados si existen (Productos, Pedidos, etc.)
    await pool.request().input("id", sql.Int, id).query(`
      DELETE FROM Productos WHERE ID_Vendedor = @id;
      DELETE FROM Pedidos WHERE ID_Cliente = @id;
      DELETE FROM Usuarios WHERE ID_Usuario = @id;
    `);

    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}
