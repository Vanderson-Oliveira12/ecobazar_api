import express, { Express } from "express";
import dotenv from "dotenv";
import connection from "./db/connection";
import routes from "./routes/index";
import path from "path";

dotenv.config();

export const app: Express = express();
const port = process.env.PORT || 3001;

app.use("public", express.static(path.resolve(__dirname, "public")));
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", routes);

connection
  .then((x) => {
    console.log("Conectado ao banco com sucesso!");
    app.listen(port, () => {
      console.log("http://localhost:" + port);
    });
  })
  .catch((x) => {
    console.log("ERRO AO CONECTAR NO BANCO DE DADOS");
    console.log(x);
  });