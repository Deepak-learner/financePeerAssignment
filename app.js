//jshint esversion:6

const express=require("express");
const bodyParser = require("body-parser");
const ejs = require("express");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app= express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/encryptDb" ,{useNewUrlParser:true} );

app.get("/",function(req,res){
  res.render("home");
});

app.get("/success",function(req,res){
  res.render("uploadedSuccessfully");
});


app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.get("/home",function(req,res){
  res.render("home");
});

app.get("/uploadFile",function(req,res){
  res.render("upload");
});





const userSchema=new mongoose.Schema({
  email:String,
  password:String
});

const secret = "this is our secret message";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password']  });

const User=new mongoose.model("User",userSchema);

app.post("/register",function(req,res){
  const newUser=new User({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.render("bank");
    }
  });
});

app.post("/login",function(req,res){

    const username=req.body.username;
    const password=req.body.password;

    User.findOne({email:username},function(err,foundUser){
      if(err){
        console.log(err);
      }else{
        if(foundUser){
          if(foundUser.password===password){
            console.log("Decrypted Password :" +foundUser.password);
            res.render("bank");
          }
        }
      }
    });
});





const paymentSchema= new mongoose.Schema({
  cname:String,
  cnum:Number,
  cvv: Number
});


paymentSchema.plugin(encrypt, { secret: secret, encryptedFields: ['cvv']  });

const Payment=new mongoose.model("Payment",paymentSchema);

app.post("/payment",function(req,res){
  const newUsers=new Payment({
    cname:req.body.cardname,
    cnum:req.body.cardnumber,
    cvv:req.body.cvv
  });
  newUsers.save(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.render("successPayment");
    }
  });
});

app.listen(3000 , function(){

    console.log("server start on port 3000");

});
