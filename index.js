import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";

// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken: "TEST-6954976907151707-021921-243200addef99adabc584b4366f21390-177908791" });

const app = express();
const port = 3000;

app.disable('x-powered-by')

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("¡Bienvenido!");
});

const ACCEPTED_ORIGINS = ['http://localhost:3000','https://botasjusaino.netlify.app'];

app.post("/create_preference", async (req, res) => {
  const origin = req.header('origin');
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin);
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
      auto_return: "approved"
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
