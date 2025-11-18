export function success(res, data = {}, statusCode = 200) {
  return res.status(statusCode).json({ status: "success", data });
}

export function error(res, message = "Something went wrong", statusCode = 400) {
  return res.status(statusCode).json({ status: "error", error: message });
}
