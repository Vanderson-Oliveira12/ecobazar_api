"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = __importDefault(require("express"));
const AuthController_1 = __importDefault(require("./Controllers/AuthController"));
exports.routes = express_1.default.Router();
exports.routes.get("/auth/signin", AuthController_1.default.signIn);
exports.routes.post("/auth/signup", AuthController_1.default.signUp);
