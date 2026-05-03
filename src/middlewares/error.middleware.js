export function errorHandler(error, _req, res, _next) {
  console.error(error);

  res.status(error.statusCode ?? 500).json({
    status: 'error',
    message: error.message ?? 'Internal server error',
  });
}
