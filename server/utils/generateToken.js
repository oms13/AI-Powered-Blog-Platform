import jwt from "jsonwebtoken"

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d', //bhai isko change krna hai last me, accesstoken or refresh token banake
    });
};

export default generateToken;