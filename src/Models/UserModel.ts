import { Schema, model } from "mongoose";

const BillingAddress = new Schema({
    name: {
        type: Schema.Types.String
    },
    lastname: {
        type: Schema.Types.String
    },
    companyName: {
        type: Schema.Types.String
    },
    street: {
        type: Schema.Types.String
    },
    country: {
        type: Schema.Types.String
    },
    zipcode: {
        type: Schema.Types.String
    },
    email: {
        type: Schema.Types.String
    },
    phone: {
        type: Schema.Types.String
    }
})

const UserSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    lastname: {
        type: Schema.Types.String,
        required: true
    },
    email: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    phone: {
        type: Schema.Types.String,
    },
    photo: {
        type: Schema.Types.String
    },
    billingAddress: {
        type: BillingAddress
    }
})

export const UserModel = model("User", UserSchema);