// lib/db.js
import sql from "mssql";

export const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // necesario para Azure SQL
    trustServerCertificate: false,
  },
};

// Función reutilizable para obtener conexión
export async function getConnection() {
  try {
    const pool = await sql.connect(dbConfig);
    return pool;
  } catch (err) {
    console.error("❌ Error al conectar con SQL Server:", err);
    throw err;
  }
}
