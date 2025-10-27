// ✅ API: /api/productos/nuevo.js
import sql from "mssql";
import { dbConfig } from "../../../lib/dbconfig";



export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Permite imágenes más grandes
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Método no permitido" });

  const { nombre, descripcion, precio, categoria, imagenURL, idVendedor } =
    req.body;

  if (!nombre || !precio || !categoria || !idVendedor)
    return res.status(400).json({ message: "Faltan datos obligatorios" });

  try {
    const pool = await sql.connect(dbConfig);

    await pool.request()
      .input("ID_Vendedor", sql.Int, idVendedor)
      .input("Nombre", sql.NVarChar, nombre)
      .input("Descripcion", sql.NVarChar, descripcion || "")
      .input("Precio", sql.Decimal(10, 2), precio)
      .input("Categoria", sql.NVarChar, categoria)
      .input(
        "ImagenURL",
        sql.NVarChar,
        imagenURL ||
          "https://res.cloudinary.com/demo/image/upload/v1729999999/default-imagen.png"
      )
      .query(`
        INSERT INTO Productos (ID_Vendedor, Nombre, Descripcion, Precio, Categoria, ImagenURL)
        VALUES (@ID_Vendedor, @Nombre, @Descripcion, @Precio, @Categoria, @ImagenURL)
      `);

    res.status(201).json({ message: "Producto agregado correctamente" });
  } catch (error) {
    console.error("❌ Error al insertar producto:", error);
    res.status(500).json({ message: "Error al agregar producto" });
  }
}
