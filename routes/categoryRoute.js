const express= require('express')
const protect= require("../middleware/authMiddleware")
const router=express.Router();

const {
  addCategory,
  getAllCategories,
  getCategoriesByUserId,
  deleteCategory,
  editCategory
} = require("../controllers/categoryController")

router.route('/addCategory').post(protect, addCategory)
router.route('/getAllCategories').get(getAllCategories)
router.route('/getCategories/user').get(protect, getCategoriesByUserId)
router.route('/delete/category/:catId').delete(protect,deleteCategory)
router.route('/edit/category/:catId').put(protect,editCategory)
module.exports=router