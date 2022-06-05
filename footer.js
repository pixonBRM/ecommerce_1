const createFooter = () => {
    let footer = document.querySelector('footer');

    footer.innerHTML = `
    <div class="footer-content">
    <img src="../img-3/images 1.jpeg" class="logo" alt=""/>
    <div class="footer-ul-container">
       <ul class="category">
         <li class="category-title"> Hotel</li>
         <li> <a href="#" class="footer-link"> Business</a></li>
         <li> <a href="#" class="footer-link"> Airport </a></li>
         <li> <a href="#" class="footer-link"> Suites </a></li>
         <li> <a href="#" class="footer-link"> Residential </a></li>
         <li> <a href="#" class="footer-link"> Residential</a></li>
         <li> <a href="#" class="footer-link"> Timeshare </a></li>
         <li> <a href="#" class="footer-link"> Casino </a></li>
         <li> <a href="#" class="footer-link"> Convention </a></li>
         <li> <a href="#" class="footer-link"> Conference</a></li>
         
       </ul>
       <ul class="category">
         <li class="category-title"> Restaurant </li>
         <li> <a href="#" class="footer-link"> Fine Dining </a></li>
         <li> <a href="#" class="footer-link"> Casual Dining</a></li>
         <li> <a href="#" class="footer-link"> Fast Casual </a></li>
         <li> <a href="#" class="footer-link"> Ghost Restaurants </a></li>
         <li> <a href="#" class="footer-link"> Family Style</a></li>
         <li> <a href="#" class="footer-link"> Fast Food </a></li>
         <li> <a href="#" class="footer-link"> Food, Cart, Stand</a></li>
         <li> <a href="#" class="footer-link"> Cafe</a></li>
         <li> <a href="#" class="footer-link"> Buffet Style</a></li>
         <li> <a href="#" class="footer-link"> Pub </a></li>
         <li> <a href="#" class="footer-link"> Cafeteria </a></li>
       </ul>
    </div>
 </div>
 <p class="footer-title">about company </p>
    <p class="info">lorem1001lorem1001lorem1001lorem1001lorem1001lorem1001lorem1001lorem1001lorem1001
    lorem1001lorem1001lorem1001lorem1001lorem1001lorem1001lorem1001lorem1001lorem1001lorem1001lorem1001
    lorem1001lorem1001lorem1001lorem1001lorem1001lorem1001lorem1001lorem1001lorem1001lorem1001lorem1001
    lorem1001lorem1001lorem1001lorem1001lorem1001lorem1001lorem1001lorem1001lorem1001lorem1001lorem1001</p>

    <p class="info"> support emails - help@hbook.com, customersupport@hbook.com</p>
    <p class="info"> telephone - 074 870 3348, 071 285 8351 </P>

    <div class="footer-social-container">
       <div class="footer-social-container">
          <a href="#" class="social-link"> terms & services </a>
          <a href="#" class="social-link"> privacy pages </a>
       </div>
       <div class="footer-social-container" >
          <a href="#" class="social-link"><i class="bx bx1-c-plus-plus">instagram </i></a>
          <a href="#" class="social-link"> facebook </a>
          <a href="#" class="social-link"> twitter </a>
       </div>
    </div>
    <p class="footer-credit">hbook, Best hotel online store </p>
    
    `;
}

createFooter();