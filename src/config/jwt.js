//export const jwtSecret = "MINHA_CHAVE_SECRETA_SUPER_SEGURA";
// new key
export const jwtSecret = process.env.JWT_SECRET || "dev_secret";