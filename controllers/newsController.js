const News = require("../models/NewsModel")
const User = require("../models/UserModel")
const Category = require("../models/CategoryModel")
const imageToBase64 = require('image-to-base64');

const addNews = async (req, res, next) => {
  const user = await User.findById(req.header._id)
  try {
    const { title, author, content, category, addToSlider } = req.body
    const { newsImage } = req.files
    if (newsImage.type.includes("webp")) {
      res.status(415).json({
        message: "The server will not accept the request, because image media type is not supported",
        success: false
      })
    }
    const imageUrl = await imageToBase64(newsImage.path)
    if (!imageUrl) {
      req.status(404).json({
        message: "Image path is not correct",
        success: false
      })
    }
    const news = await News.create({
      author, title, content, category, addToSlider, userId: user._id, newsImage: `data:${req.files.newsImage.type};base64,${imageUrl}`, addedAt: Date.now()
    })
    if (news) {
      res.status(201).json({
        message: "News created successfully",
        success: true,
        data: {
          news: news
        }
      })
    } else {
      res.status(400).json({
        message: "Invalid news data",
        success: false
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}

// @desc  => Fetch all news

const getAllNews = async (req, res, next) => {
  try {
    let { pageSize, pageNo } = req.query
    var query = {}
    if (pageNo < 0 || pageNo === 0) {
      return res.status(401).json({
        message: "Invalid page no and, it should be one",
        success: false
      })
    }
    query.skip = pageSize * (pageNo - 1)
    query.limit = pageSize

    let news = await News.find({})
    let result = await News.find({})
      .sort('-addedAt')
      .populate({ path: "category", select: ['_id', 'category_name'] })
      .limit(Number(query.limit))
      .populate({ path: "userId", select: ["name", "email"] })
      .sort("-id")
      .skip(Number(query.skip))

    if (news.length > 0) {
      res.status(200).json({
        message: "Data fetch successfully",
        success: true,
        data: {
          count: news.length,
          news: result,
          limit: Number(query.limit)
        }
      })
    } else {
      res.status(400).json({
        message: "News not found",
        success: false
      })
    }
  } catch (e) {
    res.status(500).json({
      message: "Internal error occurred",
      success: false
    })
  }
}

const getSingleNews = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.newsId)
    .populate({ path: "category", select: ['_id', 'category_name'] })
    .populate({ path: "userId", select: ["name", "email"] })
    .sort("-id")
    if (news) {
      res.status(200).json({
        message: "Data found successfully",
        success: true,
        data: {
          news
        }
      })
    } else {
      res.status(400).json({
        message: "News not found against this Id",
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

const sliderNews = async (req, res, next) => {
  try {
    const news = await News.find({addToSlider:true})
    .populate({ path: "category", select: ['_id', 'category_name'] })
    .populate({ path: "userId", select: ["name", "email"] })
    .sort("-id")
    if (news) {
      res.status(200).json({
        message: "Data found successfully",
        success: true,
        data: {
          total: news.length,
          news
        }
      })
    } else {
      res.status(400).json({
        message: "News not found against this Id",
        success: false
      })
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal error occurred",
      success: false
    })
  }
}

const getNewsByCategoryId = async (req, res, next) => {
  try {
    const { catId } = req.params
    const category = await Category.findById(catId)

    let { pageSize, pageNo } = req.query
    var query = {}
    if (pageNo < 0 || pageNo === 0) {
      return res.status(401).json({
        message: "Invalid page no and, it should be one",
        success: false
      })
    }
    query.skip = pageSize * (pageNo - 1)
    query.limit = pageSize
    let news = await News.find({ category: category._id })
    .limit(Number(query.limit))
    .populate({ path: "category", select: ['_id', 'category_name'] })
    .skip(Number(query.skip))

    if (news) {
      res.status(200).json({
        message: "Data found successfully",
        success: true,
        data: {
          count: news.length,
          news: news,
          limit: Number(query.limit)
        }
      })
    } else {
      res.status(400).json({
        message: "News not found against this category Id",
        success: false
      })
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal error occurred",
      success: false
    })
  }
}

const getNewsByUserId = async (req, res, next) => {
  const user = await User.findById(req.header._id)
  try {


    let { pageSize, pageNo } = req.query
    var query = {}
    if (pageNo < 0 || pageNo === 0) {
      return res.status(401).json({
        message: "Invalid page no and, it should be one",
        success: false
      })
    }
    query.skip = pageSize * (pageNo - 1)
    query.limit = pageSize
    const news = await News.find({
      userId: user._id
    })
    .limit(Number(query.limit))
    .populate({ path: "category", select: ['_id', 'category_name'] })
    .skip(Number(query.skip))
    if (news) {
      res.status(200).json({
        message: "News found successfully",
        success: true,
        data: {
          count: news.length,
          news: news,
          limit: Number(query.limit)
        }
      })
    } else {
      res.status(400).json({
        message: "News not found against this userId",
        success: false
      })
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal error occurred",
      success: false
    })
  }
}

module.exports = {
  addNews,
  getAllNews,
  getNewsByUserId,
  getNewsByCategoryId,
  getSingleNews,
  sliderNews
}