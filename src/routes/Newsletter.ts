import express ,{ Router } from "express";
import NewsletterController from "../Controllers/NewsletterController";
import { emailBodyRules } from "../middlewares/rules";
import { authAdminRouter } from "../middlewares/auth";
import { handleErrors } from "../middlewares/handleErrors";


export const NewsletterRoutes: Router = express.Router()

NewsletterRoutes.get("/newsletter", authAdminRouter ,NewsletterController.getAllEmails);
NewsletterRoutes.get("/newsletter/offers", authAdminRouter, NewsletterController.sendOffersByEmails);
NewsletterRoutes.post("/newsletter/register" , emailBodyRules, handleErrors, NewsletterController.registerEmailByNewsletter);
