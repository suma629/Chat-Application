const path = require('path')
const express = require('express')
 const app = express()
const http = require('http')
const socketio = require('socket.io')
const cookieparser=require('cookie-parser')
const Filter = require('bad-words')
const dotenv=require('dotenv')
const mongoose=require('mongoose')
const verify = require('./src/controllers/verifytoken')


const {generateMessage, generateLoactionMessage} = require('./src/utils/messages')
const {addUser,removeUser, getUser, getUsersInRoom} = require('./src/utils/users')
const authroute=require('./src/routes/auth');

dotenv.config()
//middleware

app.use(express.json())
app.use(cookieparser())
//router middleware

app.use('/api/user',authroute)

app.get('/join',verify,(req,res) => res.sendFile( __dirname + '/private/join.html'))
app.get('/chat',verify,(req,res) => res.sendFile( __dirname + '/private/chat.html'))







const server = http.createServer(app)
 const io = socketio(server)

 io.set('transports', ['websocket'])

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '/public')

app.use(express.static(publicDirectoryPath))


mongoose.connect(process.env.DB_CONNECT, {  useNewUrlParser:true , useUnifiedTopology: true  } ,()=>
  console.log('connected to db') );

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));

    
      
      io.on('connection', (socket) => {
          console.log('new websocket connection')
        
          socket.on('join', (userobj, callback) => {         
           
           
            console.log(userobj.username);
            const  {user,error} = addUser({id:socket.id, username:userobj.username, roomname:userobj.room})
            // console.log(user)

           if(error)
           return callback(error)   

        
           socket.join(user.roomname)
       
           socket.broadcast.to(user.roomname).emit('receiveMessage', generateMessage(user.username+' has joined!',null) , null)
          
           socket.emit('receiveMessage',generateMessage('Welcome! '+user.username,null), null)
           io.to(user.roomname).emit('roomData', {
             roomname: user.roomname,
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
          io.to(user.roomname).emit('receiveLocation', generateLoactionMessage(user.username,'https://www.google.com/maps?q='+coords.latitude+','+coords.longitude), user.id)
          callback('location delivered!')
        })
      
        
        socket.on('disconnect',() => {
           console.log('discoonected')
           const user = removeUser(socket.id)
          if(user){
          io.to(user.roomname).emit('receiveMessage',generateMessage(user.username+' has left'), null)
          io.to(user.roomname).emit('roomData', {
            room: user.roomname,
            users: getUsersInRoom(user.roomname)
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
