/*eslint-disable*/
const nodemailer = require('nodemailer')
//This is requierd to render the emial templates into html to be sent via email
const ejs = require('ejs')
const util = require('util')

// const sendEmail = async options=>{
//     //1) Create a transporter
//     //----------------------------------------------------------------
//     // const transporter = nodemailer.createTransport({
//     //     service:"Gmail",
//     //     auth:{
//     //         user:"aditya298k@gmail.com",
//     //         password:"All_Star@98k"
//     //     }
//     //     //Active in gmail "less secure app option"
//     //     //We use mailgun or sendgrid instead of gmail
//     // })
//     //----------------------------------------------------------------

//     //We are testing emails using mailtrap.io
//     const transporter = nodemailer.createTransport({
//         host:process.env.MAILTRAP_HOST,
//         port:process.env.MAILTRAP_PORT,
//         auth:{
//             user:process.env.MAILTRAP_USERNAME,
//             pass:process.env.MAILTRAP_PASSWORD
//         }
//     })

//     //2) Define the email option
//     const mailOPtions = {
//         from: "Aditya Mishra",
//         to:options.email,
//         subject:options.subject,
//         text:options.message
//         //html:
//     }   
  

//     //3) Actually send the email
//     try {
//         const info = await transporter.sendMail(mailOPtions);
//         console.log('Email sent successfully!', info.messageId);
//         // The "info" object may contain additional details about the sent email
//       } catch (error) {
//         console.error('Error sending email:', error);
//         throw error; // You can rethrow the error or handle it as per your requirement
//       }
// }


//Now we will send email using sendgrid and Email will be a class from now on..
//new Email(user,url).sendWelcome()


module.exports = class Email{
    constructor(user,url){  //user is  the user to which we need to send the email
        this.to = user.email
        this.firstName = user.name.split('/')[0]
        this.lastName = user.name.split('/')[1]
        this.url = url
        this.from = 'aditya298k@gmail.com'
    }
    //Creating the transport
    //In production we  want to send real emails
    //When in dev we want to use our mailtrap application
    createTransport(){
        if(process.env.NODE_ENV==='prouction'){
            //Sendgrid
            return 1
        }else{
            return nodemailer.createTransport({
                host:process.env.MAILTRAP_HOST,
                port:process.env.MAILTRAP_PORT,
                auth:{
                    user:process.env.MAILTRAP_USERNAME,
                    pass:process.env.MAILTRAP_PASSWORD
                }
            })          
        }
    }
    //other speciailzed send functions wil call this function with ejs,pug template name 
    async send(template, subject) {
        try {
            // Render the email template
            const renderFile = util.promisify(ejs.renderFile); // Promisify ejs.renderFile
            const html = await renderFile(`views/emails/${template}.ejs`, {
                firstName: this.firstName,
                url: this.url,
                subject
            });
    
            // Define Email options
            const mailOptions = {
                from: this.from,
                to: this.to,
                subject: subject,
                html: html
            };
    
            // Create the transport and send email
            const info = await this.createTransport().sendMail(mailOptions);
            // console.log('Email sent successfully!', info.messageId);
            // The "info" object may contain additional details about the sent email
        } catch (error) {
            // console.error('Error sending email:', error);
            throw error; // You can rethrow the error or handle it as per your requirement
        }
    }
    async sendWelcome(){
        await this.send('welcome','Welcome to the Natours Family')
    }

    async sendPasswordReset(){
        await this.send('resetPassword','Your password Reset token (Valid Only for 10 min)')
    }
}