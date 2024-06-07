import { Request, Response } from "express";
import { CustomerModel } from "../Models/CustomerModel";
import mongoose, { ObjectId } from "mongoose";
import { ProductModel } from "../Models/ProductModel";

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

    async updateCostumer(req: Request, res: Response) { 

    }

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

    async saveProductFavoriteInCustomer(req: Request, res: Response) { 

        const customerId = req.params.customerId;
        const productId = req.params.productId;

        if(!mongoose.isValidObjectId(customerId)) {
            return res.status(400).json({message: "ID de usuário inválido!"})
        }

        if(!mongoose.isValidObjectId(productId)) { 
            return res.status(400).json({message: "Produto com ID inválido!"})
        }

        const customerIdObject = new mongoose.Types.ObjectId(customerId)
        const productIdObject = new mongoose.Types.ObjectId(productId)

        try {
            const customerExist = await CustomerModel.findById(customerIdObject);
            const productExist = await ProductModel.findById(productIdObject);

            if(!customerExist) {
                return res.status(404).json({message: "Não foi possível encontrar o usuário!"})
            } 

            if(!productExist) { 
                return res.status(404).json({message: "Não foi possível encontrar o produto"})
            }

            const currentCustomerProductsFavorites = customerExist.myProductsFavorites;
            const productIsExistingInFavoritesList = currentCustomerProductsFavorites.findIndex(productSavedId => productSavedId.toString() == productIdObject.toString());

            if(productIsExistingInFavoritesList != -1) {
                return res.status(400).json({message: "O produto já está salvo na lista de favoritos!"})
            }

            currentCustomerProductsFavorites.push(productIdObject)

            customerExist.myProductsFavorites = currentCustomerProductsFavorites;

            await customerExist.save();

            res.status(200).json({message: "Produto salvo na lista de favoritos com sucesso!"})
        } catch(err)  {
            const error = err as Error;

            if(error.message) { 
                return res.status(400).json({message: error.message})
            }

            return res.status(500).json({message: "Erro interno!"})
        }

    }

    async removeProductInFavoritesListCustomer(req: Request, res: Response) { 
        const customerId = req.params.customerId;
        const productId = req.params.productId;

        if(!mongoose.isValidObjectId(customerId)) {
            return res.status(400).json({message: "ID de usuário inválido!"})
        }

        if(!mongoose.isValidObjectId(productId)) { 
            return res.status(400).json({message: "Produto com ID inválido!"})
        }

        const customerIdObject = new mongoose.Types.ObjectId(customerId)
        const productIdObject = new mongoose.Types.ObjectId(productId)

        try {
            const customerExist = await CustomerModel.findById(customerIdObject);
            const productExist = await ProductModel.findById(productIdObject);

            if(!customerExist) {
                return res.status(404).json({message: "Não foi possível encontrar o usuário!"})
            } 

            if(!productExist) { 
                return res.status(404).json({message: "Não foi possível encontrar o produto"})
            }

            const currentListProductsFavorites = customerExist.myProductsFavorites;
            const productRemovedIndex = currentListProductsFavorites.findIndex(productId => productId.toString( )== productIdObject.toString())

            if(productRemovedIndex == -1) { 
                return res.status(404).json({message: "Produto não está na lista de favoritos!"})
            }

            currentListProductsFavorites.splice(productRemovedIndex, 1)

            customerExist.myProductsFavorites = currentListProductsFavorites;

            await customerExist.save();

            res.send({message: "Produto removido da lista de favoritos com sucesso!"})
        } catch(err)  {
            const error = err as Error;

            if(error.message) { 
                return res.status(400).json({message: error.message})
            }

            return res.status(500).json({message: "Erro interno!"})
        }
    }

}

export default new CostumerController();