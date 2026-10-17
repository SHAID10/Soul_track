// Centralized error handler — any route that calls next(err) ends up here,
// so we get consistent error responses across the whole API.
function errorHandler(err, req, res, next) {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || "Something went wrong on the server",
  });
}

module.exports = errorHandler;