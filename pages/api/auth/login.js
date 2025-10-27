import { getConnection } from "../../../utils/db";
import bcrypt from "bcryptjs";
import { generateToken } from "../../../utils/auth";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Método no permitido" });

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Correo y contraseña requeridos" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("Email", email)
      .query("SELECT * FROM Usuarios WHERE Email = @Email");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = result.recordset[0];

    const passwordMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // ✅ Genera token con info del usuario
    const token = generateToken(user);

    // ✅ Devuelve datos básicos + token
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.ID_Usuario,
        nombre: user.Nombre,
        email: user.Email,
        rol: user.Rol,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
