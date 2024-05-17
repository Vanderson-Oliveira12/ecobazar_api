import { Request, Response } from "express";
import mongoose from "mongoose";

import { ProductModel } from "../Models/ProductModel";
import { UserModel } from "../Models/UserModel";
import { FeedbackModel } from "../Models/FeedbackModel";

export class CustomerController {

   async setFeedbackCustomerInProduct(req: Request, res: Response) {
        
        const { productId, customerId } = req.params;
        const { feedback, avaliable } = req.body;
        const isValidId = mongoose.Types.ObjectId.isValid(productId) && mongoose.Types.ObjectId.isValid(customerId);

        if(!isValidId) {
            return res.status(400).send({message: "ID inválido!"});
        }

        if(!feedback) {
            return res.status(400).send({message: "Informe um feedback válido!"});
        }

        try {

            const feedbackCreated = await FeedbackModel.create({
                customer: customerId,
                product: productId,
                text: feedback,
                avaliable: avaliable ? avaliable : 1,
            })

            const customer = await UserModel.findById(customerId);
            const product = await ProductModel.findById(productId);

            if(!customer || !product) {
                return res.status(404).send({message: "Usuário ou produto não encontrado!"})
            }

            customer.myFeedbacks = [...customer.myFeedbacks, feedbackCreated.id];
            product.customersFeedback = [...product.customersFeedback, feedbackCreated.id];

            customer.save();
            product.save();
            res.send({message: "Feedback criado com sucesso!"});
        } catch(err) {
            console.log(err);
            return res.sendStatus(500);
        }
    }

    async getRandomFeedbacks(req: Request, res: Response) { 

        try {

            const feedbacks = await FeedbackModel.find().select("-__v -_id -product")
            .populate({path: "customer",
                populate: "name",
                select: "-_id name lastname profession",
            }).limit(6)

            if(!feedbacks.length) {
                return res.status(404).send({message: "Não existe feedbacks disponíveis!"})
            }

            res.json(feedbacks);
        } catch(err) {
            console.log(err);
            return res.sendStatus(500);
        }
    }
}

export default new CustomerController();