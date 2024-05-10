"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
if (!process.env.DB_DATABASE) {
    throw new Error("Defina a DB nas variáveis");
}
exports.default = mongoose_1.default.connect(process.env.DB_DATABASE);
