const Router = require('express')
const {handleRegisterUser} = require('../controllers/user.controllers.js')
const multerFileUpload = require('../middlewares/multer.js')

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

module.exports = router