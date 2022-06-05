let char = `123abcde.fmnopqlABCDE@FJKLMNOPQRSTUVWXYZ456789stuvwxyz0!#$%&ijkrgh'*+-/=?^_${'`'}{|}~`;

const generateToken = (key) => {
    //make a token variable
    let token = '';
    for(let i = 0; i < key.length; i++){
        //inside the variable store the index of char
        let index = char.indexOf(key[i]) || char.length / 2;

        // store randomindexupto index variable
        let randomIndex = Math.floor(Math.random() * index)

        // add 2 characher to the token
        token += char[randomIndex] + char[index - randomIndex];
    }
    return token;
}

// compareToken function validate the token
const compareToken = (token, key) => {
    let string  = '';
    for(let i = 0; i < token.length; i=i+2) {
        let index1 = char.indexOf(token[i]);
        let index2 = char.indexOf(token[i+i]);
        string += char[index1 + index2]; //sum of char index (index1 and index2)
    }
    //checking if string is equal to key or not
    if (string == key){
        return true;
    }
    return false;
}

// common functions needed in sellers dashboard
//send data function
const sendData = (path, data) => {                            //function for sending data to the server, path and data because same function is used for login and signup form
    fetch(path, {                                                      //fetch to send data
        method: 'post',
        headers: new Headers({'content-Type': 'application/json'}),
        body: JSON.stringify(data)
    }).then((res) => res.json())                      //catch the response                                   
      .then(response => {                             // then produce response
      processData(response);                          // for processing the data        //console.log(response);  the response will be produced/ redirected to the login page
      })
}                                                    

const processData = (data) => {
    loader.style.display = null;                     // hiding the loader
    if(data.alert){                                  // to check if the data as alert key or not
        showAlert(data.alert);                       //if so show the alert
    } else if (data.username){
        // create authToken 
        data.authToken = generateToken(data.email);

        //store the data into session storage and pass the data into JSON.stringify otherwise the data will not be accessible
        sessionStorage.user = JSON.stringify(data);

        // redirect user to home root
        location.replace('/');

    } //check if te data is true or not
    else if (data == true){
        //seller page
        let user = JSON.parse(sessionStorage.user);
        user.seller = true;                           //update sellers status
        sessionStorage.user = JSON.stringify(user);  //update the user session
        location.reload();
    } else if(data.product){
        location.href = '/seller';
    }
}
//alert function
const showAlert = (msg) => {                               //creating the function with its argument
    let alertBox = document.querySelector('.alert-box');
    let alertMsg = document.querySelector('.alert-msg');                        // selecting alert box and msg element 
    alertMsg.innerHTML = msg;                                  //alert msg inner html is set to display the msg
    alertBox.classList.add('show');                     // show class is added to the alertBox
    setTimeout(() => {                                 // is set to remove the show class after 3 sec
        alertBox.classList.remove('show');
    }, 3000)
    return false;
}