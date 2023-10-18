const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const AppError = require('../utils/appError')

//Creating The Schema
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"A User Must Have a Name"]
    },
    email:{
        type:String,
        required:[true,"Email is Required"],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Please Provide a Valid Email !']
    },
    photo:{//The uploaded Photo will be stored in outfile-system and the path to that photo will be stored in Photo field
      type:String,
      default:"default.jpg"
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
      },
    password:{
        type: String,
        required: [true, 'A strong Password Is a Must'],
        minlength:8,
        select:false
    },
    confirmPassword:{
        type: String,
        required: [true, 'Please Confirm the Password'],
        //This validator will only work on SAVE and CERATE and that is why we will need to update the user Using the save method
        validate:{
            validator:function(el){
                return el===this.password;
            },
            message:"Passwords are Not the Same !"
        }
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
    active:{
        type:Boolean,
        default:true,
        select:false
    }
})

//Using MongooseMiddleware to Encrypt the password Before Saving it...
userSchema.pre('save',async function(next){  //also known as mongooseHook
    //Checking if the password filed is mofified or not before encrypting it (the save can also be cleed when email is changed !!)    
    if(!this.isModified("password")) return next(); //returning after calling the next middleware
    
    //using the async hash function to hash the password
    this.password = await bcrypt.hash(this.password,12);
    //removing confirm_password field from the document
    this.confirmPassword=undefined;
    next();
})

//Adding the passwordChangedAt -> time if the pasword was reset
userSchema.pre('save',function(next){
    //Checking if the password was not ! modified or the user is newely created 
    if(!this.isModified("password")||this.isNew) return next()
    
    //Sometimes passwrord updation in db takes more time then teh creation of JWT this makes it seem like password was changed after jwt was created
    //so we reduce one second from password creation time to cover up for that !!
    this.passwordChangedAt = Date.now()-1000
    //We are not calling save() here since after this middleware that function will be called automatically !!
    next()
})

//An Instance method that will be available in all the documents of user model
userSchema.methods.comparePasswords = async function (candidatePassword,userPassword){
    //We cannot use this.password since it is not selected
    return await bcrypt.compare(candidatePassword,userPassword)
}

//An Instance method to check if the password was changed after logging in so we should no allow access before logging In again
userSchema.methods.isPasswordChangedAfter = function(jwt_creation_time){
    if(this.passwordChangedAt){
        const password_changed_time = parseInt(this.passwordChangedAt.getTime()/1000,10);  //getTime() to convert given date to ms
        return jwt_creation_time < password_changed_time;
    }
    return false;
}

//An Instance method for creating random tokens for Password Reset
userSchema.methods.generateResetToken = function(){
    //Creating the token(Standard Procedure)
    const unencryptedResetToken = crypto.randomBytes(32).toString('hex')
    const encryptedResetToken = crypto.createHash('sha256').update(unencryptedResetToken).digest('hex')
    
    //These will not be fully saved until user.save() is called
    //Saving to DB
    //Reset Token
    this.passwordResetToken = encryptedResetToken
    //Expires In
    this.passwordResetExpires = Date.now()+10*60*1000  //To convert 10mins to milliseconds
    //Returning the newely created token to be given to user
    return unencryptedResetToken
}

//An Instance method to check whether the token has expired or not
userSchema.methods.hasResetTokenExpired = function(){
    return this.passwordResetExpires<Date.now()+10*60*1000 
}

//adding a query middleware that only sends the active users to anyone who queries for them usin "find" at start
userSchema.pre(/^find/,function(next){  //Regex to catch any query starting with find
   this.find({active:{$ne : false}})   //Important this adds this added filter to the current users
   next()
})

//Creating the Model Out of the Schema
const User = mongoose.model("User",userSchema)

//Exporting the model
module.exports = User