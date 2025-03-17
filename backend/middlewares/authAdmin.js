import jwt from "jsonwebtoken"

//admin authentication middleware
const authAdmin = async (req,res,next)=>{
    try{
        const {atoken}=req.headers
        if(!atoken){
            return res.json({success:false,message:"Not authorized palak Login Again"})
        }

        console.log("JWT_SECRET:", process.env.JWT_SECRET);
        const token_decode=jwt.verify(atoken,process.env.JWT_SECRET)
        console.log(token_decode.email);
        console.log(process.env.ADMIN_EMAIL );
        if(token_decode.email!==process.env.ADMIN_EMAIL ){
            console.log("alhamdulla");
            return res.json({success:false,message:"Not authorized Login Again"})
        }
        next()


    }catch (error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
export default authAdmin