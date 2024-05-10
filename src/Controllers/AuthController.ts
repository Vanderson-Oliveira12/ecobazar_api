import { Request, Response } from "express";

import { UserModel } from "../Models/UserModel";

import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

class AuthController {
  async signIn(req: Request, res: Response) {
    const { email, password } = req.body;

    try { 

      if (!email || !password) {
        return res.send({ message: "Email e senha obrigatórios!" }).status(400);
      }

      const user = await UserModel.findOne({ email: email });

      if (!user) {
        return res
          .send({ message: "Não existe usuário com esse e-mail" })
          .status(401);
      }
  
      const passwordIsEqual = await bcrypt.compare(
        password,
        user.password
      );
  
      if (!passwordIsEqual) {
        return res.send({ message: "Usuário ou senha incorretos!" }).status(401);
      }
  
      const payload = sign(
        {
          id: user.id,
          email: user.email,
        },
        "chaveTeste",
        { expiresIn: 3600 }
      );
  
      res.send({ accessToken: payload }).status(200);
    }
    catch(err) {
      console.log("Erro signin")
      return res.send({message: "Erro interno, contate o suporte do sistema"}).status(500);
    }

   
  }

  async signUp(req: Request, res: Response) {
    const { name, lastname, email, password } = req.body;

    if (!name || !lastname || !email || !password) {
      return res.send({ message: "Preencha todos os campos!" }).status(403);
    }

    try {
      const emailsExists = await UserModel.findOne({ email: email });
      if (emailsExists) {
        return res.send({ message: "Email já registrado" }).status(403);
      }

      const passwordCript = await bcrypt.hash(password, 10);
      const userCreated = await UserModel.create({
        name,
        lastname,
        email,
        password: passwordCript,
      });

      res.send({ message: userCreated }).status(201);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Erro interno do servidor!"});
    }
  }
}

export default new AuthController();
