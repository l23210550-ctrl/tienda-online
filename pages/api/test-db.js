import { getConnection } from "../../lib/db";

export default async function handler(req, res) {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT TOP 1 * FROM Usuarios");
    res.status(200).json({ ok: true, resultado: result.recordset });
  } catch (error) {
    res.status(500).json({ error: "Error al conectar con la base", detalle: error.message });
  }
}
