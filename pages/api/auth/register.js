import sql from "mssql";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dbConfig } from "../../../lib/dbconfig"; // ✅ sube 3 niveles (auth → api → pages → lib)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  try {
    // 🔹 Conexión a SQL Server
    const pool = await sql.connect(dbConfig);

    // 🔹 Verificar si el correo ya existe
    const userExist = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM Usuarios WHERE Email = @email");

    if (userExist.recordset.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    // 🔹 Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Rol por defecto = cliente
    const userRole =
      rol && (rol === "vendedor" || rol === "admin") ? rol : "cliente";

    // 🔹 Insertar nuevo usuario (usa PasswordHash según tu tabla)
    await pool
      .request()
      .input("nombre", sql.VarChar, nombre)
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, hashedPassword)
      .input("rol", sql.VarChar, userRole)
      .query(`
        INSERT INTO Usuarios (Nombre, Email, PasswordHash, Rol)
        VALUES (@nombre, @email, @password, @rol)
      `);

    res
      .status(200)
      .json({ message: `Usuario registrado correctamente como ${userRole}.` });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}
