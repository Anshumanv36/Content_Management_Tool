//This is the error-handler for asyncFunctions
// fn-> the async function passed by the handler that will get executed and will return a function reference that
// will be executed by express and if any error occurs will then be handled by globalErrorHandler 
module.exports = fn => {    
   return (req,res,next) => {    
     fn(req,res,next).catch(err=>{next(err)})
  }
}