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
const sendMail_1 = require("../services/sendMail");
const UserModel_1 = require("../Models/UserModel");
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = require("jsonwebtoken");
class AuthController {
    signIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!process.env.JWT_SECRET) {
                throw new Error("A chave JWT não está definida no ambiente!");
            }
            try {
                if (!email || !password) {
                    return res.send({ message: "Email e senha obrigatórios!" }).status(400);
                }
                const user = yield UserModel_1.UserModel.findOne({ email: email }).select("+password");
                if (!user) {
                    return res
                        .send({ message: "Não existe usuário com esse e-mail" })
                        .status(401);
                }
                const passwordIsEqual = yield bcrypt_1.default.compare(password, user.password);
                if (!passwordIsEqual) {
                    return res
                        .send({ message: "Usuário ou senha incorretos!" })
                        .status(401);
                }
                const payload = (0, jsonwebtoken_1.sign)({
                    id: user.id,
                    email: user.email,
                }, process.env.JWT_SECRET, { expiresIn: 3600 });
                res.send({ accessToken: "Bearer " + payload }).status(200);
            }
            catch (err) {
                console.log("Erro signin");
                console.log(err);
                return res
                    .send({ message: "Erro interno, contate o suporte do sistema" })
                    .status(500);
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
                return res.status(500).send({ message: "Erro interno do servidor!" });
            }
        });
    }
    recoveryPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                if (!email) {
                    return res.send({ message: "Informe um email" }).status(400);
                }
                const user = yield UserModel_1.UserModel.findOne({ email: email });
                if (!user) {
                    return res
                        .send({ message: "Usuário com esse e-mail não encontrado" })
                        .status(400);
                }
                const recoveryToken = crypto_1.default.randomBytes(32).toString("hex");
                const expires = new Date();
                expires.setMinutes(expires.getMinutes() + 5);
                yield UserModel_1.UserModel.findByIdAndUpdate(user.id, {
                    passwordRecoveryToken: recoveryToken,
                    passwordRecoveryExpires: expires,
                });
                yield (0, sendMail_1.sendEmail)('Recuperação de conta', "Texto de recuperação", email);
                return res.send({ message: "Foi enviado um link de recuperação, para o email registrado!" });
            }
            catch (err) {
                console.log(err);
                return res.status(500).send({ message: "Erro interno do servidor!" });
            }
        });
    }
    createNewPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, recoveryToken, newPassword, newPasswordConfirm } = req.body;
            const now = new Date();
            try {
                if (!email || !recoveryToken || !newPassword || !newPasswordConfirm) {
                    return res
                        .send({ message: "Campos obrigatórios não foram informados!" })
                        .status(400);
                }
                const user = yield UserModel_1.UserModel.findOne({ email }).select("+passwordRecoveryToken passwordRecoveryExpires");
                if (!user) {
                    return res
                        .send({ message: "Não existe usuário para esse e-mail!" })
                        .status(400);
                }
                if (newPassword !== newPasswordConfirm) {
                    return res.send({ message: "As senhas não são iguais!" }).status(400);
                }
                if (recoveryToken !== user.passwordRecoveryToken) {
                    return res.send({ message: "Token inválido" }).status(400);
                }
                if (!user.passwordRecoveryExpires || now > user.passwordRecoveryExpires) {
                    return res.send({ message: "Token expirado!" }).status(400);
                }
                const passwordHash = yield bcrypt_1.default.hash(newPassword, 10);
                yield UserModel_1.UserModel.findByIdAndUpdate(user.id, {
                    password: passwordHash,
                });
                res.send({ message: "Senha alterada com sucesso!" });
            }
            catch (err) {
                console.log(err);
                return res.status(500).send({ message: "Erro interno do servidor!" });
            }
        });
    }
}
exports.default = new AuthController();
