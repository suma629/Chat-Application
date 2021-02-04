const jwt=require('jsonwebtoken')
const cookieparser=require('cookie-parser')
module.exports=function auth(req,res,next){
   
    const token = req.cookies.token;
   
     if(!token)
       return res.status(401).send('Access Denied');

       try
       {
           const verified=jwt.verify(token,process.env.SECRET_TOKEN);
           req.user=verified;
            next()
       }
       catch(err)
       {
           return res.status(401).send('INVALID TOKEN');
       }
}