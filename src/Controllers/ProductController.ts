import { Request, Response } from "express";
import { ProductModel } from "../Models/ProductModel";
import mongoose from "mongoose";

class ProductController {
  async listAllProducts(req: Request, res: Response) {
    try {
      const products = await ProductModel.find().select("-__v")
      .populate({
        path: "category",
        select: "name -_id"
      })
      .populate({
        path: "customersFeedback",
        select: "-product -__v -_id",
        populate: {
          path: "customer",
          select: "name lastname profession -_id"
        }
      })

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

  async getProductById(req: Request, res: Response) {
    
    const { productId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).send({message: "Informe um Id válido!"});
    }
    
    try {

      const product = await ProductModel.findById(productId)
      .select("-__v")
      .populate({
        path: "category",
        select: "name -_id"
      })
      .populate({
        path: "customersFeedback",
        select: "-product -__v -_id",
        populate: {
          path: "customer",
          select: "name lastname profession -_id"
        }
      })

      if(!product) {
        return res.status(404).send({message: "Produto não encontrado!"})
      }


      return res.status(200).send(product);
      
    } catch(err) { 

      console.log(err)

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
            priceDescont: descontPercent ? this.calcDescont(price, descontPercent) : null,
            HasPromotion: descontPercent ? true : false,
            customersFeedback: customersFeedback ? customersFeedback : [],
            additionalInformation: additionalInformation ?? {},
            description: description
        })

      res.send(product);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }

  async updateProduct(req: Request, res: Response) {

    const { title, price, quantityInStock, images, videos, category, descontPercent, customersFeedback, additionalInformation, description} = req.body;

    const productId = req.params.productId;

    if(!productId || !mongoose.Types.ObjectId.isValid(productId)) { 
      return res.status(400).send({message: "Informe um Id válido!"})
    }

    try {

      const product = await ProductModel.findById(productId);

      if(!product) {
        return res.status(404).send({message: "Produto não encontrado!"})
      }

      if (title !== undefined) product.title = title;
      if (price !== undefined) product.price = price;
      if (quantityInStock !== undefined) product.quantityInStock = quantityInStock;
      if (images !== undefined) product.images = images;
      if (videos !== undefined) product.videos = videos;
      if (category !== undefined) product.category = category;
      if (customersFeedback !== undefined) product.customersFeedback = customersFeedback;
      if (additionalInformation !== undefined) product.additionalInformation = additionalInformation;
      if (description !== undefined) product.description = description;
      if (descontPercent !== undefined) {
        product.descontPercent = descontPercent;
        product.priceDescont = this.calcDescont(price, descontPercent);
        product.HasPromotion = true;
      } else {
        product.descontPercent = null;
        product.priceDescont = null;
        product.HasPromotion = false;
      }

      await product.save();
      return res.status(200).send(product);
    } catch(err) { 
      
      console.log(err)
      res.sendStatus(500);
    }

  }

  async deleteProduct(req: Request, res: Response) {
    
    const productId = req.params.productId;

    if(!productId || !mongoose.Types.ObjectId.isValid(productId)) { 
      return res.status(400).send({message: "Informe um Id válido!"})
    }

    try {

      const product = await ProductModel.findByIdAndDelete(productId);

      if(!product) {
        return res.status(404).send({message: "Produto não encontrado!"})
      }

      return res.status(200).send({message: "Produto deletado com sucesso!"});
    } catch(err) { 
      console.log(err)
      res.sendStatus(500);
    }

  }

  async getProductBySearch(req: Request, res: Response) { 

    const { value } = req.query;

    if (!value) {
      return res.status(400).json({ message: 'Valor da query é obrigatório' });
    }

    try {
      const products = await ProductModel.find({ title: { $regex: value, $options: 'i' } })

      if (products.length === 0) {
        return res.status(404).json({ message: 'Nenhum produto encontrado' });
      }

      res.status(200).send(products);
    } catch(err) { 
      console.log(err)
      res.sendStatus(500);
    }
  }

  async getProductsByPagination(req: Request, res: Response) { 

    const limit = Number(req.query.limit);
    const offset = Number(req.query.offset);

    if(!offset || !limit) {
      return res.status(400).json({message: "limit e offset obrigatórios!"})
    } 

    if(typeof limit != "number" || typeof offset != "number") { 
      return res.status(400).json({message: "limit e offset precisam ser números!"})
    }

    try {
      const products = await ProductModel.find()
      .skip((offset - 1) * limit)
      .limit(limit)
  
      const quantityProducts = await ProductModel.find().countDocuments();
  
      const totalPages = Math.ceil(quantityProducts / limit);
  
  
      res.send({message: {
        totalPages,
        products
      }});
    } catch(err) { 
      const error = err as Error;

      if(error.message) {
        return res.status(400).json({message: error.message})
      }

      return res.status(500).json({message: "Erro interno!"})
    }
  }

  calcDescont(price: number, descontPercent: number) {
    let priceOriginal = price;
    let priceDescont = (price * descontPercent) / 100;

    return Math.floor(priceOriginal - priceDescont);
  }
}

export default new ProductController();
