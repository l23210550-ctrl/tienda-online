import sql from "mssql";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dbConfig } from "../../../lib/dbconfig"; 
 // ajusta la ruta si es diferente

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  try {
    // 🔹 Conectar con SQL Server
    const pool = await sql.connect(dbConfig);

    // 🔹 Buscar usuario por correo
    const result = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM Usuarios WHERE Email = @email");

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const user = result.recordset[0];

    // 🔹 Comparar contraseñas (usa PasswordHash de tu tabla)
    const isValid = await bcrypt.compare(password, user.PasswordHash);
    if (!isValid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // 🔹 Generar token JWT con el rol y datos del usuario
    const token = jwt.sign(
      {
        id: user.ID_Usuario,
        nombre: user.Nombre,
        rol: user.Rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // 🔹 Respuesta al cliente
    res.status(200).json({
      message: "Inicio de sesión exitoso ✅",
      token,
      user: {
        id: user.ID_Usuario,
        nombre: user.Nombre,
        email: user.Email,
        rol: user.Rol,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}
