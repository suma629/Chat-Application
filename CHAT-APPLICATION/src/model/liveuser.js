const mongoose=require('mongoose')

const Liveuserschema=new mongoose.Schema(
    {
       username:{
            type:String,
            required:true,
            min:6
        },
        roomname:{
            type:String,
            required:true,
            min:16
        },
        socketid:{
            type:String,
            required:true,
            unique: true,
            min:6
        }

    }
);

module.exports=mongoose.model('Liveusers',Liveuserschema)