const createNav = () => {
    let nav = document.querySelector('.navbar');

    nav.innerHTML = `
    <div class="nav">
    <img src="../img-3/images 1.jpeg" class="brand-logo" alt="" />
    <div class="nav-items">
       <div class="search">
          <input type="text" class="search-box" placeholder="Search hotels,restaurant,resort...">
          <button class="search-btn"> search</button>
       </div>
       <a>
         <img src="../img-2/user.png" id="user-img"alt="#"/>
         <div class="login-logout-popup hide">
            <p class="account-info"> Log in as, name </p>
            <button class="btn" id="user-btn"> Log out</button>
         </div>
         </a>
       <a href="/cart"><img src="../img-1/cart.png" alt="#"/></a>
       </div>
 </div>
 <ul class="links-container">
    <li class="link-item"><a href="#" class="link">home</a></li>
    <li class="link-item"><a href="#" class="link">Hotels</a></li>
    <li class="link-item"><a href="#" class="link">Restaurants</a></li>
    <li class="link-item"><a href="#" class="link">Resorts</a></li>
    <li class="link-item"><a href="#" class="link">Lodges</a></li>
    <li class="link-item"><a href="#" class="link">Guest Houses</a></li>
    <li class="link-item"><a href="#" class="link">Casinos</a></li>
    <li class="link-item"><a href="#" class="link">Clubs</a></li>
 
 </ul>
`;
}

createNav();

// nav popup
const userImageButton = document.querySelector('#user-img');
const userPop = document.querySelector('.login-logout-popup');
const popuptext = document.querySelector('.account-info');
const actionBtn = document.querySelector('#user-btn');

userImageButton.addEventListener('click', () =>{
   userPop.classList.toggle('hide');
})

window.onload  = () => {
   // accessing user session
   let user = JSON.parse(sessionStorage.user || null);
   if(user != null){
      //means user is logged in
      popuptext.innerHTML = `log is as, ${user.name}`;
      // change the button in the html also
      actionBtn.innerHTML = 'log out';
      actionBtn.addEventListener('click', () => {
         sessionStorage.clear();       //clear the session
         location.reload               // reload the page
      })
      //
   } else {
      // user is logged out
      //creating different popup text
      popuptext.innerHTML = 'log in to place order';
      actionBtn.innerHTML = 'log in';
      actionBtn.addEventListener('click', () =>{     //adding click event to the action button
          location.href = '/logging';                //redirect user to the login page   
      })
   }
}