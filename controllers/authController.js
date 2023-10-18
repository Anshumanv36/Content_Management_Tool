/*eslint-disable*/
//This is the User Authentication controller Used when First Creating the User

//Importing Json Web Token
const crypto = require('crypto');
const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const Email = require("../utils/sendEmail")
const AppError = require('../utils/appError')

//This is a function to create and send the JWT when all the middleware checking is done
//It also sends a jwt cookie to be stored by the browser !!
const createSendToken = (user,statusCode,res)=>{
  //Creating and signing the  webtoken
  const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
   //An option..
   expiresIn:process.env.JWT_EXPIRES_IN
})

//these are the cookie options...
const cookieOptions = {
   //converting into ms
   expiresIn:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN*24*60*60),
   //this will prevent the browser from accessing the cookie and make it transportOnly
   httpOnly:true
}

//since https is only available in production
if(process.env.NODE_ENV==='production') cookieOptions.secure=true

//making and sending the cookie
//cookie is the only response that we can send along with the main response
res.cookie('jwt',token,cookieOptions)

//Removing the password element since it is selected using explicit select==true in the middlewares for password checking
user.password = undefined

res.status(statusCode).json({
 status:"Created Successfully",
 //Sending the token to the user to save it locally 
 token,
 user:user
})
}

exports.signup = catchAsync(async (req,res,next)=>{
   //Create the user with only required fields form the body to keep anyone from defining the role as admin
   const newUser = await User.create({
      name:req.body.name,
      email:req.body.email,
      password:req.body.password,
      confirmPassword:req.body.confirmPassword
   })

   const url = `${req.protocol}://${req.get('host')}/me`  //this will get the right url in both pod and dev
   await new Email(newUser,url).sendWelcome()

   createSendToken(newUser,201,res)
})

exports.login = catchAsync(async (req,res,next)=>{
   const email = req.body.email;
   const password = req.body.password;
    //Check if both the email and passwords are present !!
    if(!email||!password) return next(new AppError("Enter both email and Password !!",404))

    //Check if the input email and password are correct
    const match = await User.findOne({email:email}).select("+password")   //to select the password since it will not be selected implicitely
    if(!match)
      return next(new AppError("Email not present !!",404))

    if(!(await match.comparePasswords(password,match.password))) //using the instance method of user documents
      return next(new AppError("Password Incorrect !!",400))

    //Sign and return the JWT
    createSendToken(match,201,res)
})

exports.logout = (req,res,next)=>{
   //Setting the token to null
   const token = ""
   const cookieOptions = {
      expiresIn:5,  //expires in 5ms
      httpOnly:true
   }
   //sending the cookie with the same name overwrites the previous jwt
   res.cookie('jwt',token,cookieOptions) 
   res.status(200).json({
      status:"success",
      message:"Successfully Logged Out"
   })
}

exports.protect = catchAsync(async (req,res,next)=>{
   let token;
   //1. Getting the token & Checking if it is there with the header??
   if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
      token = req.headers.authorization.split(' ')[1];
   }else if(req.cookies.jwt){   // To check for the jwt in cookie 
     token = req.cookies.jwt
   }else{
      return next(new AppError("You are not LoggedIn please login to get access",401))
   }
   //2. Verification of Token
   const payload = await promisify(jwt.verify)(token,process.env.JWT_SECRET)

   //3. Checking if the user still exists
   const currentUser = await User.findById(payload.id)
   if(!currentUser){
      return next(new AppError("User does not exist signUp to access !!",401))
   } 
   //4. Checking if the user changed password after the token was issued ??
   if(currentUser.isPasswordChangedAfter(payload.iat)){
      return next(new AppError("Password was changed ! Please Login again to continue..",401))
   }
   //We save the current user in the request object for use in later middlewares...If Required !!
   //but this is how we can pass refined data from one middleware to another sequentially
   req.user = currentUser

   //Now we can use this in the window
   res.locals.user = currentUser

   next()
})

//This is a middle ware that checks if the user is logged in or not and based on that we render our template
exports.isLoggedIn = catchAsync(async (req,res,next)=>{
   //1. To check for the jwt in cookie 
   if(req.cookies.jwt){  
   //2. Verification of Token
   const payload = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET)

   //3. Checking if the user still exists
   const currentUser = await User.findById(payload.id)
   if(!currentUser){
      //We wont be calling any kind of error here
      //as we only need to selectively render a different format
      return next()
   } 
   //4. Checking if the user changed password after the token was issued ??
   if(currentUser.isPasswordChangedAfter(payload.iat)){
      return next()
   }
   
   //USER IS LOGGED IN !!
   res.locals.user = currentUser   //res.locals is similar to passing arguments when we call a template user will now be available in templates to use
   }else{
      res.locals.user = undefined
   }
   next()
})

exports.forgotPassword = catchAsync(async (req,res,next)=>{
   //1. Get User Based On POSTEmail
   const user = await User.findOne({email:req.body.email})
   if(!user){
      return next(new AppError("User does not exist...!!",400))
   }
   //2. Generate a random reset token
   const resetToken = user.generateResetToken()
   await user.save({validateBeforeSave : false})
    
   //3. Send it to user's email
   const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
   const message = `Forgot you password ? submit a PATCH request to ${resetURL}.\n If you didn't forget your password, please Ignore this message`

   try{
      await new Email(user,resetURL).sendPasswordReset()
      
      res.status(200).json({
         status:"Success",
         message: "Token Sent to email"
      })
   }
   catch(err){
       user.passwordResetToken = undefined
       user.passwordResetExpires = undefined

       await user.save({validateBeforeSave:false})

       return next(new AppError('There was an error while sending the mail try again !!',500))
   }
})

exports.resetPassword = catchAsync (async (req,res,next)=>{
//1) Get the user based on the token
   const hashedUserToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
   const user = await User.findOne({passwordResetToken:hashedUserToken,passwordResetExpires:{$gt:Date.now()}})
   
   //--------------------------------------------------------------------------------------------------------------

//2) If token has not expired and there is a user then set the new password
   if(!user) return next(new AppError("Token is invalid or has already expired !!",400))
   
   //change password and confirm password
   user.password = req.body.password
   user.confirmPassword = req.body.confirmPassword

   //make the passwordReset properties undefined again !!
   user.passwordResetToken = undefined
   user.passwordResetExpires = undefined

   //saving the info but using validation and a presave middleware
   await user.save()

   //--------------------------------------------------------------------------------------------------------------   

//3) Update changedPasswordAt property for the user
   
   //This functionality is made in the pre-save middleware in userModel.js
   //--------------------------------------------------------------------------------------------------------------

//4) Log the user in, send JWT
   //Creating and signing the  webtoken
   createSendToken(user,201,res)
})

exports.updatePassword = catchAsync(async (req,res,next)=>{
   //1) Get the user from the collection
   const user = await User.findById(req.user._id).select("+password")
   if(!user) return next(new AppError("The User doesnot exist !!",400))
   //2) Check if the POSTed currentpassword is correct
   const  { currentPassword,newPassword,newPasswordConfirm } = req.body
   if(!currentPassword||!newPassword||!newPasswordConfirm) return next(new AppError("CurrentPassword,New-Password and New-Password Confirm fields are required !!",400))
   if(!(await user.comparePasswords(currentPassword,user.password))) return next(new AppError("Password Incorrect !!",400))
   //3) Update the password
   user.password = newPassword
   user.confirmPassword = newPasswordConfirm

   //We need to save the password always since if we update it using findAndUpdate() then none of the middlewares would work
   await user.save()
   //4) Log the user In and send the JWT
   createSendToken(user,201,res)
})
