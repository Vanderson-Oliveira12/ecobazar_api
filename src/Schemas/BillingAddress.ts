import { Schema } from "mongoose";


export const BillingAddress = new Schema({
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