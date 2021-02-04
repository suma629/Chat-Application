
const router=require('express').Router();
const users=require('../model/Users')

const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const verify=require('../controllers/verifytoken')
const { registerValidation , loginValidation }=require('../utils/validation')


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
 
  
  try{
      const savedUser=await user.save();
   
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
  
      res.cookie("token",token)
       res.send(token)
})

router.post('/join',verify,(req,res)=>{ 
      
  return res.send('success')
})
 



module.exports = router;