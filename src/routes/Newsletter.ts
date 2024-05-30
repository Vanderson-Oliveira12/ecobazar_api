import express ,{ Router } from "express";
import NewsletterController from "../Controllers/NewsletterController";
import { emailBodyRules } from "../middlewares/emailValidator";
import { authUserInRoute } from "../middlewares/auth";


export const NewsletterRoutes: Router = express.Router()

NewsletterRoutes.get("/newsletter", authUserInRoute ,NewsletterController.getAllEmails);
NewsletterRoutes.get("/newsletter/offers", authUserInRoute, NewsletterController.sendOffersByEmails);
NewsletterRoutes.post("/newsletter/register",authUserInRoute , emailBodyRules, NewsletterController.registerEmailByNewsletter);
