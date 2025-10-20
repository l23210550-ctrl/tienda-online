import sql from "mssql";
import { dbConfig } from "../../lib/dbconfig";



export default async function handler(req, res) {
  try {
    console.log("🟡 Intentando conectar a SQL Server...");

    const pool = await sql.connect(dbConfig);

    // Consulta simple para verificar la conexión
    const result = await pool.request().query("SELECT GETDATE() AS FechaActual");

    console.log("🟢 Conexión exitosa a SQL Server");
    res.status(200).json({
      message: "Conexión exitosa a SQL Server ✅",
      fechaServidor: result.recordset[0].FechaActual,
    });
  } catch (error) {
    console.error("🔴 Error al conectar con SQL Server:", error);
    res.status(500).json({
      error: "Error al conectar con SQL Server",
      detalle: error.message,
    });
  }
}
