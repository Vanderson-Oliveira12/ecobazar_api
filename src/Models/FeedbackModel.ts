import { model, Schema } from "mongoose";

const FeedbackSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product"
    },
    text: {
        type: String,
        required: true
    },
    avaliable: {
        type: Number,
        enum: [1, 2 , 3, 4, 5],
        default: 1
    },
}, {timestamps: {updatedAt: false, createdAt: true}})


export const FeedbackModel = model("Feedback", FeedbackSchema)