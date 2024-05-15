import { Request, Response } from "express";

import { CategoryModel } from "../Models/CategoryModel";

class CategoryController {
  async listCategories(req: Request, res: Response) {
    try {
      const categories = await CategoryModel.find();

      res.json(categories);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }

  }

  async createCategory(req: Request, res: Response) {

    try {

        const { name } = req.body;

        if(!name) {
          return res.send({message: "Campo nome obrigatório!"}).status(400)
        } 
        
        const categoryExists = await CategoryModel.findOne({ name });

        if(categoryExists) {
          return res.send({message: "Esta categoria já existe!"}).status(400);
        }

        const data = {
            name: name,
            image: req.file?.filename
        }

        const category = await CategoryModel.create(data);

        res.json(category);
    } catch(err) { 
        res.sendStatus(500);
    }
  }

  listProductByCategories() {
    
  }
}

export default new CategoryController();
