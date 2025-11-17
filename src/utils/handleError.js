export function handleError(res, error) {
  console.error(error);
  return res.status(500).json({ error: "Erro interno do servidor." });
}