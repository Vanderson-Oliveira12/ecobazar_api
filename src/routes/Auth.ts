import express, { Router } from "express"
import AuthController from "../Controllers/AuthController";


export const AuthRoutes: Router = express.Router();

AuthRoutes.get("/auth/signin", AuthController.signIn);
AuthRoutes.post("/auth/signup", AuthController.signUp);
AuthRoutes.get("/auth/recoveryPassword", AuthController.recoveryPassword);
AuthRoutes.post("/auth/createNewPassword", AuthController.createNewPassword);