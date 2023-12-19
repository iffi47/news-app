var _ = require("lodash")
const nodemailer= require('nodemailer');

const config ={
  service: 'gmail',
  auth:{
    user:"iftikhar.satussystems@gmail.com",
    pass:"fpwf pnai gprh buhu"
  }
}
var transporter=nodemailer.createTransport(config);

var defaultMail={
  from:"iftikhar.satussystems@gmail.com",
  text:"This is for test"
}
const send= (to,subject, html) =>{
  //use default settings
  mail= _.merge({html},defaultMail, to)
  transporter.sendMail(mail, function(error, info){
    if(error) return console.log(error);
    console.log('Sent mail',info.response)
  });
}

module.exports= {send}