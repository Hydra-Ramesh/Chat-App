import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) =>{
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Not authorized, no token"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message:"Not authorized, token expired"});
        }
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(401).json({message:"Not authorized, user not found"});
        }
        req.user = user;
        next();
    }catch(e){
        console.error(e);
        res.status(401).json({message:"Not authorized, token failed"});
    }
}