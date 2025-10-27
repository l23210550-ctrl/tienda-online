// ✅ /pages/api/auth/register.js
import sql from "mssql";
import bcrypt from "bcryptjs";
import { dbConfig } from "../../../lib/dbconfig"; // conexión a SQL Server

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { nombre, email, password, rol } = req.body;

  if (!nombre?.trim() || !email?.trim() || !password?.trim()) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const pool = await sql.connect(dbConfig);

    // 🔹 Verificar si el correo ya existe
    const userExist = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT 1 FROM Usuarios WHERE Email = @email");

    if (userExist.recordset.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    // 🔹 Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Rol por defecto
    const userRole =
      rol && ["vendedor", "admin"].includes(rol) ? rol : "cliente";

    // 🔹 Registrar usuario
    await pool
      .request()
      .input("nombre", sql.NVarChar, nombre)
      .input("email", sql.NVarChar, email)
      .input("password", sql.NVarChar, hashedPassword)
      .input("rol", sql.NVarChar, userRole)
      .query(`
        INSERT INTO Usuarios (Nombre, Email, PasswordHash, Rol)
        VALUES (@nombre, @email, @password, @rol)
      `);

    res.status(200).json({
      message: `Usuario registrado correctamente como ${userRole}`,
      success: true,
    });
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    res.status(500).json({
      error: "Error interno en el servidor",
      detalle: error.message,
    });
  }
}
