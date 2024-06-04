import { body,  } from "express-validator";


export const emailBodyRules = [
    body("email", "Email obrigatório").exists().notEmpty(),
    body("email", "Formato de e-mail inválido").isEmail(),
    body("email", "O e-mail deve ter pelo menos 5 caracteres").isLength({min: 5}),
    body("email", "O e-mail deve ter no máximo 100 caracteres").isLength({ max: 100 }),
    body("email").normalizeEmail()
]

export const orderBodyRules = [
    body("customerId", "Usuário ID obrigatório").exists().notEmpty().trim().escape(),
    body("methodPayment", "Método de pagamento obrigatório").exists().notEmpty().trim().escape(),
    body("billingAddress", "Informações de endereço obrigatório").exists().notEmpty().trim().escape(),
    body("billingAddress.street", "Rua obrigatória").exists().notEmpty().trim().escape(),
    body("billingAddress.city", "Cidade obrigatória").exists().notEmpty().trim().escape(),
    body("billingAddress.state", "Estado obrigatório").exists().notEmpty().trim().escape(),
    body("billingAddress.zip", "Código postal obrigatório").exists().notEmpty().trim().escape(),
    body("billingAddress.country", "País obrigatório").exists().notEmpty().trim().escape(),
]