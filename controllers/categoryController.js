const Category = require("../models/CategoryModel")
const User = require("../models/UserModel")
const asyncHandler = require('express-async-handler')
//this controller is for add category

const addCategory = asyncHandler(async (req, res) => {
  const user = await User.findById(req.header._id)
  const { category_name, category_description } = req.body;
  const category = await Category.findOne({ category_name: category_name })
  if (category) {
    res.status(401).json({
      message: "This category existed already",
      success: false
    })
  } else {
    const createdCategory = await Category.create({ category_name, category_description, userId: user._id })
    if (createdCategory) {
      res.status(200).json({
        success: true,
        message: "Category created successfully",
        data: createdCategory
      })
    }
  }
})

const getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({})
  if (categories.length === 0) {
    res.status(400).json({
      message: "Bad request",
      success: false
    })
  }
  res.status(200).json({
    message: "Categories found",
    success: true,
    data: {
      categories: categories
    }
  })
})

const getCategoriesByUserId = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.header._id)
  const categories = await Category.find({ userId: user._id })
  if (categories.length === 0) {
    res.status(400).json({
      message: "Bad Request",
      success: false
    })
  }
  res.status(200).json({
    message: "Data found successfully",
    success: true,
    data: {
      categories: categories
    }
  })
})

const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.catId)
  console.log();
  if (category) {
    res.status(201).json({
      message: "Data deleted successfully",
      success: true

    })
  } else {
    res.status(401).json({
      message: "Your data is not correct",
      success: false
    })
  }
})

//Update Categories

const editCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.catId, req.body, {
    new: true,
    runValidators: true
  })
  if (category) {
    res.status(201).json({
      message: "Category updated successfully",
      success: true,
      data: {
        category: category
      }
    })
  } else {
    res.status(401).json({
      message: "Category not found",
      success: false
    })
  }
})

module.exports = {
  addCategory,
  getAllCategories,
  getCategoriesByUserId,
  deleteCategory,
  editCategory
}