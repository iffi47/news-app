const express= require('express')
const protect= require("../middleware/authMiddleware")
const router=express.Router();

const {
  registerUser,
  activeToken,
  authUser,
  getUserProfile,
  updateProfile
} = require("../controllers/userController")

router.route('/').post(registerUser);
router.route('/active/:activeToken').get(activeToken)
router.route('/login').post(authUser)
router.route('/profile').get(protect,getUserProfile).put(protect, updateProfile)
module.exports=router;