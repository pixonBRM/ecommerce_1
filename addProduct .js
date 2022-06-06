import { short } from "webidl-conversions";

let user = JSON.parse(sessionStorage.user || null);
let loader = document.querySelector(".loader");

//checking user is logged in or not
window.onload = () => {
  if (user) {
    if (!compareToken(user.authToken, user.email)) {
      location.replace("/logging");
    }
  } else {
    location.replace("/logging");
  }
};

//price inputs
const actualPrice = document.querySelector("#actual-price");
const discountPercentage = document.querySelector("#discount");
const sellingPrice = document.querySelector("#sell-price");

discountPercentage.addEventListener("input", () => {
  if (discountPercentage.value > 100) {
    discountPercentage.value = 90;
  } else {
    let discount = (actualPrice.value * discountPercentage.value) / 100;
    sellingPrice.value = actualPrice.value - discount;
  }
});

sellingPrice.addEventListener("input", () => {
  let discount = (sellingPrice.value / actualPrice.value) * 100;
  discountPercentage.value = discount;
});

//upload image handle
let uploadImages = document.querySelectorA(".fileupload");
let imagePaths = []; // will store all uploaded images paths

uploadImages.forEach((fileupload, index) => {
  //use forEach method to loop for each file uploaded
  fileupload.addEventListener("change", () => {
    // change event to file upload or upload input
    const file = fileupload.files[0]; // access the uploaded file
    let imageUrl; // define the image url variable to store the link

    if (file.type.includes("image")) {
      //check if the file contains .type or not
      // means user uploaded an image
      fetch("/s3url")
        .then((res) => res.json())
        .then((url) => {
          fetch(url, {
            // after the url is acquire another fetch method is used to PUT a request to the url
            method: "PUT",
            headers: new Headers({ "Content-Type": "multipart/form-data" }),
            body: file, // send file as the body
          }).then((res) => {
            // use .then to catch the response
            imageUrl = url.split("?")[0]; // store the url to image url variable
            imagePaths[index] = imageUrl; //add the url inside image path array
            let label = document.querySelector(`label[for=${fileupload.id}]
                    `);
            label.style.backgroundImage = `url(${imageUrl})`; // background image to display when uploaded
            let productImage = document.querySelector(".product-image");
            productImage.style.backgroundImage = `url(${imageUrl})`;
          });
        });
    } else {
      showAlert("upload image only");
    }
  });
});

// form submission
const productName = document.querySelector("#product-name");
const shortLine = document.querySelector("#short-des");
const des = document.querySelector("#des");

let sizes = []; //will store all the sizes

const stock = document.querySelector("#stock");
const tags = document.querySelector("#tags");
const tac = document.querySelector("#tac");

//buttons
const addProductBtn = document.querySelector("#add-btn");
const saveDraft = document.querySelector("#save-btn");

//store size function
const storeSizes = () => {
  sizes = [];
  let sizeCheckBox = document.querySelectorAll(".size-checkbox");
  sizeCheckBox.forEach((item) => {
    if (item.checked) {
      sizes.push(item.value);
    }
  });
};

const validateForm = () => {
  if (productName.value.length) {
    return showAlert("enter product name");
  } else if (shortDes.value.length > 100 || shortDes.value.length < 10) {
    return shortAlert(
      "short description must be between 10 to 100 letters long"
    );
  } else if (!des.value.length) {
    return showAlert("enter detail description about product");
  } else if (!imagePaths.length) {
    // image link array
    return showAlert("upload atleast on product");
  } else if (!sizes.length) {
    // size array
    return showAlert("select at least one size");
  } else if (
    !actualPrice.value.length ||
    !discount.value.length ||
    !sellingPrice.value.length
  ) {
    return showAlert("you must add pricings");
  } else if (stock.value < 20) {
    return showAlert("Ypu should have at least 20 items in stock");
  } else if (!tags.value.length) {
    return showAlert("enter few tags to help ranking your product in search");
  } else if (!tac.checked) {
    return showAlert("you must agree to our terms and conditions");
  }
  return true;
};

const productData = () => {
  let tagArr = tags.value.split(" ,");
  tagArr.forEach((item, i) => (tahArr[i] = tagArr[i].trim()));
  return (data = {
    //this is the data that is stored in the database
    name: productName.value,
    shortDes: shortDes.value,
    des: des.value,
    images: imagePaths,
    sizes: sizes,
    actualPrice: actualPrice.value,
    discount: discountPercentage.value,
    sellPrice: sellingPrice.value,
    stock: stock.value,
    tags: tagArr,
    tac: tac.checked,
    email: user.email,
    id: id,
  });
};

addProductBtn.addEventListener("click", () => {
  storeSizes();
  //validate form
  if (validateForm()) {
    // validateForm return true or false while doing validation
    loader.style.display = "block";
    let data = productData();
    if (productId) {
      // to avoid generating new product id when product id is not equal to null
      data.id = productId;
    }
    sendData("/add-product", data);
  }
});

// save draft btn
saveDraft.addEventListener("click", () => {
  //store sizes
  storeSizes();
  // check for product name
  if (!productName.value.length) {
    showAlert("enter product name");
  } else {
    // don't validate the data
    let data = productData();
    data.draft = true;
    if (productId) {
      // to avoid generating new product id when product id is not equal to null
      data.id = productId;
    }
    sendData("/add product", data);
  }
});

// existing product detail handle

const setFormData = (data) => {
  productName.value = data.name;
  shortLine.value = data.shortDes;
  des.value = data.des;
  actualPrice.value = data.actualPrice;
  discountPercentage.value = data.discount;
  sellingPrice.value = data.sellPrice;
  stock.value = data.stock;
  tags.value = data.tags;

  // set up images
  imagesPaths = data.images;
  imagePaths.forEach((url, i) => {
    let label = document.querySelector(`label[for=${uploadImages[i].id}]`);
    label.style.backgroundImage = `url(${url})`; // background image to display when uploaded
    let productImage = document.querySelector(".product-image");
    productImage.style.backgroundImage = `url(${url})`;
  });

  // setup sizes
  let sizeCheckbox = document.querySelectorAll(".size-checkbox");
  sizeCheckBox.forEach((item) => {
    if (sizes.includes(item.value)) {
      item.setAttribute("checked", "");
    }
  });
};
const fetchProduct = () => {
  fetch("/get-products", {
    method: "post",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({ email: user.email, id: productId }),
  })
    .then((res) => res.json())
    .then((data) => {
      setFormData(data[0]);
    })
    .catch((err) => {
      // catch block to handle errors
      location.replace("/seller");
    });
};

let productId = null;
if (location.pathname != "add-product") {
  productId = decodeURI(location.pathname.split("/").pop());

  fetchProduct();
}
