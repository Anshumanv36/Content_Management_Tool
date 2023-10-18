//Here we create Factory functions for handlers of all controllers
//Factory function takes in certain arguments and returns a function to be used by the controller
//WE use (...args) => 'function code' to create and return the function
//-------------------------------------------------------------------------------------------------
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const APIFeatures = require('../utils/apiFeatures');
//-------------------------------------------------------------------------------------------------


//>.DELETE DOCUMENT
exports.deleteOne = Model =>   //This is the function that will be returned
    catchAsync(async (req,res,next)=>{
    const doc = await Model.findByIdAndDelete(req.params.id)
    
    //If the tourId does not match mongoDb sets data to null and response code is 200 
    //but we want to set it to 404 
    if(!doc){
      return next(new AppError('No document found with that ID', 404))  //We are returninghere to prevent code to move to next line and send 2-responses
    }
  
    res.status(204).json({
        status:"Successful",
        deleted_data:doc
    })
})

//>.CREATE DOCUMENT
exports.createOne = Model => catchAsync(async (req,res,next)=>{
  const doc = await Model.create(req.body)
  res.status(201).json({
      status:"Successful",
      data:doc
  })
})

//>.UPDATE DOCUMENT
exports.updateOne = Model =>catchAsync(async (req,res,next)=>{
  const doc = await Model.findByIdAndUpdate(req.params.id,req.body,{
         new:true,
         runValidators:true
     })
//If the tourId does not match mongoDb sets data to null and response code is 200 
//but we want to set it to 404 
if(!doc){
 return next(new AppError('No document found with that ID', 404))  //We are returninghere to prevent code to move to next line and send 2-responses
}
     res.status(200).json({
         status:"Successful",
         data:doc
     })
})

//>.GET ONE DOCUMENT
exports.getOne = Model =>catchAsync(async (req,res,next)=>{
  const doc = await Model.findById(req.params.id)
  if(!doc){
    return next(new AppError('No Document found with that ID', 404)) 
  }
  res.status(200).json({
    status:"Successful",
    data:doc
  })
})

//>.GET ALL DOCUMENTS
//This is a special one since we can add the filtering functionalities to all the models using this...
exports.getAll = Model => catchAsync(async (req, res,next) => {
      //Handling the Nested request for all reviews on a praticular tour (hack) 
      let filter = {}
      if(req.params.tourId) filter = {tour:req.params.tourId}

      // Making the QUERY
      const features = new APIFeatures(Model.find(filter), req.query)
      .filter()                          //these are the filtering features provided in the api
      .sort()
      .limitFields()
      .paginate();
  
    //Executing the query  
    const doc = await features.query;
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        doc
      }
    });
});