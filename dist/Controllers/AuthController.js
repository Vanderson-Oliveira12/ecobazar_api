"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = require("../Models/UserModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = require("jsonwebtoken");
class AuthController {
    signIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                if (!email || !password) {
                    return res.send({ message: "Email e senha obrigatórios!" }).status(400);
                }
                const user = yield UserModel_1.UserModel.findOne({ email: email });
                if (!user) {
                    return res
                        .send({ message: "Não existe usuário com esse e-mail" })
                        .status(401);
                }
                const passwordIsEqual = yield bcrypt_1.default.compare(password, user.password);
                if (!passwordIsEqual) {
                    return res.send({ message: "Usuário ou senha incorretos!" }).status(401);
                }
                const payload = (0, jsonwebtoken_1.sign)({
                    id: user.id,
                    email: user.email,
                }, "chaveTeste", { expiresIn: 3600 });
                res.send({ accessToken: payload }).status(200);
            }
            catch (err) {
                console.log("Erro signin");
                return res.send({ message: "Erro interno, contate o suporte do sistema" }).status(500);
            }
        });
    }
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, lastname, email, password } = req.body;
            if (!name || !lastname || !email || !password) {
                return res.send({ message: "Preencha todos os campos!" }).status(403);
            }
            try {
                const emailsExists = yield UserModel_1.UserModel.findOne({ email: email });
                if (emailsExists) {
                    return res.send({ message: "Email já registrado" }).status(403);
                }
                const passwordCript = yield bcrypt_1.default.hash(password, 10);
                const userCreated = yield UserModel_1.UserModel.create({
                    name,
                    lastname,
                    email,
                    password: passwordCript,
                });
                res.send({ message: userCreated }).status(201);
            }
            catch (err) {
                console.log(err);
                res.status(500).send({ message: "Erro interno do servidor!" });
            }
        });
    }
}
exports.default = new AuthController();
