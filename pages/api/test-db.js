// ✅ /api/test-db.js — Verifica conexión SQL Server
import sql from "mssql";
import { dbConfig } from "../../lib/dbConfig.js"; // o utils/dbConfig.js según tu estructura

export default async function handler(req, res) {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query("SELECT TOP 1 Nombre FROM Usuarios");
    res.status(200).json({ success: true, message: "Conexión exitosa 🎉", result: result.recordset });
  } catch (error) {
    console.error("❌ Error de conexión SQL:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
