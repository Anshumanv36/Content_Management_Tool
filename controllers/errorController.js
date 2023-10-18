/*eslint-disable*/
//This is The GlobalErrorHandler Middleware
//Simply import this in any module and use it...
const AppError = require('../utils/appError');

//-------------------------------------------------------------------------------------------
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.keyValue.name;
  // console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('/ ')}`;
  return new AppError(message, 400);
};

//Both the errors while verifying the JWT
const handleJsonWebTokenError = err => new AppError("Invalid token Please Login again !!",401)

const handleTokenExpiredError = err=> new AppError("Token Expired Please Login again !!",401)
//-------------------------------------------------------------------------------------------
const sendErrorDev = (err,req,res) => {
  //Error handling for the API
  if(req.originalUrl.startsWith('/api')){  
    res.status(err.statusCode).json({
      status: err.status,
      error:err,
      message: err.message,
      stack: err.stack
    });
  }else{  //Error handling for the RENDERED WEBSITE
    res.status(err.statusCode).render('error',{
      title:"Something Went Wrong !",
      msg : err.message
    })
  }
};

const sendErrorProd = (err, req, res) => {
  //---------------->>API PART<<---------------------------
  if(req.originalUrl.startsWith('/api')){ 
      // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      error:err,
      message: err.message,
    });

  // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
  } //--------------------->>WEBSITE PART<<----------------------------
  else{
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).render('error',{
      title:"Something Went Wrong !",
      msg:err.message
    })

  // Programming or other unknown error: don't leak error details
  }else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(err.statusCode).render('error',{
      title:"Something Went Wrong !",
      msg:"Please try again !!"
    })
  }
  }
};

module.exports = (error, req, res, next) => {
  // console.log(err.stack);
  //Sometimes some internal node errors may not have a status code 
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error,req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // console.log(err.message)
    // //Creating a new error object using err and Object Destructuring
    // let error = { ...err };
    // console.log(error)
    if (error.kind === 'ObjectId') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error._message === 'Validation failed') error = handleValidationErrorDB(error);
    //JWT Verification Errors
    if(error.name === "JsonWebTokenError") error = handleJsonWebTokenError(error)
    if(error.name === "TokenExpiredError") error = handleTokenExpiredError(error)
    sendErrorProd(error,req, res);
  }
};

//Seperating Error Outputs for Development and Production Enviornment
//We need to send Less Info to the Client about the error


//Also we need to send only Operational errors to the Client and Not the Programatic errors/Logical Errors
//We Will do that using isOperational property of the AppError Class

//We need to mark some errors thrown by mongoose as Operational errors
//1. Get request using a wrong id-format i.e. not understandable by mongoose (Cast Error)
//2. Post request to an already existing Object
//3. Patch request which may generate a validation-error (ValidationError)
//....
