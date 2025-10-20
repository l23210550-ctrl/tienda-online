import { getConnection } from "../../../lib/db";
import jwt from "jsonwebtoken";
import { dbConfig } from "../../../lib/dbconfig";


export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Token requerido" });

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { nombre, descripcion, precio, categoria, imagenURL } = req.body;

    const pool = await getConnection();
    await pool.request()
      .input("ID_Vendedor", decoded.id)
      .input("Nombre", nombre)
      .input("Descripcion", descripcion)
      .input("Precio", precio)
      .input("Categoria", categoria || "")
      .input("ImagenURL", imagenURL || "")
      .query(`
        INSERT INTO Productos (ID_Vendedor, Nombre, Descripcion, Precio, Categoria, ImagenURL)
        VALUES (@ID_Vendedor, @Nombre, @Descripcion, @Precio, @Categoria, @ImagenURL)
      `);

    res.status(201).json({ message: "Producto publicado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al publicar producto" });
  }
}
