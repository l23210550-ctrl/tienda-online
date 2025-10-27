import { getConnection } from "../../../lib/db";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Aumenta el límite a 10 MB
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).json({ error: "Método no permitido" });

  const { id, nombre, descripcion, precio, categoria, imagenURL } = req.body;

  if (!id || !nombre || !precio || !categoria)
    return res.status(400).json({ error: "Faltan campos obligatorios" });

  const pool = await getConnection();

  try {
    let imageUrl = imagenURL;

    // Si no hay imagen o está rota, usa la default
    if (!imagenURL || imagenURL.trim() === "" || imagenURL.includes("default-imagen.png")) {
      imageUrl = process.env.DEFAULT_PRODUCT_IMAGE || "https://via.placeholder.com/400x300.png?text=Producto+ONYX";
    }

    // Si se envía una imagen nueva base64, súbela a Cloudinary
    if (imagenURL && imagenURL.startsWith("data:image")) {
      const uploadResult = await cloudinary.v2.uploader.upload(imagenURL, {
        folder: "tienda_online",
      });
      imageUrl = uploadResult.secure_url;
    }

    await pool
      .request()
      .input("ID_Producto", id)
      .input("Nombre", nombre)
      .input("Descripcion", descripcion || "")
      .input("Precio", precio)
      .input("Categoria", categoria)
      .input("ImagenURL", imageUrl)
      .query(`
        UPDATE Productos
        SET Nombre = @Nombre,
            Descripcion = @Descripcion,
            Precio = @Precio,
            Categoria = @Categoria,
            ImagenURL = @ImagenURL
        WHERE ID_Producto = @ID_Producto
      `);

    res.status(200).json({ message: "✅ Producto actualizado correctamente", imageUrl });
  } catch (error) {
    console.error("Error al editar producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
