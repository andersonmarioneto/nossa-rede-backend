import { registerUser } from "./src/services/authService.js";

async function main() {
  try {
    const result = await registerUser("Anderson", "anderson@teste.com", "123456");
    console.log(result);
  } catch (err) {
    console.error("Erro ao registrar usuário:", err.message);
  }
}

main();
