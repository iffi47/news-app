const mongoose= require("mongoose");

const categorySchema= new mongoose.Schema({
  category_name:{
    type:String,
    required: true
  },
  category_description:{
    type:String,
    required: false
  },
  createdAt:{
    type:Date,
    default: Date.now()
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

module.exports= mongoose.model('Category', categorySchema)