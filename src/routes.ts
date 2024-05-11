import express , { Router, Request, Response } from "express";

import AuthController from "./Controllers/AuthController";
import CategoryController from "./Controllers/CategoryController";
import { uploads } from "./middlewares/uploads";

export const routes: Router = express.Router();



routes.get("/auth/signin", AuthController.signIn);
routes.post("/auth/signup", AuthController.signUp);
routes.get("/auth/recoveryPassword", AuthController.recoveryPassword);
routes.post("/auth/createNewPassword", AuthController.createNewPassword);

/* Categories */

routes.get("/categories", CategoryController.listCategories);
routes.post("/categories/create", uploads.single('image') ,CategoryController.createCategory);