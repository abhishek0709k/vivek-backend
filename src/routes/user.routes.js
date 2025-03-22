const Router = require('express')
const { handleRegisterUser, handleLoginUser, handleLogoutUser } = require('../controllers/user.controllers.js')
const multerFileUpload = require('../middlewares/multer.js')
const authMiddleware = require('../middlewares/auth.js')

const router = Router()
// adding middlesware multerFileUpload 
router.post('/register', multerFileUpload.fields([ 
    {
        name : "avatar",
        maxCount : 1
    },
    {
        name : "coverImage",
        maxCount : 1
    }
 ]), handleRegisterUser)

router.post('/login', handleLoginUser)
router.post('/logout', authMiddleware, handleLogoutUser)
module.exports = router