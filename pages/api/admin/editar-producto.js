import sql from "mssql";
import { dbConfig } from "../../../lib/dbconfig";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token no proporcionado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Solo admin puede acceder
    if (decoded.rol !== "admin") {
      return res.status(403).json({ error: "Acceso denegado. Solo administradores." });
    }

    const { id, nombre, descripcion, precio, categoria, imagenURL } = req.body;
    const pool = await sql.connect(dbConfig);

    await pool.request()
      .input("id", sql.Int, id)
      .input("nombre", sql.NVarChar, nombre)
      .input("descripcion", sql.NVarChar, descripcion)
      .input("precio", sql.Decimal(10, 2), precio)
      .input("categoria", sql.NVarChar, categoria)
      .input("imagenURL", sql.NVarChar, imagenURL)
      .query(`
        UPDATE Productos
        SET Nombre = @nombre,
            Descripcion = @descripcion,
            Precio = @precio,
            Categoria = @categoria,
            ImagenURL = @imagenURL
        WHERE ID_Producto = @id
      `);

    res.status(200).json({ message: "✅ Producto actualizado por administrador." });
  } catch (err) {
    console.error("Error en edición admin:", err);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
}
