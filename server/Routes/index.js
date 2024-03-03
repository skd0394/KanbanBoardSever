const router=require('express').Router();

const authRouter=require('./auth')
const userRouter=require('./user')

router.use(authRouter)
router.use(userRouter)

module.exports=router