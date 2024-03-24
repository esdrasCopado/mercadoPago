import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import fileUpload from "express-fileupload";
import { getFiles, upLoadFile,getFileURL } from "./s3.js";
import fs from 'fs';

//cors
import { config } from "./config-cors.js"

const app = express();
const port = 3000;

const corsOptions = {
  origin: ["http://localhost", "https://proyectointegradoritson.netlify.app"],
};
app.use(cors(corsOptions));

// Agrega credenciales
const client = new MercadoPagoConfig({
  accessToken:
    "APP_USR-6954976907151707-021921-7ce64222e6ab3fdf97952bbdc7262bb8-177908791",
});



app.disable("x-powered-by");

app.use(cors(config.application.cors.server))

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("¡Bienvenido!");
});
app.get("/files", async (req, res) => {
 const result= await getFiles();
 res.json( result)

});

app.get("/getUrlFiles/",async (req,res)=>{
  
  const result= await getFileURL();
  res.json(result)
})
app.post("/files", async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Subir el archivo al servicio S3
    const result = await upLoadFile(req.files.file);

    // Eliminar el archivo temporal después de haberlo subido al servicio S3
    fs.unlinkSync(req.files.file.tempFilePath);

    // Envía una respuesta JSON con un mensaje de confirmación
    console.log(result);
    res.json({ result });
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir durante la carga del archivo
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.post("/create_preference", async (req, res) => {
  const origin = req.header("origin");
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  try {
    const body = {
      items: [
        {
          title: req.body.title,
          quantity: Number(req.body.quantity),
          unit_price: Number(req.body.price),
          currency_id: "MXN",
        },
      ],
      back_urls: {
        success: "https://botasjusaino.netlify.app/",
        failure: "https://botasjusaino.netlify.app/e-shop.html",
        pending: "https://botasjusaino.netlify.app/e-shop.html",
      },
      auto_return: "approved",
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    res.json({ id: result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la preferencia :(" });
  }
});

app.listen(port, () => {
  console.log(`El servidor está corriendo en el puerto ${port}`);
});
