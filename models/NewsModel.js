const mongoose = require("mongoose")
const newsSchema = mongoose.Schema({
  title: {
    type: String,
    require: true
  },
  author: {
    type: String,
    require: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    require: true
  },
  url: {
    type: String,
    require: true
  },
  newsImage: {
    type: String,
    default: ""
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  addToSlider: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      comment: String
    }
  ],
  addToSlider: {
    type: Boolean,
    default: false
  },
  addedAt: {
    type: Date
  }
})

module.exports = mongoose.model('News', newsSchema)