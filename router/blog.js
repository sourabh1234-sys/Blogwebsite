const {Router} = require('express');
const Blog = require('../model/blog')
const multer = require('multer')
const path = require('path')
const Comment = require('../model/comment')

const router = Router();

const storage = multer.diskStorage({
    destination : function (req , file , cb) {
        return cb(null , path.resolve(`./public/uploads/`))
    },
    filename : function (req , file , cb) {
        return cb(null , `${Date.now()}-${file.originalname}`)
    },
})

const upload = multer({storage : storage})




router.get('/addblog' ,  async (req  , res) => {
    
    return res.render('addblog' , {
        user : req.user
        
    })
})

router.get('/:id' ,  async (req  , res) => {
    
    const blog = await Blog.findById(req.params.id).populate("createby");
    const comment = await Comment.find({blogid:req.params.id}).populate("createby")
    console.log("blog: ",blog)
    return res.render('userblog',{
        user: req.user,
        blog,
        comment,
        
    })
});

router.post('/' , upload.single("coverphoto") ,async (req  , res) => {
    
    console.log(req.body);
    const { title , body } = req.body
    console.log(req.file);
    
    const blog = await Blog.create({title , body , createby:req.user._id ,coverphoto:`/uploads/${req.file}`})

    return res.redirect(`/blog/${blog._id}`)
})

router.post('/comment/:blogid'  ,async (req  , res) => {
    const comment = await Comment.create(
        {
            content : req.body.content,
            name : req.body.name,
            blogid : req.params.blogid,
            createby    : req.user._id,

        }
    )

    return res.redirect(`/blog/${req.params.blogid}`)
})



module.exports = router