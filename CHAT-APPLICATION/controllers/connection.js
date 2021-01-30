//const server = require('../src/index')
//const socketio = require('socket.io')
// const io = socketio(server)
const Filter = require('bad-words')
const rooms=require('../model/Rooms')
// const mongoose=require('mongoose')
const {generateMessage, generateLoactionMessage} = require('../src/utils/messages')
const {removeUser, getUser, getUsersInRoom} = require('../src/utils/users')

module.exports = function(io){
async(req,res,next)=> {
  //const io = req.io;
   io.on('connection', (socket) => {
    console.log('new websocket connection')
   
    socket.on('join', async(userobj, callback) => {
       
       const  {error,user} = {id:socket.id, username:userdat.username, room:userdata.room}
      const roomExist=  await rooms.findOne({roomname:userdata.roomname})
                         
     if(roomExist)
     {
          roomExist.users.push({username:userdata.username , socketid:userdata.socektid})
          roomExist.save();
     }
     else{
            const room=new rooms()
             room.roomname=userdata.roomname
            room.users.push({username:userdata.username , socketid:userdata.socektid})
            const savedroom=await room.save();
     }
    
    //  res.send({
    //      "roomname" : room.roomname
    //  })

   
    //    console.log(user);
       if (error){
         return callback(error) 
       }
       console.log(user)
       socket.join(user.roomname)
       socket.broadcast.to(user.roomname).emit('receiveMessage', generateMessage(user.username+' has joined!') , null)
       socket.emit('receiveMessage',generateMessage('Welcome! '+user.username), null)
       io.to(user.roomname).emit('roomData', {
         room: user.roomname,
         users: getUsersInRoom(user.roomname) 
               })
       callback()
    })

    socket.on('sendMessage', (message , callback) => {
    const filter = new Filter()
    if(filter.isProfane(message)){
      return callback('Profanity is not allowed')
    }
      const user = getUser(socket.id)
      io.to(user.room).emit('receiveMessage',generateMessage(user.username,message),user.id)
      callback()
    })

    socket.on('sendLocation', (coords , callback) => {
      const user = getUser(socket.id)
      io.to(user.room).emit('receiveLocation', generateLoactionMessage(user.username,'https://www.google.com/maps?q='+coords.latitude+','+coords.longitude), user.id)
      callback('location delivered!')
    })
  

    socket.on('disconnect',() => {
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
  // res.send("exited room")
  // next()
}
}
