const News = require("../models/NewsModel")
const User = require("../models/UserModel")
const Category = require("../models/CategoryModel")
const imageToBase64 = require('image-to-base64');
const asyncHandler = require('express-async-handler')

const addNews = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.header._id)
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
  if (!req.files) {
    res.status(400).send("Select an Image.");
  }
})

// @desc  => Fetch all news

const getAllNews = asyncHandler(async (req, res, next) => {
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
})

const getSingleNews = asyncHandler(async (req, res, next) => {
  const news = await News.findById(req.params.newsId)
    .populate({ path: "category", select: ['_id', 'category_name'] })
    .populate({ path: "userId", select: ["name", "email"] })
    .populate({ path: "comments.user", select: ["name", "email"] })
  if (news) {
    news.views= news.views +1;
    const resp= await news.save();
    if(resp){
      res.status(200).json({
        message: "Data found successfully",
        success: true,
        data: {
          news
        }
      })
    }else{
    }
  } else {
    res.status(400).json({
      message: "News not found against this Id",
      success: false
    })
  }
})

const sliderNews = asyncHandler(async (req, res, next) => {
  const news = await News.find({ addToSlider: true })
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
})

const getNewsByCategoryId = asyncHandler(async (req, res, next) => {
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
});

const getNewsByUserId = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.header._id)
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
})

const deleteNews = asyncHandler(async (req, res, next) => {
  const news = await News.findByIdAndDelete(req.params.newsId)
  if (news) {
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

const editNews = asyncHandler(async (req, res, next) => {
  const news = await News.findByIdAndUpdate(req.params.newsId, req.body, {
    new: true,
    runValidators: true
  })
  if (news) {
    res.status(201).json({
      message: "News updated successfully",
      success: true,
      data: {
        news: news
      }
    })
  } else {
    res.status(401).json({
      message: "News not found",
      success: false
    })
  }
})

const addComment = asyncHandler(async (req, res) => {
  const user = await User.findById(req.header._id)
  const newsId = req.body.newsId;
  const comment = req.body.comment;

  const news = await News.findById(newsId);

  news.comments.push({
    user: user._id,
    comment: comment,
  });

  await news.save();

  res
    .status(200)
    .json({ success: true, data: news, msg: "You have added a comment." });
});

const removeComment = asyncHandler(async (req, res) => {
  const newsId = req.body.newsId;
  const commentId = req.body.commentId;

  let news = await News.findById(newsId);
  let foundNews = news.comments.find((obj) => {
    return obj._id == commentId;
  });

  if (!foundNews) {
    return res.json({
      success: false,
      msg: "Comment not exits.",
    });
  }

  let newNewsData = news.comments.filter((obj) => {
    // console.log("obj", obj)
    return obj._id != commentId;
  });
  news.comments = newNewsData;

  await news.save();

  res.json({
    success: true,
    data: newNewsData,
    msg: "Successfully removed",
  });
});

module.exports = {
  addNews,
  getAllNews,
  getNewsByUserId,
  getNewsByCategoryId,
  getSingleNews,
  sliderNews,
  deleteNews,
  editNews,
  addComment,
  removeComment
}