//This is where we will handle the outermost functionalities of our server (Database Connection,Port Connection etc..)

//-----------------------------------------------------------------------------------------------------------------
//Configuring Enviornment Variables and also see scripts in package.json for changing enviornments

//Importing the dotenv module
const dotenv = require('dotenv')
//Configuring the enviornmental variables present in the config.env files 
dotenv.config({path:`${__dirname}/config.env`})
//we can access the enviornmental variables using "process.env"
//console.log(process.env)
//-----------------------------------------------------------------------------------------------------------------
// MONGO.DB  Connection
const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);

//The connection returns a promise object 
mongoose.connect(DB, {      
  useNewUrlParser: true,
})
.then((con) => {
    console.log("DB Connection Successful....");
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
//Now We are Connected and Ready to Go 🥳
//-----------------------------------------------------------------------------------------------------------------
const app = require('./app')

const port = process.env.PORT || 9999

app.listen(port,()=>{
    console.log("Server Started Listening....")
})