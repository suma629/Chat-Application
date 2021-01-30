const { string } = require('joi');
const mongoose=require('mongoose')

const Roomschema=new mongoose.Schema(
    {
        roomname:{
            type:String,
            required:true,
        },
         users :[
              {
                username: String, 
                socketid: String
              }
              ]
           
    }
);

module.exports=mongoose.model('Rooms',Roomschema)