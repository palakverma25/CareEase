import dotenv from "dotenv";
dotenv.config();
import validator from "validator"
import bcrypt from "bcrypt"
import {v2 as cloudinary} from "cloudinary"
import doctorModel from "../models/doctorsModel.js";
import jwt from "jsonwebtoken"

//api for adding doctor

const addDoctor=async (req,res) =>{
    try{
        const {name,email, password, speciality,degree,experience,about, fees,address}=req.body
        const imageFile=req.file

        //checking for all data to add doctor
        if(!name  || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
            return res.json({success:false,message:"Missing Details"})
        }

        //Validating email format 
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please enter a valid email"})
        }

        //validating strong  password
        if(password.length<8){
            return res.json({success:false,message:"Please enter a strong password"})
        }

        //hashing doctor password
        const salt= await bcrypt.genSalt(10)
        const hashedPassword= await bcrypt.hash(password,salt)

        //upload image to cloudinary
        const imageUpload =await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
        const imageUrl =imageUpload.secure_url

        const doctorData={
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({success:true,message:"Doctor added"})
    } catch (error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
//API for admin login
const loginAdmin= async(req,res)=>{
    try{
        const {email,password}=req.body
        if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.json({ success: true, token });
        }
    }catch (error){
        console.log(error)
        res.json({success:false,message:"Invalid credentials"})
    }
}
//api to get all doctors list for admin panel
const allDoctors=async(req,res)=>{
    try{
        const doctors=await doctorModel.find({}).select('-password')
        console.log("Doctors fetched:", doctors); console.log("Doctors fetched:", doctors); 
        if (!doctors || doctors.length === 0) {
            return res.json({ success: false, message: "No doctors found" });
        }

        res.json({ success: true, doctors });
    }catch (error){
        console.log(error)
        res.json({success:false,message:"Invalid credentials"})
    }
}
export {addDoctor,loginAdmin,allDoctors}