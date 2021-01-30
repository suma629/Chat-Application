
const router=require('express').Router();
const users=require('../model/Users')
const rooms=require('../model/Rooms')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const verify=require('./verifytoken')
const connect = require('../controllers/connection')
const { registerValidation , loginValidation }=require('../validation')
//const socket = io();

router.post('/register', async (req, res)=>{

    const {value, error}=registerValidation(req.body);
    if(error)
     return res.status(400).send(error.details[0].message)

 const emailExist= await users.findOne({email:req.body.email})
     if(emailExist)
       return res.status(400).send('Email already exists');

    const salt= await bcrypt.genSalt(10);   
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user=new users(
      {
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword
      }
  );
 
  console.log(req.body);
  try{
      const savedUser=await user.save();
    //   res.send(savedUser);
       res.send({
           "user" : user.id,
           "name":user.name
       })
  }
  catch(error)
  {
   res.status(400).send(error)
  }
});



  router.post('/login', async(req,res)=>{

    const {value,error} = loginValidation(req.body);

    //console.log(error)
 
    if(error)
      return res.status(400).send(error.details[0].message);

    const user=req.body;
  
   const emailExist= await users.findOne({ email : req.body.email });
     if(emailExist === null)
      return res.status(400).send('user does not exist');

   const validPassword= await bcrypt.compare(req.body.password, emailExist.password);
    if(!validPassword)
      return res.status(400).send('Wrong Password');

      const token =jwt.sign({_id:user._id},process.env.SECRET_TOKEN)
      console.log(token)
      res.cookie("token",token)
       res.send(token)
})

router.post('/join',verify,(req,res)=>{ 
       //res.redirect('./chat')
      // const userdata = req.body;
      // const app = req.app
      // const io = app.get('io');
      // req.io=io
      // connect(userdata);
  return res.send('success')
})
 
// router.get('/chat',con(req,res)=>{
     
// })


module.exports = router;