const express = require("express")
const morgan= require("morgan")
const formData= require("express-form-data")
const connectDB= require("./config/db")
const userRoute= require("./routes/userRoutes")
const categoryRoute= require("./routes/categoryRoute")
const newsRoute= require("./routes/newsRoutes")
require('dotenv').config();
require('colors');
connectDB();

const app= express();
app.use(formData.parse())
if(process.env.NODE_ENV==='development')
app.use(morgan('dev'))

app.use(express.json())
app.use(express.urlencoded({extended:false}));


app.use('/api/users',userRoute)
app.use('/api/categories',categoryRoute)
app.use("/api/news",newsRoute)


app.get('*', function(req, res){
  res.status(404).json({
    msg: "Api path not found."
  });
});
const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server is connectaed to ${process.env.NODE_ENV}`.red))

