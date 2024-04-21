import express from 'express'
import { config } from 'dotenv'
import http from "http";
import cors from 'cors'
import mongoose from "mongoose"
import nodemailer from 'nodemailer'
import UserModel from './models/Users.js'
import UserActivityModel from './models/Users_Activity.js'
import SendEmailModel from './models/Send_Email.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

config();

mongoose.connect(process.env.DB_URI)
.then(()=>{console.log("Mongoose server has started...")
})
.catch((err)=>{
    console.error(err)
})
app.get("/", async (req, res)  =>  { return res.send("Ini dibuat khusus untuk Test...") })

app.get("/getListCalendar",(req,res)=>{
   SendEmailModel.find({})
   .then((users)=>{ res.send({success:true,message:"Success",data:users}) })
   .catch((err)=>{ console.log(err) })
})

 app.post("/addEmailToCalendar",async (req,res)=>{
   
   var transporter=  nodemailer.createTransport({
      host: "smtp.gmail.com",
      secure: true,
      service: "gmail",
      port: 465,
      auth: {
          user: "",
          pass: "",
      },
  });
  
  var mailOptions = {
      from: '',
      to: req.body.email,
      subject: 'Technical Test',
      html:'<h1>Hi Salam kenal</h1>'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
         res.send({success:false,message:"Failed"})
      } else {
          console.log(`Email sent:  ${req.body.email} | info : ${info.response}`);
          SendEmailModel.create(req.body)
         .then((event)=>{ 
            res.send({success:true,message:"Success",data:event}) })
         .catch((err)=>{ console.log(err) })
      }
  });       
})

 app.get("/findByUser",(req,res)=>{
    const id = req.body.id
    UserModel.findById({_id:id})
    .then((users)=>{ res.send({success:true,message:"Success",data:users}) })
    .catch((err)=>{ console.log(err) })
 })

 app.put("/updateDataUser",(req,res)=>{
    const id = req.body.id
    UserModel.findByIdAndUpdate({_id:id},{email:req.body.email,password:req.body.password,fullname:req.body.fullname})
    .then((users)=>{ res.send({success:true,message:"Success",data:users}) })
    .catch((err)=>{ console.log(err) })
 })

 app.delete("/deleteUser",(req,res)=>{
    const id = req.body.id
    UserModel.findByIdAndDelete({_id:id})
    .then((users)=>{ res.send({success:true,message:"Success",data:users}) })
    .catch((err)=>{ console.log(err) })
 })

 app.post("/login",async(req,res)=>{
   try {
      const user = await UserModel.findOne({ email: req.body.email });
        if (user) {
          const result = req.body.password === user.password;
          if (result) {
            let data={email:req.body.email,activity_name:"Login", activity_time:Date.now()}
            UserActivityModel.create(data)
            .then((users_activity)=>{ res.send({success:true,message:"Success",data:users_activity}) })
            .catch((err)=>{ console.log(err) })
          } else {
            res.send({ success:false, message: "password doesn't match" });
          }
        } else {
          res.send({success:false, message: "User doesn't exist" });
        }
   } catch (error) {
      res.send({ success:false,message: error });
   }
})

app.post("/logout",(req,res)=>{
   let data={email:req.body.email,activity_name:"Logout", activity_time:Date.now()}
   UserActivityModel.create(data)
   .then((users)=>{res.send({success:true,message:"Success",data:users}) })
   .catch((err)=>{ console.log(err) })
})



 http.Server(app).listen(process.env.PORT,()=>{
    console.log("Server has started...")
})
