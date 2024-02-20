import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";

// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken: "TEST-6954976907151707-021921-243200addef99adabc584b4366f21390-177908791" });

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("¡Bienvenido!");
});

app.post("/create_preference", async (req, res) => {
    try {
      const body = {
        items: [
          {
            title: req.body.title,
            quantity: Number(req.body.quantity),
            unit_price: Number(req.body.price), // Corregido: "unit_price" en lugar de "unid_price"
            currency_id: "MXN",
          },
        ],
        back_urls: {
          success: "https://botasjusaino.netlify.app/", // Corregido: "success" en lugar de "succes"
          failure: "https://botasjusaino.netlify.app/e-shop.html",
          pending: "https://botasjusaino.netlify.app/e-shop.html",
        },
        auto_return: "approved"
      };
      
      // Crea la preferencia de pago utilizando la clase Preference
      const preference = new Preference(client); // Reemplaza 'client' con tu instancia de MercadoPago
      const result = await preference.create({ body });
      
      // Devuelve el ID de la preferencia creada
      res.json({ id: result.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al crear la preferencia :(" });
    }
  });

app.listen(port, () => {
  console.log(`El servidor está corriendo en el puerto ${port}`);
});
