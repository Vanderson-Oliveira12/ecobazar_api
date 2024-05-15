import mongoose, { Schema, model } from "mongoose";

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
})

export const CategoryModel = model('Category', CategorySchema);