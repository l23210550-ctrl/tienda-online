import { IncomingForm } from "formidable";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false, // importante para que formidable procese el archivo
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Método ${req.method} no permitido` });
  }

  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error al parsear el archivo:", err);
      return res.status(500).json({ error: "Error al procesar la imagen" });
    }

    try {
      const file = files.file[0];
      const filePath = file.filepath;

      const result = await cloudinary.uploader.upload(filePath, {
        folder: "tienda_online",
      });

      // borrar archivo temporal
      fs.unlinkSync(filePath);

      return res.status(200).json({ url: result.secure_url });
    } catch (uploadErr) {
      console.error("Error al subir a Cloudinary:", uploadErr);
      return res.status(500).json({ error: uploadErr.message });
    }
  });
}
