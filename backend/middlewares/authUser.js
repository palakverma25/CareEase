//  import jwt from "jsonwebtoken"
 
//  //user authentication middleware
//  const authUser = async (req,res,next)=>{
//      try{
//          const {token}=req.headers
//          if(!token){
//              return res.json({success:false,message:"Not authorized Login Again"})
//          }
 
//          console.log("JWT_SECRET:", process.env.JWT_SECRET);
//          const token_decode=jwt.verify(token,process.env.JWT_SECRET)
//         //  console.log(token_decode.email);
//         //  console.log(process.env.ADMIN_EMAIL );
//         req.body.userId=token_decode.id
        
//          next()
 
 
//      }catch (error){
//          console.log(error)
//          res.json({success:false,message:error.message})
//      }
//  }
//  export default authUser
import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token properly

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized. Please log in again." });
    }

    console.log("Received token:", token);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", token_decode);

    req.user = { id: token_decode.id }; // Attach user ID to request object
    next(); // Proceed to the next middleware/controller

  } catch (error) {
    console.log("Token verification error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authUser;
