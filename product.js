const productImages = document.querySelectorAll(".product-images img");
const productImageSlide = document.querySelector(".image-slider");

let activeImageSlide = 0;                                       // default slider image

productImages.forEach((item, i) => {                             //looping through each image thumb
    item.addEventListener("click", ()  => {                      //adding click event to each image thumb
        productImages[activeImageSlide].classList.remove('active');
        item.classList.add('active');
        productImageSlide.style.backgroundImage = `url('${item.src}')`;  
        activeImageSlide = i;                                    //updating the image slider variable to track current
    })
}) 

//toggle size button//

 const sizeBtns = document.querySelectorAll('.size-radio-btn');   //setting setting size button 
 let checkedBtn = 0;                                             //current selected button

 sizeBtns.forEach((item, i ) => {                                //looping through each button
    item.addEventListener('click', () => {                       // adding click event to each button
        sizeBtns[checkedBtn].classList.remove('check');          //removing check class from size buttons
        item.classList.add('check');                             // adding the check class to the clicked button
        checkedBtn = i;                                          // updating the variable
    })
})


const setData = (data) => {
    let title = document.querySelector('title');
    title.innerHTML += data.name;

    // setup the images
    productImages.forEach((img, i) => {
        if(data.images[i]){
            img.src = data.images[i];
        }else{
            img.style.display = 'none';
        }
    })
    productImages[0].click();

    //setup size buttons
    sizeBtns.forEach(item => {
        if(!data.sizes.includes(item.innerHTML)){
            item.style.display = 'none';
        }
    })

    //setting up texts
    const name = document.querySelector('.product-brand');
    const shortDes = document.querySelector('.product-short-des');
    const des = document.querySelector('.des');

    title.innerHTML += name.innerHTML = data.name;
    shortDes.innerHTML = data.shortDes;
    des.innerHTML = data.des;

    //pricings
    const sellPrice = document.querySelector('.product-price');
    const actualPrice = document.querySelector('.product-actual-price');
    const discount = document.querySelector('.product-discount');

    sellPrice.innerHTML = `$${data.sellPrice}`;
    actualPrice.innerHTML = `$${data.actualPrice}`;
    discount.innerHTML = `( ${data.discount} % off)`;
}

//fetch data 
const fetchProductData = () => {
    fetch('/get-products', {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({id: productId})
    })
    .then(res => res.json())
    .then(data => {
        setData(data);
        getProducts(data.tags[1]).then(data => createProductSlider(data, '.container-for-card-slider', 'similar products'))
    })
    .catch(err => {
        location.replace('/404');
    })
}
let productId = null;
if(location.pathname != '/products'){
    productId = decodeURI(location.pathname.split('/').pop());
    fetchProductData();
}