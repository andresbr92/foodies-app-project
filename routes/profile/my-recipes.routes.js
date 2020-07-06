const express = require('express')
const router = express.Router()
const multer = require("multer")
const cloudUploader = require('../../configs/cloudinary.config')
const passport = require("passport")

const Recipe = require('../../models/recipe.model')
const User = require("../../models/user.model")
const Weekmeal = require("../../models/week-meal.model")
const {
    findById
} = require('../../models/recipe.model')

const isCurrentUser = (req, res, next) => req.isAuthenticated() && req.params.userID === req.user.id ? next() : res.redirect("/auth/login")

const isLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render("auth/login", {
    errorMsg: "Restricted area!"
})
const obtainLastDate = (offset) => {
    let lastDate = new Date()
    lastDate.setDate(lastDate.getDate() + offset)
    const dd = String(lastDate.getDate()).padStart(2, '0')
    const mm = String(lastDate.getMonth() + 1).padStart(2, '0')
    const yyyy = lastDate.getFullYear()
    lastDate = yyyy + '-' + mm + '-' + dd
    return lastDate
}


// Endpoints
router.get('/:userID/add', isCurrentUser, (req, res) => {
    const userID = req.params.userID

    res.render('recipes/add-recipe', {
        userID
    })
})
router.post("/:userID/add", cloudUploader.single('imageFile'), (req, res) => {

    const owner = req.params.userID
    const steps = Array.isArray(req.body.steps) ? req.body.steps : [req.body.steps]
    const ingredients = Array.isArray(req.body.ingredients) ? req.body.ingredients : [req.body.ingredients]
    const amounts = Array.isArray(req.body.amount) ? req.body.amount : [req.body.amount]
    const ingredientsAmount = ingredients.map((ingredient, i) => `${amounts[i]} ${ingredient}`)
    const {
        title,
        preparationMinutes,
        cookingMinutes
    } = req.body

    Recipe
        .create({
            title,
            image: req.file.url,
            ingredients,
            ingredientsAmount,
            steps,
            tags,
            owner,
            preparationMinutes,
            cookingMinutes
        })
        .then(res.redirect('/profile/my-recipes/:userID'))
        .catch(err => console.log(err))

    console.log("ADDING")
})

router.get("/details/:recipeID", (req, res) => res.send("Here the details"))

router.get("/edit/:recipeID", (req, res) => {
    res.send("Editing recipes")
})
router.post("/edit/:recipeID", (req, res) => {
    res.send("Finish editing recipes")
})
router.post("/delete/:recipeID", (req, res) => {
    res.send("We are deleting")
})
router.post("/add-to-week/:recipeID", isLoggedIn, (req, res) => {
    Recipe.findById(req.params.recipeID)
        .then(recipe => {

            console.log(recipe.id, req.user.id, new Date())
            return {
                originalRecipe: recipe.id,
                ingredients: recipe.ingredients,
                owner: req.user.id,
                mealDay: req.body.mealDate
            }
        }).then(meal => {
            console.log(meal)
            Weekmeal.create(meal)
        })


        .catch(err => console.log("There was an error creating a meal", err))

})

router.get("/:userID", isLoggedIn, isCurrentUser, (req, res) => {
    console.log("HEY")
    Recipe
        .find({
            owner: req.params.userID
        })
        .then(theRecipes => {
            console.log("today", obtainLastDate(0), "last day", obtainLastDate(15))
            res.render(`profile/my-recipes`, {
                theRecipes,
                today: obtainLastDate(0),
                lastDay: obtainLastDate(15)
            })
        })


})
router.get('/', isLoggedIn, (req, res) => {
    res.redirect(`/profile/my-recipes/${req.user.id}`)
})


module.exports = router