// ✅ utils/db.js
import sql from "mssql";

export const config = {
  user: "sa",         // 👉 Ejemplo: 'sa'
  password: "12345",  // 👉 Ejemplo: '12345'
  server: "DESKTOP-U85EPAJ\\SQLEXPRESS",            // o "DESKTOP-U85EPAJ\\SQLEXPRESS"
  database: "TiendaOnline",
  options: {
    encrypt: false, // ❌ Importante para SQL Server local
    trustServerCertificate: true,
  },
};

export async function getConnection() {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (error) {
    console.error("Error de conexión a la base de datos:", error);
    throw new Error("No se pudo conectar a la base de datos");
  }
}
