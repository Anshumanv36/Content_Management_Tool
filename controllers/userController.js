//This is the Controller In the MVC architecture and We are adding these functions to the exoports object using the (.) pattern

const catchAsync = require("../utils/catchAsync")
const User = require('../models/userModel')
const AppError = require("../utils/appError")
const factory = require('./handlerFactory')
const sharp = require('sharp')

//----------------------------------------------------------------------
//------------------------->> MULTER <<---------------------------------
//----------------------------------------------------------------------
//Miiddleware for handling multipart form data or file uploads by a form 
const multer = require('multer')

//Multer Storage Configuration
// const multerStorage = multer.diskStorage({
//   destination:(req,file,cb)=>{  //cb is a callback function which on error will be called with an error argument or else null will be passed
//                                 //It is just like the next function if true is passed then it will go on else if false is passed as argument it will stop
//    cb(null,'public/img/users')  //destination folder
//   },
//   filename:(req,file,cb)=>{
//     const extension = file.mimetype.split('/')[1]
//     cb(null,`user-${req.user.id}-${Date.now()}.${extension}`)  //We are writing user photoname like this to avoide any clashes
//   }
// })

const multerStorage = multer.memoryStorage()  //This will be stored in memory buffer before getting resized and savet to the disk req.file.buffer

const multerFilter = (req,file,cb)=>{
  if(file.mimetype.startsWith('image')){
    cb(null,true)   //True so go on to next 
  }
  else{
    cb(new AppError('Not an Image ! Please Upload Only Images',400),false)  //False so return
  }
}

//Now configuring the storage and filter onto the upload object
const upload = multer({
  storage:multerStorage,
  fileFilter:multerFilter
})

//Now we will use this upload object's function to handle the file upload
//Function to handle photoUpload
exports.uploadUserImage = upload.single('photo') //The the form field should have a type of file and the name as 'photo'

//---------------------------->>RESIZING IMAGES<<-----------------------------------------
//we need a square image to be uploaded in the form of jpeg therefore we will have to resize the image using sharp middleware
exports.resizeUserImage = (req,res,next)=>{
  if(!req.file.buffer) return next()
  
  //We have to add the filename property since we now are using memory instead of disk
  req.file.filename = `user-${req.user.id}.jpeg`  

  sharp(req.file.buffer)
  .resize(500,500)
  .toFormat('jpeg')
  .jpeg({quality:90})
  .toFile(`public/img/users/${req.file.filename}`)

  next()
}

//--------------------------------------------------------------------------------------------
//------------------------------------MULTER ENDS---------------------------------------------
//--------------------------------------------------------------------------------------------

//Callback Function for param middleware to check for id
exports.validateId =  (req,res,next,val)=>{
  //  console.log("Now Printing -> ",val)
   next()
}

//Using factory function to add filtering functionality also
exports.getAllUsers = factory.getAll(User)

//Function for filtering data before updating user's Info so that only allowed fields are Included
const filterObj = (obj,...fields)=>{
  const newObj = {}
  Object.keys(obj).forEach(el=>{
    if(fields.includes(el)){
      newObj[el] = obj[el]
    }
  })
  return newObj
}

//This is a handler for the loggedIn user to update his own credentials such as email and name etc.
exports.updateMe = catchAsync(async (req,res,next)=>{
  //1) Create error if user posts password data :
  if(req.body.password||req.body.confirmPassword) return next(new AppError("This route is not for password updates please use Patch to reaset Password",400))
  //2) Update user document
  const filteredObj = filterObj(req.body,"name","email")
  
  //This is where we will add the .photo also if the user image is also uploaded by the user along with name and email
  if(req.file) filteredObj.photo = req.file.filename  //name of the user image that will be stored in specified location
  
  const user  = await User.findByIdAndUpdate(req.user.id,filteredObj,{
    runValidators:true,
    new:true
  }) //this id we are getting from the user object that we attached to request object
  
  res.status(202).json({
    status:"Successfully Updated",
    user:user
  })
})

//This is a handler for letting the LoggedIn user set his account to inactive
exports.deleteMe = catchAsync (async(req,res,next)=>{
  //we are setting active as false here
  //we also need to make a query middleware such that each time someone queries with a find at start we only send them the users whicg are active
  //so we make this query middleware in userModel.js
   await User.findByIdAndUpdate(req.user.id,{$set:{active:false}})
   res.status(204).json({
    status:"Successfully Deleted"
   })
})

//--------------------->>ME<<-------------------------------------
//Creating a middleware for adding user_id to the params for getOne()
exports.getMe = (req,res,next)=>{
  req.params.id = req.user.id
  next()
}

exports.getSelectedUser = factory.getOne(User)

exports.createNewUser = catchAsync(async (req,res)=>{
    if(!req.body.confirmPassword){
      req.body.confirmPassword = req.body.password
    }
    await User.create(req.body)
    res.status(201).json({
      status:"Successfully Created"
    })
})

exports.updateUser = (req,res)=>{
    res.send("Not Yet Created")
}
exports.deleteUser = (req,res)=>{
    res.send("Not Yet Created")
}