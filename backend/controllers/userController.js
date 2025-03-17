import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorsModel.js'
import appointmentModel from '../models/appointmentModel.js'
//api to register user
const registerUser=async (req,res)=>{
    try{
        const {name,email,password}=req.body
        if(!name || !email || !password){
            return res.json({success:false,message:"Missing Details"})
        }
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Enter valid email"})
        }
        if(password.length<8){
            return res.json({success:false,message:"Enter a strong password"})
        }
        //hashing user password
        const salt =await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        const userData={
            name,
            email,
            password:hashedPassword
        }
        const newUser=new userModel(userData)
        const user = await newUser.save()
        //_id for creating token
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
        res.json({success:true,token})

    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api for user login
const loginUser=async (req,res)=>{
    try{
        const {email,password}=req.body
        const user=await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:'User does not exist'})
        }

        const isMatch=await bcrypt.compare(password,user.password)

        if(!isMatch){
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }else{
            res.json({success:false,message:"Invalid credentials"})
        }
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
//api to get user profile data
const getProfile=async (req,res)=>{
    try{
        const {userId} =req.body
        const userData=await userModel.findById(userId).select('-password')
        res.json({success:true,userData})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api to update user profile
const updateProfile=async(req,res)=>{
    try{
        const {userId,name,phone,address,dob,gender}=req.body
        const  iamgeFile=req.file
        if(!name || !phone || !dob || !gender){
            return res.json({success:false,message:"Data missing"})
        }
        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})
        if(imageFile){
            //uploading image to cloudinary
            const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageURL=imageUpload.secure_url
            //saving in users data
            await userModel.findByIdAndUpdate(userId,{image:imagrURL})
        }
        res.json({success:true,message:"Profile updated"})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api to book appointment
const bookAppointment =async (req,res)=>{
    try{
        const {userId,docId,slotDate,slotTime}=req.body
        const docData=await doctorModel.findById(docId).select('-password')
        if(!docData.available){
            return res.json({success:false,message:'Doctor not available'})
        }
        let slots_booked=docData.slots_booked
        //checking fr slots availability
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].include(slotTime)){
                return res.json({success:false,message:'Slot not available'})
            }else{
                slots_booked[slotDate].push(slotTime)
            }
        }
        else{
            slots_booked[slotDate]=[]
            slots_booked[slotDate].push(slotTime)
        }
        const userData=await userModel.findById(userId).select('-password')
        delete docData.slots_booked
        const appointmentData={
            userId,
            docId,
            userData,
            docData,
            amount:docData.fees,
            slotTime,
            slotDate,
            date:Date.now()
        }
        const newAppointment=new appointmentModel(appointmentData)
         await newAppointment.save() 
          //save new slots in docData 
          await doctorModel.findByIdAndUpdate(docId,{slots_booked})
          res.json({success:true,message:'Appointment Booked'})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
export {registerUser,loginUser,getProfile,updateProfile,bookAppointment}