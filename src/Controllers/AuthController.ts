import { Request, Response } from "express";

import { UserModel } from "../Models/UserModel";

import bcrypt from "bcrypt";

class AuthController {
  async signIn() {}

  async signUp(req: Request, res: Response) {
    const { name, lastname, email, password } = req.body;

    if(!name || !lastname || !email || !password) {
        return res.send({message: "Preencha todos os campos!"}).status(403);
    }

    try {
        const emailsExists = await UserModel.findOne({email: email});
        if(emailsExists) {
            return res.send({message: "Email já registrado"}).status(403);
        }

        const passwordCript = await bcrypt.hash(password, 10);
        const userCreated = await UserModel.create({name, lastname, email, password: passwordCript})
        
        res.send({message: userCreated}).status(201)

    } catch (err) {
        console.log(err)
      res.status(500).send({ message: "Erro interno do servidor!" });
    }
  }
}

export default new AuthController();
