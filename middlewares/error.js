const ErrorResponse = require('../utils/ErrorResponse');
const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message };
  // log error stack
  console.log(error);

  // Mongoose bad objectId
  if (err.name === 'CastError') {
    error = new ErrorResponse(`Bootcamp not found for id: ${err.value}`, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error = new ErrorResponse('Duplicate field value entered', 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((value) => value.message);
    error = new ErrorResponse(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || 'Server Error' });
};

module.exports = errorHandler;
