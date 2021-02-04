
const users = []

const addUser = ({id, username, roomname}) => {
    
    username = username.trim().toLowerCase()
  
    roomname = roomname.trim().toUpperCase()

    if(!username || !roomname){
      
      return {error:"username and room are required",user:null}
    }

    const existingUser = users.find((user) => {
        return user.username === username && user.roomname === roomname
    })
    
    if(existingUser){
      return {error:"username in use",user:null}
    }
    const user = {id, username, roomname}
    users.push(user)
    return {error:null,user:user}
}

const getUser = (id) => {
    const user = users.find((user) => {
        return user.id === id
    })
    return user
}

const getUsersInRoom = (roomname) => {
    const usersInRoom = users.filter((user) => {
        return user.roomname === roomname
    })
    return usersInRoom
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if(index != -1)
    {
        return users.splice(index, 1)[0]
    }
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}