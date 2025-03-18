import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoutes.js"; // Ensure the correct filename

// Initialize Express app
const app = express();
const port = process.env.PORT || 4000;

// Connect to Database and Cloudinary
connectDB().catch((err) => {
  console.error("❌ MongoDB Connection Failed:", err);
});
connectCloudinary();

// ✅ Configure CORS Middleware
const allowedOrigins = [
  "http://localhost:5173",  // Vite frontend
  "http://localhost:3000",  // React frontend
  "https://care-ease.vercel.app/" // Vercel frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("❌ CORS Not Allowed"));
      }
    },
    credentials: true, // ✅ Allows cookies & auth headers
    methods: ["GET", "POST", "PUT", "DELETE"], // ✅ Allowed HTTP methods
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ API Routes
app.use("/api/admin", adminRouter); 
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("🚀 API is working!");
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`🚀 Server started on http://localhost:${port}`);
});

// ✅ Debugging
console.log("✅ ENV VARIABLES LOADED:");
console.log("PORT:", process.env.PORT || "4000");
console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL || "Not set");
console.log("ADMIN_PASSWORD:", process.env.ADMIN_PASSWORD ? "Loaded" : "Not set");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Loaded" : "Not set");
