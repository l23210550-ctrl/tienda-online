import { getConnection } from "../../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "DELETE")
    return res.status(405).json({ error: "Método no permitido" });

  const { id } = req.query;

  try {
    const pool = await getConnection();
    await pool.request().input("id", id).query("DELETE FROM Comentarios WHERE ID_Comentario = @id");

    res.status(200).json({ message: "Comentario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar comentario:", error);
    res.status(500).json({ error: "Error al eliminar comentario" });
  }
}
