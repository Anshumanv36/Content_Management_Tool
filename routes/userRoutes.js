const express = require("express");
const authController = require("../controllers/authController");
//Since we are using MVC Architecture we will have to import the controllers/handlers form "userController"
const userController = require("../controllers/userController");

//----------------------------------------------------------------------------------------------------------------
//Here we create ne Router and Mount it to '/api/v1/users' for handling requests
const userRouter = express.Router();
//----------------------------------------------------------------------------------------------------------------
//Param Middleware to check if the Id is Valid Or Not
userRouter.param("id", userController.validateId);

//Special Route Just for Authentication On Signup/Creation
userRouter.post("/signup", authController.signup);

//Special Route for loginIn user
userRouter.post("/login", authController.login);

//Route for logout
userRouter.get("/logout", authController.logout);

//Special Routes for Resetting Password
//Forgot Password (Will get reset token via email)
userRouter.post("/forgotPassword", authController.forgotPassword);
//Reset Password (will reset the password using the token received)
userRouter.patch("/resetPassword/:token", authController.resetPassword);

//Update the password if the User is loggedIn currently
userRouter.patch(
	"/updatePassword",
	authController.protect,
	authController.updatePassword
);

//Update the credentials of user (Done By User Only) (User Needs to be logged In)
userRouter.patch(
	"/updateMe",
	authController.protect,
	userController.uploadUserImage,
	userController.resizeUserImage,
	userController.updateMe
);

//Make the user delete himself if he is logged in (Just making him inactive)
userRouter.delete("/deleteMe", authController.protect, userController.deleteMe);

//Route to get the info about the currently loggedIn User
userRouter.get(
	"/me",
	authController.protect,
	userController.getMe,
	userController.getSelectedUser
);

//1->GetAll/Create-New Users
userRouter
	.route("/")
	.get(authController.protect, userController.getAllUsers) // Since UserController has the handler to the request event
	.post(userController.createNewUser);

//2->Get/Patch/Delete Specific User
userRouter
	.route("/:id") //As the mounting has already been done so just specify the Inner route
	.get(userController.getSelectedUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);

//Now We will have to Export the router
module.exports = userRouter;
