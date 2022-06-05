// redirect to home page if user logged in adding load event to the window
//(meaning if the user is logged in, will not be able to access the sign-in or sign-up pages)
window.onload = () => {
    if(sessionStorage.user){  //check if any user exists in session or not 
       //to access the user data in session storage  use JSON.parse
       user = JSON.parse(sessionStorage.user);
       
       //if the user exists compare the authToken
       if(compareToken(user.authToken, user.email)){
           //redirect user to home root 
           location.replace('/');      
      }
    }
}
const loader = document.querySelector('.loader');               // select the loader

// select inputs
const submitBtn = document.querySelector('.submit-btn');
const name = document.querySelector('#name') || null;   //  || null, it is an OR operator  meaning if the variable input is not available it is set to null  
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const number = document.querySelector('#number') || null;
const tac = document.querySelector('#terms-and-cond') || null;
const notification = document.querySelector('#notification') || null;

submitBtn.addEventListener('click', () => {           // click event to submit button
if (name != null){                                  // check if name is null or not if not that means we are on sign up page
        if(name.value.length < 3){                         // if -to validate the form name.value - to validate and call field value ang length -gives the number of letters in the string
        showAlert('name must be 3 letters long');
    } else if(!email.value.length){                    // ! shows the boolean type (changing true into false and false into true)
        showAlert('enter your email');                                        // we perform validation
    } else if(password.value.length  < 8){
        showAlert('password should be 8 letters long');
    } else if(!number.value.length){
        showAlert('enter your phone number'); 
    } else if(!Number(number.value) || number.value.length < 10){        // since we are using 'text' in the number field and Number is a js which the parameter is a number or not, just parse the text field value to check if the user entered a numerical value
       showAlert('invalid number, please enter the valid one');          
    } else if(!tac.checked){
        showAlert('you must agree to our terms and conditions');           //checked returns the check status of the check box if it's checked or not
    } else {
        //submit form
        loader.style.display = 'block';                         // setting the loader to display in a block method
        sendData('/signup', {                                   // call the function (sendData), parse signup as the first argument and object as second argument
            name: username.value,
            email: email.value,
            password: password.value,
            number: number.value,
            tac: tac.checked,
            notification: notification.checked,
            seller: false
        })                                           
    }         
  } 
  else {
      // if the name is equal to null, meaning we are on logging page
      //make validation
      if(!email.value.length || !password.value.length){
          showAlert('fill all the inputs');
      } else {
           loader.style.display = 'block';                         // setting the loader to display in a block method
        sendData('/logging', {                                   // call the function (sendData) to send the data, parse signup as the first argument and object as second argument
            email: email.value,
            password: password.value
        })                                           
      }
  }                                                    
})

//send data function
const sendData = (path, data) => {                            //function for sending data to the server, path and data because same function is used for login and signup form
    fetch(path, {                                                      //fetch to send data
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify(data)
    })
    .then((res) => res.json())                      //catch the response                                   
    .then(response => {                             // then produce response
      processData(response);                          // for processing the data        //console.log(response);  the response will be produced/ redirected to the login page
      })
}                                                    

const processData = (data) => {
    loader.style.display = null;                     // hiding the loader
    if(data.alert){                                  // to check if the data as alert key or not
        showAlert(data.alert);                       //if so show the alert
    } else if (data.name){
        // create authToken 
        data.authToken = generateToken(data.email);

        //store the data into session storage and pass the data into JSON.stringify otherwise the data will not be accessible
        sessionStorage.user = JSON.stringify(data);

        // redirect user to home root
        location.replace('/');

    }
};
//alert function
const showAlert = (msg) => {                               //creating the function with its argument
    let alertBox = document.querySelector('.alert-box');
    let alertMsg = document.querySelector('.alert-msg');                        // selecting alert box and msg element 
    alertMsg.innerHTML = msg;                                  //alert msg inner html is set to display the msg
    alertBox.classList.add('show');                     // show class is added to the alertBox
    setTimeout(() => {                                 // is set to remove the show class after 3 sec
        alertBox.classList.remove('show');
    }, 3000)
}