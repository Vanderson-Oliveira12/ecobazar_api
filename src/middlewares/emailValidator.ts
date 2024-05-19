import { body } from "express-validator";

export const emailBodyRules = [
    body("email", "Email obrigatório").exists().notEmpty(),
    body("email", "Formato de e-mail inválido").isEmail(),
    body("email", "O e-mail deve ter pelo menos 5 caracteres").isLength({min: 5}),
    body("email", "O e-mail deve ter no máximo 100 caracteres").isLength({ max: 100 }),
    body("email").normalizeEmail()
]