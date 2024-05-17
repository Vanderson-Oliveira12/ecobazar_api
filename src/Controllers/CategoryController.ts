import { Request, Response } from "express";
import path from "path";
import fs from "fs";

import { CategoryModel } from "../Models/CategoryModel";
import mongoose, { Schema, mongo } from "mongoose";

class CategoryController {

  constructor() { 
  }


  async listCategories(req: Request, res: Response) {
    try {
      const categories = await CategoryModel.find();
      const newCategories = categories.map(category => {
        return {
          ...category.toJSON(),
          image: `http://localhost:${process.env.PORT}/uploads/categories/${category.image}`
        }
      })

      res.json(newCategories);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }

  async createCategory(req: Request, res: Response) {
    const { name } = req.body;
    const fileName = req.file?.filename;

    if (!name || !fileName) {
      return res
        .status(400)
        .send({ message: "Campo nome e imagem obrigatórios!" });
    }

    try {
      const categoryExists = await CategoryModel.findOne({ name });

      if (categoryExists) {
        if(fs.existsSync(path.join(__dirname, "../", "uploads", 'categories', fileName))) {
          fs.unlinkSync(path.join(__dirname, "../", "uploads", 'categories', fileName));
        }

        return res.status(400).send({ message: "Esta categoria já existe!" });
      }

      const data = {
        name: name,
        image: req.file?.filename,
      };

      const category = await CategoryModel.create(data);

      res.status(201).json(category);
    } catch (err) {
      res.sendStatus(500);
    }
  }

  async updateCategory(req: Request, res: Response) {
    const { name } = req.body;
    const categoryId = req.params.categoryId;
    const isValidObjectId = mongoose.Types.ObjectId.isValid(categoryId);
    const fileName = req.file?.filename;

    if (!categoryId || !isValidObjectId) {
      return res.status(400).json({ message: "formato de ID inválido!" });
    }

    if (!name || !fileName) {
      return res
        .status(400)
        .json({ message: "Campo nome e imagem obrigatórios!" });
    }

    try {
      const category = await CategoryModel.findById(categoryId);

      if (!category) {
        return res.status(400).json({ message: "Essa categoria não existe!" });
      }

      if(fs.existsSync(path.join(__dirname, "../", "uploads", 'categories', category.image))) {
        fs.unlinkSync(path.join(__dirname, "../", "uploads", 'categories', category.image));
      }

      category.name = name;
      category.image = fileName;
      category.save();

      return res.json(category);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }

  async deleteCategory(req: Request, res: Response) {
    const categoryId = req.params.categoryId;

    if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "formato de ID inválido!" });
    }

    try {
      const categoryExists = await CategoryModel.findById(categoryId);

      if (!categoryExists) {
        return res.status(404).json({ message: "Essa categoria não existe!" });
      }

      await CategoryModel.findByIdAndDelete(categoryId);

      if(fs.existsSync(path.join(__dirname, "../", "uploads", 'categories', categoryExists.image))) {
        fs.unlinkSync(path.join(__dirname, "../", "uploads", 'categories', categoryExists.image))
      }

      res.send({ message: "Categoria excluída com sucesso!" });
    } catch (err) {
      console.log(err);
      res.status(500);
    }
  }
}

export default new CategoryController();
