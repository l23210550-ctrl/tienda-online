import { getConnection } from "../../../lib/db";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).end();

  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Token requerido" });

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = req.body;

    const pool = await getConnection();
    const result = await pool.request()
      .input("ID_Producto", id)
      .input("ID_Vendedor", decoded.id)
      .query(`
        DELETE FROM Productos
        WHERE ID_Producto = @ID_Producto 
          AND (@ID_Vendedor = ID_Vendedor 
            OR @ID_Vendedor IN (SELECT ID_Usuario FROM Usuarios WHERE Rol = 'admin'))
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Producto no encontrado o sin permiso para eliminar" });
    }

    res.status(200).json({ message: "✅ Producto eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar producto:", err);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
}
