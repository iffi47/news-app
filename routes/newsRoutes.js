const express = require('express')
const protect = require("../middleware/authMiddleware")
const router = express.Router();
const {
  addNews,
  getAllNews,
  getSingleNews,
  getNewsByCategoryId,
  sliderNews,
  getNewsByUserId
} = require("../controllers/newsController")

router.route("/addNews").post(protect, addNews)
router.route("/getAllNews").get(protect, getAllNews)
router.route('/getSingleNews/:newsId').get(protect, getSingleNews)
router.route("/getNewsByCategory/:catId").get(protect, getNewsByCategoryId)
router.route("/getSliderNews").get(protect, sliderNews)
router.route("/getNewsByUser").get(protect, getNewsByUserId)

module.exports = router;