import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken"


import {CustomJwtPayload} from "../interfaces/roles";

export function authUserInRoute(req: Request, res: Response, next: NextFunction) { 

    const { authorization } = req.headers;
    const token = authorization?.split(" ").pop();

    if(!authorization || !token) { 
        return res.status(401).json({message: "Token de autorização necessária, para acessar essa rota!"})
    } 

    if (!process.env.JWT_SECRET) {
        throw new Error("A chave JWT não está definida no ambiente!");
    }

    try { 
        const tokenDecoded = verify(token, process.env.JWT_SECRET) as CustomJwtPayload;
        const isAdmin = tokenDecoded.role != "admin" ? false : true;

        if(!isAdmin) {
            return res.status(401).json({message: "Apenas administradores possuem acesso a essas funcionalidades!"})
        }

        if(isAdmin && tokenDecoded) { 
            next();
        }

    } catch(err) { 
        const error = err as Error;

        if(error.message.includes('invalid')) {
            return res.status(401).json({message: "O token fornecido não é válido!"})
        } 
        
        if(error.message.includes("expired")) { 
            return res.status(401).json({message: "Token expirado"})
        }

        return res.status(500).json({ message: "Erro ao verificar o token" });
    }

}