import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import validator from "validator";

// login user
const loginUser = async (req, res) =>{
    const {email, password} = req.body;
    try{
        const user = await userModel.findOne({email});
        if(!user)
        {
            return res.json({success:false, message:"User does not exists!"});
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch)
        {
            return res.json({success:false, message:"Invalid credentials!"});
        }
        const token = createToken(user._id);
        return res.json({success:true, token});
        
    }catch(error)
    {
        console.log(error);
        res.json({successs:false, message:"Error"});

    }


}



const createToken = (id) => {
    return jwt.sign(
        { id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' } 
    );
}


// register user
const registerUser = async (req, res)=>{
    const {name, password, email, phone, companyName, } = req.body;
    try{
        const exist1 = await userModel.findOne({email});
        const exist2 = await userModel.findOne({phone});
        if(exist1&& exist2)
        {
            return res.json({success:false, message:"User already exists"});

        }
        // validate email format and strong password
        if(!validator.isEmail(email))
        {
            return res.json({success:false, message:"Please enter a valid email!"});
        }
        if ( password.length < 8)
        {
            return res.json({success:false, message:"Please enter a strong password"});
                
        }

        // create account
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = new userModel({
            name:name, 
            email: email,
            phone:phone,
            password:hashedPassword,
            companyName: companyName
        })


        const user = await newUser.save(); 

        const token = createToken(user._id)
        res.json({success:true, token});





    } catch(error)
    {
        console.log(error);
        res.json({success:false, message:"Error"})
    }


}


export { loginUser, registerUser };
