const path = require('path')
const express = require('express')
 const app = express()
const http = require('http')
const socketio = require('socket.io')
const cookieparser=require('cookie-parser')
const Filter = require('bad-words')
const dotenv=require('dotenv')
const mongoose=require('mongoose')
const rooms=require('../model/Rooms')
const {generateMessage, generateLoactionMessage} = require('../src/utils/messages')
const {removeUser, getUser, getUsersInRoom} = require('../src/utils/users')


dotenv.config()
//middleware

app.use(express.json())
app.use(cookieparser())
//router middleware
const authroute=require('../routes/auth');
app.use('/api/user',authroute)





const server = http.createServer(app)
 const io = socketio(server)


const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))



mongoose.connect(process.env.DB_CONNECT, {  useNewUrlParser:true , useUnifiedTopology: true  } ,()=>
  console.log('connected to db') );

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));

      //  function(req,res,next){
      //const io = req.io;
      console.log('hello');
    io.on('connection', (socket) => {
        console.log('new websocket connection')
          console.log(socket.id)
        socket.on('join', async(userobj, callback) => {         
           
          console.log(userobj)
           const  user = {id:socket.id, username:userobj.username, roomname:userobj.room}
          
           console.log('hello',user);
          const roomExist= await  rooms.find({roomname:user.roomname})
                    console.log('hello2',roomExist)         
         if(roomExist)
         {
                     console.log('hell03',roomExist)      
                     const dupuser={username:user.username, socketid : user.id}  
                    //  roomExist.users.push({username:user.username , socketid:user.socektid})
                   roomExist.users.push(dupuser)
              roomExist.save();
         }
         else{
             console.log('hello4')
                const room=new rooms()
                 room.roomname=user.roomname
                room.users.push({username:user.username , socketid:user.socektid})
                console.log(user.roomname)
                const savedroom=await room.save();
         }
        
        
           console.log(user)
           socket.join(user.roomname)
           socket.broadcast.to(user.roomname).emit('receiveMessage', generateMessage(user.username+' has joined!',null) , null)
           console.log(generateMessage(user.username+' has joined!',null))
           socket.emit('receiveMessage',generateMessage('Welcome! '+user.username,null), null)
           io.to(user.roomname).emit('roomData', {
             room: user.roomname,
             users: getUsersInRoom(user.roomname) 
                   })
           callback()
        })
    
        socket.on('sendMessage', (message , callback) => {
          console.log(message)
        const filter = new Filter()
        if(filter.isProfane(message)){
          return callback('Profanity is not allowed')
        }
          const user = getUser(socket.id)
          console.log(user)
          io.to(user.roomname).emit('receiveMessage',generateMessage(user.username,message),user.id)
          callback()
        })
    
        socket.on('sendLocation', (coords , callback) => {
          const user = getUser(socket.id)
          io.to(user.room).emit('receiveLocation', generateLoactionMessage(user.username,'https://www.google.com/maps?q='+coords.latitude+','+coords.longitude), user.id)
          callback('location delivered!')
        })
      
     
        socket.on('disconnect',() => {
           console.log('discoonected')
          const user = removeUser(socket.id)
          if(user){
          io.to(user.room).emit('receiveMessage',generateMessage(user.username+' has left'), null)
          io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
          })
          }
        })
      })
    
     


server.listen(port, () => {
    console.log('port no.')
    console.log(port)
})

module.exports = {
  server: server
}
