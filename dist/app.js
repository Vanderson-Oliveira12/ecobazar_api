"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const connection_1 = __importDefault(require("./db/connection"));
const routes_1 = require("./routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use(express_1.default.json());
app.use("/api", routes_1.routes);
connection_1.default.then(x => {
    console.log("Conectado ao banco com sucesso!");
    app.listen(port, () => {
        console.log("http://localhost:" + port);
    });
})
    .catch(x => {
    console.log("ERRO AO CONECTAR NO BANCO DE DADOS");
    console.log(x);
});
