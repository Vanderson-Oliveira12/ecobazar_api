import { Request, Response } from "express";
import { sendEmail } from "../services/sendMail";

import { CustomerModel } from "../Models/CustomerModel";

import crypto from "crypto";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

class AuthController {
  async signIn(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!process.env.JWT_SECRET) {
      throw new Error("A chave JWT não está definida no ambiente!");
    }

    if (!email || !password) {
      return res.send({ message: "Email e senha obrigatórios!" }).status(400);
    }

    try {
      const user = await CustomerModel.findOne({ email: email }).select(
        "+password"
      );

      if (!user) {
        return res
          .status(401)
          .send({ message: "Não existe usuário com esse e-mail" });
      }

      const passwordIsEqual = await bcrypt.compare(password, user.password);

      if (!passwordIsEqual) {
        return res
          .send({ message: "Usuário ou senha incorretos!" })
          .status(401);
      }

      const payload = sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: 3600 }
      );

      res.send({ accessToken: "Bearer " + payload }).status(200);
    } catch (err) {
      console.log(err);
      return res
        .send({ message: "Erro interno, contate o suporte do sistema" })
        .status(500);
    }
  }

  async signUp(req: Request, res: Response) {
    const { name, lastname, email, password } = req.body;

    if (!name || !lastname || !email || !password) {
      return res.send({ message: "Preencha todos os campos!" }).status(403);
    }

    try {
      const emailsExists = await CustomerModel.findOne({ email: email });
      if (emailsExists) {
        return res.send({ message: "Email já registrado" }).status(403);
      }

      const passwordCript = await bcrypt.hash(password, 10);
      const userCreated = await CustomerModel.create({
        name,
        lastname,
        email,
        password: passwordCript,
      });

      res.send({ message: "Usuário registrado com sucesso!" }).status(201);
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: "Erro interno do servidor!" });
    }
  }

  async recoveryPassword(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
      return res.send({ message: "Informe um email" }).status(400);
    }

    try {
      const user = await CustomerModel.findOne({ email: email });

      if (!user) {
        return res
          .send({ message: "Usuário com esse e-mail não encontrado" })
          .status(400);
      }

      const recoveryToken = crypto.randomBytes(32).toString("hex");
      const expires = new Date();
      expires.setMinutes(expires.getMinutes() + 5);

      await CustomerModel.findByIdAndUpdate(user.id, {
        passwordRecoveryToken: recoveryToken,
        passwordRecoveryExpires: expires,
      });

      await sendEmail("Recuperação de conta", "Texto de recuperação", email);

      return res.send({
        message: "Foi enviado um link de recuperação, para o email registrado!",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: "Erro interno do servidor!" });
    }
  }

  async createNewPassword(req: Request, res: Response) {
    const { email, recoveryToken, newPassword, newPasswordConfirm } = req.body;
    const now = new Date();

    if (!email || !recoveryToken || !newPassword || !newPasswordConfirm) {
      return res
        .send({ message: "Campos obrigatórios não foram informados!" })
        .status(400);
    }

    try {
      const user = await CustomerModel.findOne({ email }).select(
        "+passwordRecoveryToken passwordRecoveryExpires"
      );

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

      const passwordHash = await bcrypt.hash(newPassword, 10);

      await CustomerModel.findByIdAndUpdate(user.id, {
        password: passwordHash,
      });

      res.send({ message: "Senha alterada com sucesso!" });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: "Erro interno do servidor!" });
    }
  }
}

export default new AuthController();
