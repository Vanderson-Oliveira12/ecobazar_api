"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const BillingAddress = new mongoose_1.Schema({
    name: {
        type: mongoose_1.Schema.Types.String
    },
    lastname: {
        type: mongoose_1.Schema.Types.String
    },
    companyName: {
        type: mongoose_1.Schema.Types.String
    },
    street: {
        type: mongoose_1.Schema.Types.String
    },
    country: {
        type: mongoose_1.Schema.Types.String
    },
    zipcode: {
        type: mongoose_1.Schema.Types.String
    },
    email: {
        type: mongoose_1.Schema.Types.String
    },
    phone: {
        type: mongoose_1.Schema.Types.String
    }
});
const UserSchema = new mongoose_1.Schema({
    name: {
        type: mongoose_1.Schema.Types.String,
        required: true
    },
    lastname: {
        type: mongoose_1.Schema.Types.String,
        required: true
    },
    email: {
        type: mongoose_1.Schema.Types.String,
        required: true,
        unique: true
    },
    password: {
        type: mongoose_1.Schema.Types.String,
        required: true,
        select: false
    },
    passwordRecoveryToken: {
        type: mongoose_1.Schema.Types.String,
        select: false
    },
    passwordRecoveryExpires: {
        type: Date,
        select: false
    },
    phone: {
        type: mongoose_1.Schema.Types.String,
    },
    photo: {
        type: mongoose_1.Schema.Types.String
    },
    billingAddress: {
        type: BillingAddress
    }
});
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
