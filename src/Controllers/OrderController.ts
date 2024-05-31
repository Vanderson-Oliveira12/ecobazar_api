import { Request, Response } from "express";
import { CustomerModel } from "../Models/CustomerModel";
import { ProductModel } from "../Models/ProductModel";
import { OrderModel } from "../Models/OrderModel";
import mongoose, { model } from "mongoose";

interface ProductInfo {
    productId: string;
    price: number;
    quantity: number;
}

class OrderController {

  async getAllOrders(req: Request, res: Response) { 
    try { 
      
      const orders = await OrderModel.find().populate({
        path: "customer",
        select: "-myFeedbacks -myOrders -__v -role",
      }).populate({
        path: "products",
        populate: {
          path: "product"
        }
      })

      return res.status(200).json(orders);
    } catch(err) {
      console.log(err)
      res.sendStatus(500);
    }
  }

  async getOrdersByStatus(req: Request, res: Response) { 

    const { value } = req.query;
    const statusValid = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]

    const isStatusValid = statusValid.findIndex(status => status == value);

    if(isStatusValid == -1) { 
      return res.status(400).json({message: "Informe valores de status válido! " + statusValid})
    }


    try {

      const orders = await OrderModel.find().where({orderStatus: value})
      .populate({
        path: "customer",
        select: "-myFeedbacks -myOrders -__v -role"
      })
      .populate({
        path: "products",
        populate: {
          path: "product",
          select: "-__v"
        }
      })

      res.status(200).json(orders)

    } catch(err) {
      console.log(err)
      res.sendStatus(500);
    }
  }


  async createOrder(req: Request, res: Response) {
    const body = req.body;
    const { customer: customerId, products: productsId } = req.body;

    const addressInfor = {
      methodPayment: body.methodPayment,
      paymentStatus: body.paymentStatus,
      orderStatus: body.orderStatus,
      billingAddress: {
        street: body.billingAddress.street,
        city: body.billingAddress.city,
        state: body.billingAddress.state,
        zip: body.billingAddress.zip,
        country: body.billingAddress.country,
      },
    };

    if(!addressInfor.methodPayment ||
        !addressInfor.paymentStatus ||
        !addressInfor.orderStatus ||
        !addressInfor.billingAddress.street ||
        !addressInfor.billingAddress.city ||
        !addressInfor.billingAddress.state ||
        !addressInfor.billingAddress.zip ||
        !addressInfor.billingAddress.country
    ) {
        return res.status(400).json({message: "Preencha todas informações de localidade e métodos de pagamento!"})
    }

    if (!Array.isArray(productsId) || productsId.length === 0) {
      return res
        .status(400)
        .json({ message: "Lista de produtos inválida ou vazia" });
    }

    try {
      const isUserExists = await CustomerModel.findById(customerId);

      if (!isUserExists) {
        return res.status(404).json({ message: "Esse usuário não existe!" });
      }

      const products: ProductInfo[] = await Promise.all(
        productsId.map(async (product: any) => {
          const productId = product.product;
          const isProductExists = await ProductModel.findById(productId);

          if (!isProductExists) {
            throw new Error(`Produto com id ${productId} não existe.`);
          }

          const quantityProductInStock = isProductExists.quantityInStock;
          const productPrice = isProductExists.priceDescont
            ? isProductExists.priceDescont
            : isProductExists.price;

          if (quantityProductInStock <= 0) {
            throw new Error(`O produto ${isProductExists.title} não possui quantidade em estoque!`);
          }

          return {
            productId: isProductExists._id.toString(),
            price: productPrice,
            quantity: product.quantity,
          };
        })
      );

      const totalProductsPrice = products.reduce((acc, product) => {
        return acc + (product.price * product.quantity)
      }, 0)


      const data = {
        customer: customerId,
        products: [...products].map(product => ({product: product.productId, quantity: product.quantity})),
        totalPrice: totalProductsPrice,
        ...addressInfor
      }

       await OrderModel.create(data);
    
       return res.status(201).json({ message: "Pedido criado com sucesso!" });
    } catch (err) {
        const error = err as Error;
        console.error(error);
        if (error.message.startsWith('Produto com id')) {
          return res.status(400).json({ message: error.message });
        }
        if (error.message.startsWith('O produto')) {
          return res.status(404).json({ message: error.message });
        }
        return res.sendStatus(500);
      }
    }

    async getOrderById(req: Request, res: Response) { 
      const { orderId } = req.params;

      if(!mongoose.isValidObjectId(orderId)) { 
        return res.status(400).json({message: "O id fornecido não é válido!"})
      }

      try { 

        const orderExisting = await OrderModel.findById(orderId)
        .populate({
          path: "customer",
          select: "-role -myFeedbacks -myOrders -__v"
        })
        .populate({
          path: "products",
          populate: "product"
        })

        if(!orderExisting) { 
          return res.status(404).json({message: "A ordem solicitada não foi encontrada."})
        }

        return res.status(200).json(orderExisting);
      } catch(err) { 
        const error = err as Error;

        console.log(error.message)
        return res.status(500).json({message: "Erro interno do servidor!"})
      }

    }
    
    async getOrdersByUser(req: Request, res: Response) { 
      
      const { costumerId } = req.params;

      if(!mongoose.isValidObjectId(costumerId)) {
        return res.status(400).json({message: "O Id fornecido não é válido!"})
      }

      try {

        const userExisting = await CustomerModel.findById(costumerId);

        if(!userExisting) { 
          return res.status(404).json({message: "Usuário não encontrado!"})
        }

        const userOrders = await OrderModel.find().where({ customer: userExisting.id })
        .populate({
          path: "customer",
          select: "-__v -role -myFeedbacks -myOrders"
        })
        .populate({
          path: "products",
          populate: "product"
        })

        if(!userOrders.length) { 
          return res.status(404).json({message: "O usuário não possui orders!"})
        }

        return res.status(200).json(userOrders);
      } catch(err) {
        const error = err as Error
        console.log(error.message)
        return res.status(500).json({message: "Erro interno"})
      }
    }
  }

export default new OrderController();
