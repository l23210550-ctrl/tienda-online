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

    // Obtener totales
    const usuarios = await pool.request().query("SELECT COUNT(*) AS total FROM Usuarios");
    const productos = await pool.request().query("SELECT COUNT(*) AS total FROM Productos");
    const pedidos = await pool.request().query("SELECT COUNT(*) AS total FROM Pedidos");

    // Últimos productos con nombre del vendedor
    const ultimosProductos = await pool.request().query(`
      SELECT TOP 5 
        p.ID_Producto, p.Nombre, p.Precio, p.FechaPublicacion, 
        u.Nombre AS NombreVendedor
      FROM Productos p
      JOIN Usuarios u ON p.ID_Vendedor = u.ID_Usuario
      ORDER BY p.FechaPublicacion DESC
    `);

    res.status(200).json({
      stats: {
        usuarios: usuarios.recordset[0].total,
        productos: productos.recordset[0].total,
        pedidos: pedidos.recordset[0].total,
      },
      ultimosProductos: ultimosProductos.recordset,
    });
  } catch (error) {
    console.error("Error en stats admin:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}
