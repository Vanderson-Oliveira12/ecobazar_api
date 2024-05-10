import mongoose from "mongoose";
import { config } from "dotenv";

config();

if(!process.env.DB_DATABASE) {
    throw new Error("Defina a DB nas variáveis")
}

export default mongoose.connect(process.env.DB_DATABASE);