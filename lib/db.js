// /lib/db.js
import sql from "mssql";

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER,     // por ejemplo "localhost" o "127.0.0.1"
  database: process.env.DB_NAME,
  options: {
    encrypt: false,                  // true si usas Azure
    trustServerCertificate: true,    // necesario para local
  },
};

let pool;  // guardamos la conexión para reutilizarla

export async function getConnection() {
  if (pool) return pool;
  try {
    pool = await sql.connect(config);
    return pool;
  } catch (err) {
    console.error("Error de conexión a SQL Server:", err);
    throw err;
  }
}
