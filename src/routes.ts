import express ,{ Router, Request, Response } from "express";
import AuthController from "./Controllers/AuthController";

export const routes: Router = express.Router();

routes.get("/auth/signin", AuthController.signIn);
routes.post("/auth/signup", AuthController.signUp);
routes.get("/auth/recoveryPassword", AuthController.recoveryPassword);
routes.post("/auth/createNewPassword", AuthController.createNewPassword);