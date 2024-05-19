import { Schema, model } from "mongoose";


const NewsletterSchema = new Schema({
    email: {
        type: String,
        required: true
    }
})

export const NewsletterModel = model("Newsletter", NewsletterSchema);