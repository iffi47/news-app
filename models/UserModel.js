const mongoose= require('mongoose')
const bcrypt= require('bcryptjs')
const userSchema= mongoose.Schema({
  name: {
    type: 'string',
    required: true
  },
  email:{
    type: 'string',
    required: true,
    unique: true
  },
  password:{
    type: 'string',
    required: true,
  },
  avatar:{
    type: 'string',
    default:''
  },
  active:{
    type: Boolean,
    default: false
  },
  activeToken: String,
  activeExpires: Date
})

userSchema.methods.matchPassword= async function (enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password)
}
userSchema.pre('save', async function(next){
  try{
  if(!this.isModified('password')){
    next();
  }
  const salt= await bcrypt.genSalt(10);
  this.password= await bcrypt.hash(this.password, salt)
  return next()
}catch(e){
  return next(error);
}
})

module.exports= mongoose.model('User', userSchema)