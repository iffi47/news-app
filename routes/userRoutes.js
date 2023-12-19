const express= require('express')

const router=express.Router();

const {
  registerUser,
  activeToken,
  authUser
} = require("../controllers/userController")

router.route('/').post(registerUser);
router.route('/active/:activeToken').get(activeToken)
router.route('/login').post(authUser)
module.exports=router;