const {Router} = require('express');
const User = require('../model/user')
const router = Router();

router.get('/signin',(req,res)=>{
    return res.render("signin")
})
router.get('/signup',(req,res)=>{
    return res.render("signup");
})
router.post('/signup', async (req , res) => {
    const { name , email , password  } = req.body
    try {
        await User.create({ name, email, password });
        return res.redirect('/');
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).send("Internal Server Error");
    }
})

router.post('/signin' , async (req , res) => {
    
    try {
        const { email , password  } = req.body
        const token = await User.matchpass(email , password)
        
        return res.cookie('token' , token).redirect('/');
    } catch (error) {
        console.error("Error creating user:", error);
        return res.render('signin' , {
            error : "incorrted user",
        })
    }
})

router.get('/logout' , (req , res) => {
    res.clearCookie('token').redirect('/')
})



module.exports=router;