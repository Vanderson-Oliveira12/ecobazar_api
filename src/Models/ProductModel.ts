import { model, Schema } from "mongoose";

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        text: {
            type: String,
            required: true
        },
        benefits: [
            {
                type: String,
            }
        ]
    },
    price: {
        type: Number,
        required: true
    },
    priceDescont: {
        type: Number,
    },
    HasPromotion: {
        type: Boolean
    },
    descontPercent: {
        type: Number,
    },
    quantityInStock: {
        type: Number,
        required: true
    },
    additionalInformation: {
        weight: {
            type: Number,
        },
        color: {
            type: String,
        },
        avaliables: {
            type: Number
        },
        tags: [{
            type: String
        }]
    },
    images: [{
        type: String,
        required: true
    }],
    videos: [{
        type: String,
        required: true
    }],
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category"
    },
    customersFeedback: [{
        type: Schema.Types.ObjectId,
        ref: "Customer"
    }]
})

export const ProductModel = model("Product", productSchema)