import express, { Express } from "express";
import dotenv from "dotenv";
import connection from "./db/connection";
import { routes } from "./routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use("/api", routes);

connection.then(x => {
    console.log("Conectado ao banco com sucesso!")
    app.listen(port, () => {
        console.log("http://localhost:" + port);
    });
})
.catch(x => {
    console.log("ERRO AO CONECTAR NO BANCO DE DADOS")
    console.log(x);
})

