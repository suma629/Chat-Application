const rooms = require("../../model/Rooms")
const mongoose=require('mongoose')
const db = mongoose.connection;
// const addUser = ({id, username, room}) => {

//     // /console.log(username);
//     username = username.trim().toLowerCase()
//     room = room.trim().toUpperCase()
 

//     if(!username || !room){
      
//       return {error:"username and room are required",user:null}
//     }

//     const existingUser = users.find((user) => {
//         return user.username === username && user.room === room
//     })
    
//     if(existingUser){
//       return {error:"username in use",user:null}
//     }
//     const user = {id, username, room}
//     users.push(user)
//     return {error:null,user:user}
// }

const getUser = (id) => {
    const user = rooms.find( {socketid : id} )
    console.log(user.username);
    //  db.collection('rooms').find({ 
    //    "users.socketid" : id 
    // })
     return user.roomname;
}

const getUsersInRoom = (room) => {

    const roomExist =  rooms.findOne({roomname:room}) 
    const usersinroom = roomExist.users;
    return usersinroom;
}

const removeUser = (id) => {
    const index = rooms.find({ 
        "users.socketid" : id 
     })
   rooms.update(
       { $pull : {users : {socketid : id} } }
   )
   return index;
    // const index = users.findIndex((user) => {
    //     return user.id === id
    // })

    // if(index != -1)
    // {
    //     return users.splice(index, 1)[0]
    // }
}

module.exports = {
    removeUser,
    getUser,
    getUsersInRoom
}