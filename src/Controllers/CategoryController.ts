import { Request, Response } from "express";
import path from "path";
import fs from "fs";

import { CategoryModel } from "../Models/CategoryModel";
import mongoose, { Schema, mongo } from "mongoose";

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
        const fileName = req.file?.filename;
        
        if(!name || !fileName) {
          return res.send({message: "Campo nome e imagem obrigatórios!"}).status(400)
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

  async updateCategory(req: Request, res: Response) { 

    try {
      const { name } = req.body;
      const categoryId = req.params.categoryId;
      const isValidObjectId = mongoose.Types.ObjectId.isValid(categoryId);
      const fileName = req.file?.filename;

      if(!categoryId || !isValidObjectId) {
        return res.json({message: "formato de ID inválido!"}).status(400);
      }

      const category = await CategoryModel.findById(categoryId);

      if(!category) {
        return res.json({message: "Essa categoria não existe!"}).status(400);
      }

      if(!name || !fileName) {
        return res.json({message: "Campo nome e imagem obrigatórios!"}).status(400);
      }

      fs.unlink(path.join(__dirname, '../', 'uploads', category.image), (err) => {
        console.log(err)
      })

      category.name = name;
      category.image = fileName;

      category.save();

      return res.json(category);
    } catch(err) { 
      console.log(err);
      res.sendStatus(500);
    }
  }

  async deleteCategory(req: Request, res: Response) { 

    try {

      const categoryId = req.params.categoryId;

      if(!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.json({message: "formato de ID inválido!"}).status(400);
      }

      const categoryExists = await CategoryModel.findById(categoryId);

      if(!categoryExists) {
        return res.json({message: "Essa categoria não existe!"}).status(404);
      }

      await CategoryModel.findByIdAndDelete(categoryId);
      fs.unlink(path.join(__dirname, "../", 'uploads', categoryExists.image), (err) => {
        console.log(err)
      })

      res.send({message: "Categoria excluída com sucesso!"})
    } catch(err) {
      console.log(err)
      res.status(500);
    }

  }

}

export default new CategoryController();
