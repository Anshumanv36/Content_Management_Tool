const Review = require('../models/reviewModel')
const catchAsync = require('../utils/catchAsync')

//Importing the factory function to get different handler methods
const factory = require('./handlerFactory')

exports.createNewReview = catchAsync(async (req,res,next)=>{
    //Checking if the body contain tour_id and user_id or we have them in params
    //And the id is updated from the loggedIn isers data
    if(!req.body.tour) req.body.tour = req.params.tourId
    if(!req.body.user) req.body.user = req.user.id
    // console.log(req.body)
    const review = await Review.create(req.body)
    res.status(201).json({
        status:"Successful",
        review:review
    })
})

// exports.getAllReviews = catchAsync(async (req,res,next)=>{
//     //Creating a filter object for possible Nested Review Route that has :tourId as Param i.e. 
//     //Getting all the Reviews for a particular Tour
//     let filter = {}
//     if(req.params.tourId) filter = {tour:req.params.tourId}
    
//     const allReviews = await Review.find(filter)
//     res.status(200).json({
//      status:"Successful",
//      reviews:allReviews
//     })
// })

//Replacing getAllReview's code with factory function
exports.getAllReviews = factory.getAll(Review)

exports.deleteReview = factory.deleteOne(Review)