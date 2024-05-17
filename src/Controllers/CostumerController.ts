import { Request, Response } from "express";
import { CustomerModel } from "../Models/CustomerModel";
import mongoose from "mongoose";

class CostumerController {


    async getAllCostumers(req: Request, res: Response) { 

        try {
            const customers = await CustomerModel.find();

           return res.json(customers);
        } catch(err) {
           return res.sendStatus(500);
        }
    }
    
    async getCostumerById(req: Request, res: Response) {

        const {customerId} = req.params;

        if(!mongoose.Types.ObjectId.isValid(customerId)) {
            return res.status(400).send({message: "Informe um ID válido!"})
        }

        try {

            const customer = await CustomerModel.findById(customerId);

            if(!customer) { 
                return res.status(404).send({message: "Usuário não encontrado!"})
            }

            return res.json(customer)
        } catch(err) { 
            console.log(err);
            return res.sendStatus(500);
        }
     }

    async updateCostumer(req: Request, res: Response) { }

    async deleteCostumer(req: Request, res: Response) { 
        const {customerId} = req.params;

        if(!mongoose.Types.ObjectId.isValid(customerId)) {
            return res.status(400).send({message: "Informe um ID válido!"})
        }

        try {

            const customer = await CustomerModel.findByIdAndDelete(customerId);

            if(!customer) { 
                return res.status(404).send({message: "Usuário não encontrado!"})
            }

            return res.json({message: "Usuário deletado com sucesso!"})
        } catch(err) { 
            console.log(err);
            return res.sendStatus(500);
        }
    }

}

export default new CostumerController();