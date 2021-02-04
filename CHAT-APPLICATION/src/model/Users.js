const mongoose=require('mongoose')

const Userschema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            min:6
        },
        email:{
            type:String,
            required:true,
            min:16
        },
        password:{
            type:String,
            required:true,
            min:6
        }

    }
);

module.exports=mongoose.model('Users',Userschema)