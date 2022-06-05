let loader = document.querySelector('.loader');
let user = JSON.parse(sessionStorage.user || null);

const becomeSellerElement = document.querySelector('.become-seller');
const productListingElement = document.querySelector('.product-listing');
const applyForm = document.querySelector('.apply-form');
const showApplyBtn = document.querySelector('#apply-btn');

window.onload = () => {
    //check if the user exists in session or not
    if (user){
        if(compareToken(user.authToken, user.email)){
            if(!user.seller){
                becomeSellerElement.classList.remove('hide');  // if true remove the hide class from the become seller element
            } else {
               loader.style.display = 'block';
               setupProducts();
            }
        } else {
            location.replace('/logging');
        }
    } else {   // if user not in session redirect him to the login page
        location.replace('/logging');
    }
}

showApplyFormBtn.addEventListener('click', () => {
    becomeSellerElement.classList.add('hide'); // hide class to become seller element and remove hide class from apply form
    applyForm.classList.remove('.hide');
})

//for submission
const applyFormButton = document.querySelector('#apply-form-btn');
const businessName = document.querySelector('#business-name');
const address = document.querySelector('#business-add');
const about = document.querySelector('#about');
const number = document.querySelector('#number');
const tac = document.querySelector('#terms-and-cond');
const legitInfo = document.querySelector('#legitInfo');

applyForm.addEventListener('click', () => {
    if (!businessName.value.length || !address.value.length || !about.value.length
        || !number.value.length){   // validating the user
            showAlert('fill all the inputs'); // alert the user
        } else if (!tac.checked || !legitInfo.checked){
            showAlert('you must agree to our terms and conditions');
        } else {
            // making server request
            loader.style.display = 'block';  //hide the loader first
            sendData('/seller',{
                name: businessName.value,
                address: address.value,
                about: about.value,
                number: number.value,
                tac: tac.checked,
                legit: legitInfo.value,
                email: JSON.parse(sessionStorage.user).email    // JSON.PARSE convert the string into object and then access the email key from the object
            })
        }
            
})

const setupProducts = () => {
    fetch('/get-products', { 
        method: 'post',
        headers: new Headers({"Content-Type": "application/json"}),
        body: JSON.stringify({email: user.email})
    })
    .then (res => res.json ())
    .then(data => console.log(data));
    loader.style.display = null;
    productListingElement.classList.remove('hide');
    if(data == 'no products'){
        let emptySvg = document.querySelector('.no-product-image');
    }else {
        data.forEach(product => createProduct (product));
    }
}