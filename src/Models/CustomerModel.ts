import { Schema, model } from "mongoose";
import { BillingAddress } from "../Schemas/BillingAddress";

const CustomerSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    role: {
        enum: ['customer', 'admin'],
        default: "customer",
        type: String,
        required: true,
    },
    lastname: {
        type: Schema.Types.String,
        required: true
    },
    profession: {
        type: String,
    },
    email: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    password: {
        type: Schema.Types.String,
        required: true,
        select: false
    },
    passwordRecoveryToken: {
        type: Schema.Types.String,
        select: false
    },
    passwordRecoveryExpires: {
        type: Date,
        select: false
    },
    phone: {
        type: Schema.Types.String,
    },
    photo: {
        type: Schema.Types.String
    },
    billingAddress: {
        type: BillingAddress
    },
    myFeedbacks: [
        {
            type: Schema.Types.ObjectId,
            ref: "Feedback"
        }
    ],
    myOrders: [
        {
            type: Schema.Types.ObjectId,
            ref: "Order"
        }
    ]
})

export const CustomerModel = model("Customer", CustomerSchema);
