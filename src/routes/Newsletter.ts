import express ,{ Router } from "express";
import NewsletterController from "../Controllers/NewsletterController";
import { emailBodyRules } from "../middlewares/emailValidator";


export const NewsletterRoutes: Router = express.Router()

NewsletterRoutes.get("/newsletter", NewsletterController.getAllEmails);
NewsletterRoutes.get("/newsletter/offers", NewsletterController.sendOffersByEmails);
NewsletterRoutes.post("/newsletter/register", emailBodyRules, NewsletterController.registerEmailByNewsletter);
