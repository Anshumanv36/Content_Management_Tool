//Every error in our project is an Instance of this AppError Class 
class AppError extends Error{
    constructor(message,statusCode){
       //The Original Error Class Only Excepts a message as argument
       super(message)

       this.statusCode = statusCode
       this.status = `${statusCode}`.startsWith('4')?"fail":"error"; //Easy Way Of Converting Statuscode to String
       
       //To check in future if the error is an operational error or some programatic/logical error
       this.isOperational=true


       // Capture the error's stack trace, excluding this constructor.
       // Simplifies error messages to show only relevant code for easier debugging.
       Error.captureStackTrace(this,this.constructor);
    }
}

module.exports = AppError