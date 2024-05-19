import { Response, Request } from "express";
import { validationResult } from "express-validator";
import { NewsletterModel } from "../Models/NewsletterMode";
import { sendEmail } from "../services/sendMail";

class NewsletterController {


    async registerEmailByNewsletter(req: Request, res: Response) { 
        const { email } = req.body;
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }

        try {
            const isEmailRegistered = await NewsletterModel.findOne({email});

            if(isEmailRegistered) { 
                return res.status(400).json({message: "E-mail já registrado!"})
            }

            await NewsletterModel.create({email});

            return res.status(200).json({message: "E-mail registrado com sucesso!"})
        } catch(err) { 
            console.log(err)
            return res.sendStatus(500);
        }

    }
    
    async sendOffersByEmails(req: Request, res: Response) { 


        try {

            const emailsSearched = await NewsletterModel.find().select("email -_id");


            if(emailsSearched.length) { 
                let emails = emailsSearched.map(emailRecord  => emailRecord .email);
                const sendInfor = await sendEmail("Promoção", "teste", emails, `
                    <h1>Mega promoção de lançamento</h1><br>
                    <img src="https://t4.ftcdn.net/jpg/05/41/78/53/360_F_541785379_ikJL4EbCOX1fpmz81T29CxvJHRkrcEtp.jpg" />
                `)
                return res.status(200).json({message: "Emails enviados com sucesso!"})
            } else { 
                return res.status(400).json({message: "Você não tem e-mails registrados para enviar ofertas!"})
            }

        } catch(err) { 
            console.log(err);
            return res.sendStatus(500);
        }
    }

    async getAllEmails(req: Request, res: Response) { 

        try {

            const emails = await NewsletterModel.find().select("email -_id");

            return res.json(emails);
        } catch(err) { 
            console.log(err);
            return res.sendStatus(500);
        }
    }


}


export default new NewsletterController();