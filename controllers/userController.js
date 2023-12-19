const { query } = require('express')
const { use } = require('../routes/userRoutes')
const generateToken= require('../utils/generateToken')
const User= require('../models/UserModel')
const crypto= require('crypto')
var mailer= require('../utils/Mailer')


const registerUser= async (req, res, next) =>{
  try{
    const {name, email, password} = req.body;
    const userExists= await User.findOne({email});
    if(userExists && userExists.active){
      return res.status(400).json({
        success:false,
        message: "Entered email id is already registered."
      })
    }else if(userExists && !userExists.active){
      return res.status(400).json({
        success: false,
        message: "Account created but need to activate. A link sent with you email. Please verify!"
      })
    }
    const user= new User({
      name, email, password
    });
    // Generating 20bit activation code, crypto is built in package of node.js
    crypto.randomBytes(20,async function(err, buf){
      //Ensure the acivation link is unique
      user.activeToken= user._id + buf.toString('hex')
      //Set expiration time of 24 hours
      user.activeExpires= Date.now() + 24 *3600 *1000;
      var link= process.env.NODE_ENV= 'development' ? `http://localhost:${process.env.PORT}/api/users/active/${user.activeToken}
      `: `${process.env.api_host}/api/users/active/${user.activeToken}`;
      //Sending activation mail
      mailer.send({
        to: req.body.email,
        subject: "Welcome",
        html: "Please check <a href='" + link +"'> here </a> to activate your account."
      });

      //Save user object
      const userSaved= await user.save()
      if(userSaved){
        res.status(201).json({
          success: true,
          message: `The activation email has been sent to ${user.email}. Please activate the link within 24 hours.`,
        })
      } 
    })
  }catch(err){
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server having some issues "
    })
  }
}

const activeToken= async (req, res) =>{
  try{
  //Find the corresponding user
  const query= User.where({
    activeToken: req.params.activeToken,
    activeExpires: {$gt: Date.now()}
  })
  let activeUser= await query.findOne()
  if(!activeUser){
    return res.status(400).json({
      message:"Your activation link is expired",
      success: false
    })
  }
  else if(activeUser.active==true){
    return res.status(200).json({
      message:"Your account is already activated go login to use this app",
      success:true
    })
  }else{
    activeUser.active=true
   const activeUserSave= await activeUser.save();
   if(activeUserSave){
    res.status(201).json({
      message: "Activation sccessfull",
      success: true
    })
   }
  }
}catch(e){
  console.error(e);
  res.status(500).json({
    success: false,
    message:"Server having some issues"
  })
}
}

const authUser= async (req, res) =>{
  const {email, password}= req.body;

  const user = await User.findOne({email})
  if(user && (await user.matchPassword(password))){
    res.status(200).json({
      success:true,
      message:"User autheticated",
      data:{
      _id:user.id,
      name: user.name,
      email:user.email,
      avatar: user.avatar,
      token: generateToken(user.id)
      }
    })
  }else{
    res.status(401).json({
      success: false,
      message:"Unauthorized user"
    })
  }
}

const getUserProfile = async (req, res) =>{
  const user= await User.findById(req.header._id)

  if(user) {
    res.status(200).json({
      message:"User found successfully",
      success: true,
      data:{
        _id:user.id,
        name:user.name,
        email:user.email,
        avatar:user.avatar,
      }
    })
  }else{
    res.status(404).json({
      success:false,
      message:"User not found"
    })
  }
}
module.exports= {registerUser,getUserProfile, activeToken, authUser}