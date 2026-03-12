import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import verifyToken from '../utils/verifyToken.js';

export const signup = async (req, res) => {
    try {
        const { name,username, email, password, role } = req.body;
        
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({
            name,
            username,
            email,
            password,
            role
        });
        
        if (user) {
            res.status(201).json({
                token: generateToken(user._id, user.role),
                message: 'signup completed successfully',
                success: true,
                user: {
                    _id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                }
            })
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username }).select('+password');
        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(200).json({
                success: true,
                token: generateToken(user._id, user.role),
                message: 'login completed successfully',
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    profilePicture: user.profilePicture,
                    isVerified: user.isVerified
                }
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
        
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

export const verifyUserToken = async (req, res) => {
    try {
        console.log("Entered")
        const userId = verifyToken(req)?.id || false;
        console.log(userId);
        
        const user = await User.findById( userId );
        console.log(user);
        
        if (user) {
            res.json({
                success: true,
                user:{
                    _id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    profilePicture: user.profilePicture,
                    isVerified: user.isVerified
                }
            })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" + error.message });
    }
};