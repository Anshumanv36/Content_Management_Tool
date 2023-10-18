const mongoose = require('mongoose')


const reviewSchema = new mongoose.Schema({
    review:{
        type:String,
        required:[true,"Review cannot be empty !"]
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        required:[true,"Rating is required !"]
    },
    createdAt:{
     type:Date,
     default:Date.now()
    },
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,"A review must have a tour !"]
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,"A review must have an user"]
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true } 
  })

//Indexing the tour and user to make user-tour review combo unique
reviewSchema.index({tour:1,user:1},{unique:true})

//This is a middleware that populates the user whenever we query for reviews
reviewSchema.pre(/^find/,function(next){
    this.populate({
    path:'user',
    select:'name photo'
})
//We are not populating the tour since we do no need to show the tour as the user will query for all the reviews inside a particular tour 
//And polulating tour will cause the responce to be very clumped !!
next()
})

const Review = mongoose.model('Review',reviewSchema)

module.exports = Review