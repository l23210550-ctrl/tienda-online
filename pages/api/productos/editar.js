import sql from "mssql";
import jwt from "jsonwebtoken";
import { dbConfig } from "../../../lib/dbconfig";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token no proporcionado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, Nombre, Descripcion, Precio, Categoria, ImagenURL } = req.body;

    const pool = await sql.connect(dbConfig);

    // 🔹 Si el usuario es admin puede editar cualquier producto
    // 🔹 Si es vendedor, solo los suyos
    const condicion =
      decoded.rol === "admin"
        ? ""
        : `AND ID_Vendedor = ${decoded.id}`;

    await pool
      .request()
      .input("id", sql.Int, id)
      .input("Nombre", sql.NVarChar, Nombre)
      .input("Descripcion", sql.NVarChar, Descripcion)
      .input("Precio", sql.Decimal(10, 2), Precio)
      .input("Categoria", sql.NVarChar, Categoria)
      .input("ImagenURL", sql.NVarChar, ImagenURL)
      .query(`
        UPDATE Productos
        SET Nombre = @Nombre,
            Descripcion = @Descripcion,
            Precio = @Precio,
            Categoria = @Categoria,
            ImagenURL = @ImagenURL
        WHERE ID_Producto = @id ${condicion}
      `);

    res.status(200).json({ message: "✅ Producto actualizado correctamente" });
  } catch (error) {
    console.error("Error al editar producto:", error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
}
