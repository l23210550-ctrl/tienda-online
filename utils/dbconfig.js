export const dbConfig = {
  user: process.env.DB_USER,          // Tu usuario de SQL Server
  password: process.env.DB_PASS,  // Tu contraseña
  server: process.env.DB_SERVER,      // Ejemplo: "localhost" o "192.168.1.10"
  database: process.env.DB_NAME,  // Ejemplo: "TiendaOnline"
  port: parseInt(process.env.DB_PORT || "1433"),
  options: {
    encrypt: false, // Cambiar a true si usas Azure SQL o SSL
    trustServerCertificate: true, // Requerido en entornos locales
  },
};
