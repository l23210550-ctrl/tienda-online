// ✅ utils/auth.js
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "clave-secreta-onyx";

export function getTokenData(req) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded; // Contiene { id, email, rol, ... }
  } catch (error) {
    console.error("Error al verificar token:", error);
    return null;
  }
}

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.ID_Usuario,
      email: user.Email,
      rol: user.Rol,
    },
    SECRET_KEY,
    { expiresIn: "3h" }
  );
}
