// const socket = require('socket.io')
const socket = io();





//elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocation = document.querySelector('#send-location')
const $messagesLeft = document.querySelector('#messages-left')
const $messagesRight = document.querySelector('#messages-right')
const $sidebar = document.querySelector('#sidebar')
const $sidebarheader = document.querySelector('#sidebarheader')

//templates
const messageTemplateLeft = document.querySelector('#message-template-left').innerHTML
const messageTemplateRight = document.querySelector('#message-template-right').innerHTML
//const locationTemplate = document.querySelector("#location-template").innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
const sidebarheaderTemplate = document.querySelector('#sidebarheader-template').innerHTML
const locationTemplateLeft = document.querySelector("#location-template-left").innerHTML
const locationTemplateRight = document.querySelector("#location-template-right").innerHTML



//  const user= localStorage.getItem('joinroomdetails');

 const username = localStorage.username;
 const rno= localStorage.roomno;
 console.log(username)
 console.log(rno)

socket.emit('join', {username:username, room:rno} , (error)=> {
    console.log(username,room);
    if(error)
    {
        alert(error)
        location.href = '/'
    }
})
 
socket.on('receiveMessage', (message,id) => {
   // console.log(socket.id)
   console.log(message)
     if(id === socket.id)
     { 
        const htmlL = Mustache.render(messgeTemplateLeft,{
        clr : 'transparent',
        username : message.username,
        message : message.text,
        createdAt : moment(message.createdAt).format('h:mm a')
       })
    
        const htmlR = Mustache.render(messageTemplateRight,{
        clr : '#874e4c',
        username : message.username,
        message : message.text,
        createdAt : moment(message.createdAt).format('h:mm a')
      })

       $messagesRight.insertAdjacentHTML('beforeend',htmlR)
       $messagesLeft.insertAdjacentHTML('beforeend',htmlL)
     }

     else
     {  
        const htmlL = Mustache.render(messageTemplateLeft,{
        clr : '#874e4c',
        username : message.username,
        message : message.text,
        createdAt : moment(message.createdAt).format('h:mm a')
       })
    
        const htmlR = Mustache.render(messageTemplateRight,{
        clr : 'transparent',
        username : message.username,
        message : message.text,
        createdAt : moment(message.createdAt).format('h:mm a')
      })

        $messagesRight.insertAdjacentHTML('beforeend',htmlR)
        $messagesLeft.insertAdjacentHTML('beforeend',htmlL)

     }
        var objDiv = document.getElementById("data");
        objDiv.scrollTop = objDiv.scrollHeight;
})

socket.on('receiveLocation', (message,id) => {
    if(id === socket.id)
    {
      const htmlL = Mustache.render(locationTemplateLeft,{
          clr:'transparent',
          align:'',
          username : message.username,
          url : message.url,
          createdAt: moment(message.createdAt).format('h:mm a')
      })
    
      const htmlR = Mustache.render(locationTemplateRight,{
          clr:'#874e4c',
          align:'right',
          username : message.username,
          url : message.url,
          createdAt: moment(message.createdAt).format('h:mm a')
      })
    
         $messagesRight.insertAdjacentHTML('beforeend',htmlR)
         $messagesLeft.insertAdjacentHTML('beforeend',htmlL)
     
    }
    else
    {
      const htmlL = Mustache.render(locationTemplateLeft,{
        clr:'#874e4c',
        align:'',
        username : message.username,
        url : message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
      })
  
      const htmlR = Mustache.render(locationTemplateRight,{
        clr:'transparent',
        align:'',
        username : message.username,
        url : message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
      })
      
         $messagesRight.insertAdjacentHTML('beforeend',htmlR)
         $messagesLeft.insertAdjacentHTML('beforeend',htmlL)  
    }
      var objDiv = document.getElementById("data");
      objDiv.scrollTop = objDiv.scrollHeight;
})

socket.on('roomData' , (data) => {
    console.log(data.users)
    const html = Mustache.render(sidebarTemplate,{
        users: data.users
    })
    $sidebar.innerHTML=html

    const html1 = Mustache.render(sidebarheaderTemplate,{
        room: data.roomname
    })
    $sidebarheader.innerHTML=html1
})


$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    var objDiv = document.getElementById("data");
    objDiv.scrollTop = objDiv.scrollHeight;
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value
    socket.emit('sendMessage',message, (error) => {
        
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        if(error)
        {
            return alert(error)
        }
        console.log('message delivered!')
    })
})

$sendLocation.addEventListener('click', () => {

    var objDiv = document.getElementById("data");
    objDiv.scrollTop = objDiv.scrollHeight;

    if(!navigator.geolocation){
        return alert('geoloaction not supported by your browser')
    }

    $sendLocation.setAttribute('disabled', 'diasbled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },(message) => {
            $sendLocation.removeAttribute('disabled')
            return console.log(message)
        })
    })
})



