import { Request, Response } from "express";
import { ProductModel } from "../Models/ProductModel";
import mongoose from "mongoose";

class ProductController {
  async listAllProducts(req: Request, res: Response) {
    try {
      const products = await ProductModel.find().populate("category")


      res.json(products);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }

  async listProductsByCategory(req: Request, res: Response) {
    const { categoryId } = req.params;

    if(!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({message: "Informe um id válido para a buscar por categoria!"})
    }

    try {

        const products = await ProductModel.find().where({category: categoryId}).populate("category")


      res.json(products);
    } catch (err) {
      res.sendStatus(500);
    }
  }

  async createProduct(req: Request, res: Response) {
    const { title, price, quantityInStock, images, videos, category, descontPercent, customersFeedback, additionalInformation, description} =
      req.body;

    if (
      !title ||
      !price ||
      !quantityInStock ||
      !images ||
      !videos ||
      !category
    ) {
      return res
        .status(400)
        .json({ message: "Preencha todos os campos obrigatórios!" });
    }

    try {

        const product = await ProductModel.create({
            title: title,
            price: price,
            quantityInStock: quantityInStock,
            images: images,
            videos: videos,
            category: category,
            descontPercent: descontPercent ?? null,
            priceDescont: descontPercent ? calcDescont(price, descontPercent) : null,
            HasPromotion: descontPercent ? true : false,
            customersFeedback: customersFeedback ? customersFeedback : [],
            additionalInformation: additionalInformation ?? {},
            description: description
        })

      function calcDescont(price: number, descontPercent: number) {
        let priceOriginal = price;
        let priceDescont = (price * descontPercent) / 100;

        return priceOriginal - priceDescont;
      }

      res.send(product);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }

  async updateProduct(req: Request, res: Response) {}

  async deleteProduct(req: Request, res: Response) {}
}

export default new ProductController();
