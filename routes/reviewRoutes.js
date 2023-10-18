const express = require('express')

const reviewController = require('../controllers/reviewController')

const authController = require('../controllers/authController')

const reviewRouter = express.Router({mergeParams:true})

reviewRouter.route('/')
.get(reviewController.getAllReviews)
.post(authController.protect,reviewController.createNewReview)

reviewRouter.route('/:id')
.delete(reviewController.deleteReview)

module.exports = reviewRouter