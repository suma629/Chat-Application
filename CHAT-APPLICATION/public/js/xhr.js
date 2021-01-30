

function login()
{
let Email=document.querySelector('#email');
let Password=document.querySelector('#password');


let xhr=new XMLHttpRequest();
let url="http://localhost:3000/api/user/login";
xhr.open("POST",url,true);

xhr.setRequestHeader("content-Type", "application/json");

var data=JSON.stringify({
   "email": Email.value,
   "password":Password.value
});

xhr.send(data);

//console.log(xhr.responseText)
xhr.onreadystatechange = function () {
     if(xhr.readyState === 4 ) {
         if(xhr.status === 200)
         {
             const authtoken=xhr.responseText;
                //  console.log(authtoken)
         // console.log("Loggedin successfully");
           location.href ="http://localhost:3000/join.html";
         }
         else
         {
           console.log(xhr.responseText)
         document.getElementById("demo").innerHTML="Oops! "+xhr.responseText;
         }
     }
 }
}






function Join()
{
let Username=document.querySelector('#user');
let Roomno=document.querySelector('#rno');


let xhr=new XMLHttpRequest();
let url="http://localhost:3000/api/user/join";
xhr.open("POST",url,true);


xhr.setRequestHeader("content-Type", "application/json");


var data=JSON.stringify({
   "username": Username.value,
   "roomname":Roomno.value
});

xhr.send(data);

//console.log(xhr.responseText)
xhr.onreadystatechange = function () {
     if(xhr.readyState === 4 &&
         xhr.status === 200)
         {
             const msg=xhr.responseText;
              console.log(msg)
         // console.log("Loggedin successfully");
             location.href ="http://localhost:3000/chat.html";
         }
         else
         {
        //  console.log(xhr.responseText)
         document.getElementById("demo").innerHTML="Oops! "+xhr.responseText;
         }
     
 }
}


