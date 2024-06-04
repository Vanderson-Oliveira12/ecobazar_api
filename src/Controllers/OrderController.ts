import { Request, Response } from "express";
import { CustomerModel } from "../Models/CustomerModel";
import { ProductModel } from "../Models/ProductModel";
import { OrderModel } from "../Models/OrderModel";
import mongoose, { model } from "mongoose";
import { OrderStatus } from "../interfaces/orderStatus";
import { PaymentStatus } from "../interfaces/paymentStatus";
import { validationResult } from "express-validator";
import { roundToTwoDecimals } from "../utils/roundNumber";

interface Product {
  productId: string, 
  quantity: number
}

interface ProductInfo extends Product {
    price: number;
}

interface Order {
    methodPayment: string;
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
    billingAddress: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
      }
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
    const { customerId, products: productsId } = req.body;

    const orderInfor: Order = {
      methodPayment: body.methodPayment,
      paymentStatus: "PENDING" as PaymentStatus,
      orderStatus: "PENDING" as OrderStatus,
      billingAddress: {
        street: body.billingAddress.street,
        city: body.billingAddress.city,
        state: body.billingAddress.state,
        zip: body.billingAddress.zip,
        country: body.billingAddress.country,
      },
    };


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

      const productsPurchased: ProductInfo[] = await Promise.all(
        productsId.map(async (productItem: any) => {
          const productId = productItem.product;

          if(!mongoose.isValidObjectId(productId)) {
            throw new Error("o Id do produto é inválido!")
          }

          const product = await ProductModel.findById(productId);

          if (!product) {
            throw new Error(`Produto com id ${productId} não existe.`);
          }

          const currentQuantityProductInStock = product.quantityInStock;
          const quantityProductCustomerPurchase = productItem.quantity;
          const hasProductInStock = product.quantityInStock > 0;
          const productPrice = product.priceDescont
            ? product.priceDescont
            : product.price;

          if (!hasProductInStock) {
            throw new Error(`O produto ${product.title} não possui quantidade em estoque!`);
          }

          if(quantityProductCustomerPurchase > currentQuantityProductInStock) { 
            throw new Error(`O Produto ${product.title} não possui a quantidade disponível para compra!`)
          }

          const newQuantityProductInStock = currentQuantityProductInStock - quantityProductCustomerPurchase; 

          product.quantityInStock = newQuantityProductInStock;

          product.save();

          return {
            productId: product._id.toString(),
            price: productPrice,
            quantity: quantityProductCustomerPurchase,
          };
        })
      );

      const totalProductsPrice = productsPurchased.reduce((acc, product) => {
        return roundToTwoDecimals(acc + (product.price  * product.quantity))
      }, 0)

      const data = {
        customer: customerId,
        products: [...productsPurchased].map(product => ({product: product.productId, quantity: product.quantity})),
        totalPrice: totalProductsPrice,
        ...orderInfor
      }

       const orderCreated = await OrderModel.create(data);
    
       return res.status(201).json({ message: "Pedido criado com sucesso!"});
    } catch (err) {
        const error = err as Error;
        
        if(error.message) {
          return res.status(400).json({message: error.message})
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

        if(error.message) { 
          return res.status(400).json({message: error.message})
        }

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


    async changePaymentStatusForOrder(req: Request, res: Response) { 

      const {orderId} = req.params;
      const { newStatusPayment } = req.body;
      const statusPaymentValid: PaymentStatus[] = ["CANCELLED", "PENDING", "PROCESSING", "APPROVED", "REJECTED"];

      if(!mongoose.isValidObjectId(orderId)) { 
        return res.status(400).json({message: "Tipo de id não permitido!"})
      }

      if(!newStatusPayment || !statusPaymentValid.includes(newStatusPayment)) { 
        return res.status(400).json({message: "Valor de order não informado, ou valor informado inválido "+ statusPaymentValid})
      }

      try { 
        const orderExisting = await OrderModel.findById(orderId);

        if(!orderExisting) {
          return res.status(404).json({message: "Order não existente!"})
        }

        orderExisting.paymentStatus = newStatusPayment;

        await orderExisting.save();

        return res.status(200).json({message: "Status de pagamento alterado com sucesso! " + orderExisting.paymentStatus})

      } catch(err) {
        const error = err as Error;

        console.log(error.message)

        return res.status(500).json({message: "Erro interno!"})
      }
    }

    async changeOrderStatus(req: Request, res: Response) { 

      const {orderId} = req.params;
      const newOrderStatus = req.body.newOrderStatus as OrderStatus;
      
      const orderStatusValid: OrderStatus[] = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

      if(!orderId || !mongoose.isValidObjectId(orderId)) {
        return res.status(400).json({message: "ID inválido ou não fornecido!"})
      }

      if(!newOrderStatus || !orderStatusValid.includes(newOrderStatus)) { 
        return res.status(400).json({message: "Status fornecido não é válido. "+ orderStatusValid})
      }

      try { 

        const orderExisting = await OrderModel.findById(orderId);

        if(!orderExisting) {
          return res.status(404).json({message: "Order não encontrada!"})
        }

        const orderStatusPayment: PaymentStatus = orderExisting.paymentStatus;
        const isPaymentApproved = orderStatusPayment == 'APPROVED';
        const currentStatusOrder = orderExisting.orderStatus;

        if(!isPaymentApproved && (newOrderStatus == 'SHIPPED' || newOrderStatus == 'DELIVERED')) { 
          return res.status(400).json({message: "Pagamento não aprovado, você não pode usar o STATUS SHIPPED OU DELIVERED"})
        }

        if(newOrderStatus == 'SHIPPED') {
          const products: Product[] = orderExisting.products.map((product) => ({
            productId: product.product.toString(),
            quantity: product.quantity
          }))

          const productsPurchased = await this.getProductInStock(products);

          return res.status(200).json({message: "Compra efetuada com sucesso!"})
        }

        const isCancelStatus = (currentStatusOrder == "PENDING" || currentStatusOrder == "PROCESSING") && newOrderStatus == 'CANCELLED';

        if(isCancelStatus) { 
          const products: Product[] = orderExisting.products.map(product => ({
            productId: product.product.toString(),
            quantity: product.quantity
          }))

          const productsCancelled = await this.cancelProductAndSetInStock(products);

          return res.status(200).json({message: "Compra cancelada com sucesso!"})
        }


      } catch(err) {
        const error = err as Error;
        return res.status(500).json({message: error.message || "Erro interno!"})
      }
    }

    private async getProductInStock(products: Product[]) { 
      const isProductIdValid = products.every((product) => mongoose.isValidObjectId(product.productId));

      if(!isProductIdValid) { 
        throw new Error("Produto com id inválido!")
      }

      try { 
          const productsExisting = await Promise.all(products.map(async productItem => {
          const product = await ProductModel.findById(productItem.productId);
          const quantityPurchased = productItem.quantity;

          if(!product) { 
            throw new Error("Produto não encontrado!");
          }

          const hasProductInStock = product.quantityInStock > 0;

          if(!hasProductInStock) { 
            throw new Error("Produto sem quantidade em estoque!");
          }

          const newQuantityInStock = product.quantityInStock - quantityPurchased;

          product.quantityInStock = newQuantityInStock;

          product.save();

          return product;
        }))

        return productsExisting;
      } catch(err) {
        const error = err as Error;
        throw new Error(error.message);
      }
    }

    private async cancelProductAndSetInStock(products: Product[]) {
      
      const isProductIdValid = products.every((product => !mongoose.isValidObjectId(product.productId)));

      if(isProductIdValid) { 
        throw new Error("Produto com id inválido!")
      }

      try {

        const productsCancelled = await Promise.all(products.map(async (productItem) => {
          const productExisting = await ProductModel.findById(productItem.productId);
          const productQuantity = productItem.quantity;

          if(!productExisting) { 
            throw new Error("Produto não encontrado!");
          }

          const newProductQuantityInStock = productExisting.quantityInStock + productQuantity;

          productExisting.quantityInStock = newProductQuantityInStock;

          productExisting.save();

          return productExisting;
        }))

        return productsCancelled;
      } catch(err) { 
        const error = err as Error;

        throw new Error(error.message);
      }
    }

  }


export default new OrderController();
