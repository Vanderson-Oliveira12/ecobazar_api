import { Request, Response } from "express";
import { sendEmail } from "../services/sendMail";

import { CustomerModel } from "../Models/CustomerModel";

import crypto from "crypto";
import bcrypt from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { CustomJwtPayload } from "../interfaces/roles";

class AuthController {
  async signIn(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
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

      const accessToken = sign(
        {
          id: user.id,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '15min' }
      );

      const refreshToken = sign({
        id: user.id,
        email: user.email,
        role: user.role
      }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d'})

      const data = {
        accessToken: "Bearer "+ accessToken,
        refreshToken
      }

      res.send(data).status(200);
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
      await CustomerModel.create({
        name,
        lastname,
        email,
        password: passwordCript,
      });

      res.status(201).send({ message: "Usuário registrado com sucesso!" });
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

  async getRefreshToken(req: Request, res: Response) { 

    const accessToken = req.headers['authorization'];
    const refreshToken = req.headers['refresh-token'] as string;

    if(!accessToken || !refreshToken) {
      return res.status(403).json({message: "Token e refresh token obrigatório!"})
    }

    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error("A chave JWT não está definida no ambiente!");
    }

    try {
      const refreshTokenDecoded = verify(refreshToken, process.env.JWT_REFRESH_SECRET) as CustomJwtPayload;
      const accessTokenDecoded = verify(accessToken, process.env.JWT_SECRET, {
        ignoreExpiration: true
      }) as CustomJwtPayload

      if(accessTokenDecoded.id != refreshTokenDecoded.id) {
        return res.status(401).json({message: "O refresh token não pertence ao usuário fornecido!"})
      }

      const user = await CustomerModel.findById(accessTokenDecoded.id);

      if(!user) {
        return res.status(404).json({message: "Usuário não encontrado, para gerar o access-token"})
      }

      const newAccessToken = sign(
        {
          id: user._id,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '15min' }
      );

      const data = {
        accessToken: "Bearer "+ newAccessToken,
        refreshToken
      }

      res.status(200).json(data)

    } catch(err) {
      const error = err as Error;

      if(error.message.includes('invalid')) {
        return res.status(401).json({message: "token ou refresh token fornecido não é válido!"})
      } 
    
      if(error.message.includes("expired")) { 
          return res.status(401).json({message: "refresh token expirado"})
      }

      return res.status(500).json({message: "Erro interno!"});
    }
  }

}

export default new AuthController();
