const APIError = require("../utils/apiError.js")
const User = require("../models/user.models.js")
const jwt = require('jsonwebtoken')

const authMiddleware = async (req , res , next) => {
    const token = req.cookies?.Access_Token;
    if(!token) {
        return res.status(404).json(new APIError("You are not logged In"))
    }
    const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET);

    const id = decodedToken._id;
    const user = await User.findById(id);

    req.user = user
    next()
}

module.exports = authMiddleware