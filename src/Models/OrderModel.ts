import { model, Schema } from "mongoose";
import { BillingAddress } from "../Schemas/BillingAddress";

const OrderSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: "Customer"
    },
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
    },
    methodPayment: {
        type: String,
        enum: ['CREDIT-CARD', 'MONEY'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED", "CANCELLED", "PROCESSING"],
        default: "PENDING"
    },
    orderStatus: {
        enum: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
        type: String,
        required: true,
        default: "PENDING"
    },
    billingAddress: {
        type: BillingAddress,
        required: true
    },
}, {timestamps: {createdAt: true, updatedAt: false}})



export const OrderModel = model("Order", OrderSchema);