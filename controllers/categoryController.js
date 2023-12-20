const Category = require("../models/CategoryModel")
//this controller is for add category

const addCategory = async (res, req) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      message: "Internal server error occurred",
      success: false
    })
  }
}

const getAllCategories = async (res, req, next) => {

  try {
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
  } catch (error) {
    res.status(500).json({
      message: "Internal server error occurred",
      success: false
    })
  }

}

const getCategoriesByUserId = async (res, req, next) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      message: "Internal server error occurred",
      success: false
    })
  }
}

const deleteCategory = async (res, req, next) => {
  try {
    const category = Category.findByIdAndDelete(req.params.catId)
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
  } catch (error) {
    res.status(500).json({
      message: "Internal server error occurred",
      success: false
    })
  }
}

//Update Categories

const editCategory = async (res, req, next) =>{

  try {
    const category=Category.findByIdAndUpdate(req.params.catId, req.body,{
      new: true,
      runValidators: true
    })
    if(category){
      res.status(201).json({
        message:"Category updated successfully",
        success: true,
        data:{
          category:category
        }
      })
    }else{
      res.status(401).json({
        message:"Category not found",
        success: false
      })
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error occurred",
      success: false
    })
  }
}

module.exports={
  addCategory,
  getAllCategories,
  getCategoriesByUserId,
  deleteCategory,
  editCategory
}