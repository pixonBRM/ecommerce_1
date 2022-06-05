//import packages

                                                    // here we declare the main requirements of the page
const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const path = require('path');

//firebase admin setup
const serviceAccount = require('./ecommerce_link.json');   //this is how we setup firebase at the back end

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();                               // cause nodemon crash

//aws config
const aws = require('aws-sdk');
const dotenv = require ('dotenv');

dotenv.config();  // to enable it

// aws parameters
const region = "ap-south-1";
const bucketName = "ecommerce webApp";
const accessKeyId = "process.env.AWS_ACCESS_KEY";
const secretAccessKey = "process.env.AWS_SECRET_KEY";

aws.config.update ({
    region, 
    accessKeyId, 
    secretAccessKey
})

// init s3
const s3 = new aws.S3();

// generate image upload links     will be able to upload images from the front-end
async function generationUrl(){
    let date = new Date();
    let id = parseInt(Math.random() * 10000000000);                         // random id is generated

    const imageName = `${id}${date.getTime()}.jpg`;                         //concatenate the id to form image imageName
    const params = ({
        Bucket: bucketName,
        Key: imageName,
        expires: 300,                                   // 300 ms expiration
        contentType: 'image/jpeg'
    })

    const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
    return uploadUrl;   //return the generated
} 
//declare static path
let staticPath = path.join(__dirname);              //here we provide the static path(directory) for the site 

//initializing express.js
const app = express();

//middlewares
app.use(express.static(staticPath));                //here we show that the middlewares(links) will use express js
app.use(express.json ());                                                    // to enable form data sharing add express.json
//routes
//home route

app.get("/", (req, res)  => {
    res.sendFile(path.join(staticPath, "index.html"));  //here we get the index page for the user to view
})

//signup route
app.get('/signup', (req, res) => {
    res.sendFile(path.join(staticPath, 'signup.html'));  //here we get the signup page page before redirecting the user to it
})

app.post('/signup', (req, res) => {
    let {name, email, password, number, tac, notification } = req.body;         //to request or access the variable data   //console.log(req.body); to enable data sharing
    
//form validation (to validate the data at the back end)
    if (name.length < 5){
        return res.json({'alert': 'name must be 5 letters long'});
    } else if(!email.length){                   
        return res.json({'alert': 'enter your email'});                                       
    } else if(password.length < 8){
        return res.json({'alert': 'password should be 8 letters long'});
    } else if(!number.length){
        return res.json({'alert': 'enter your phone number'}); 
    } else if(!Number(number) || number.length < 10 ){        
        return res.json({'alert': 'invalid number, please enter the valid one'});          
    } else if(!tac){
        return res.json({'alert': 'you must agree to our terms and conditions'});          
    }  

    // store user in db
    db.collection('users').doc(email).get()             
    .then(user => {                                //checks if the user exists in the db and gives an alert
        if(user.exists){
            return res.json({'alert': 'email already exists'});
        } else {
            //encrypt the password before storing
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, ( err, hash) => {
                    req.body.password = hash;
                    db.collection('users').doc(email).set(req.body)
                    .then(data => {
                        res.json ({
                            name: req.body.name,
                            email: req.body.email,
                            seller: req.body.seller
                        })
                    })
                })
            })
        }
    })
})

// login route
app.get('/logging', (req,res) =>{
    res.sendFile(path.join(staticPath, "logging.html"));
})

app.post('/logging', (req,res) => {
    let { email, password} = req.body;

    if (!email.length || !password.length){
        return res.json({'alert': 'fill all the inputs'})
    }
    // check if the user exists i the database or not
    db.collection('users').doc(email).get()
    .then(user =>{
        if(!user.exists){                               //if the email does not exists
            return res.json({'alert': 'log in email does not exists'})
        } else {                                       // if the user exist use bcrypt to compare the password
            bcrypt.compare(password, user.data().password, (err, result) => {

                 //if the result is true, send the data to the frontend
                if(result){  
                    let data = user.data();
                    return res.json({
                        name: data.name,
                        email: data.email,
                        seller: data.seller,
                    })
                } else {  // if the result is not true show an alert
                    return res.json({'alert': 'password is incorrect'});
                }
            })
        }
    })
})

// seller route
app.get('/seller', (req, res) => {
    res.sendFile(path.join(staticPath, "seller.html"));
})

app.post('/seller', (req,res) => {
    let {name, about, address, number, tac, legit, email } = req.body;  // add all the variables
    if (!name.length || !address.length || !about.length || number.length < 10 ||
        !Number(number)){  // backend validation
            return res.json({'alert': 'some information(s) is/are invalid'});
        } else if(!tac || !legit){
            return res.json({'alert':'you must agree to terms and conditions'})
        }else {
            //update user seller status here
            db.collection('sellers').doc(email).set(req.body)  // make user doc inside the seller collection
            //update user seller to true
            .then(data => {
                db.collection('users').doc(email).update({
                    seller:true
                }) // in response send true
                .then(data => {
                    res.json(true);
                })
            })
        }
})

//add product route 
app.get('/addProduct', (req,res) => {
    res.sendFile(path.join(staticPath, 'addProduct.html'));
})
app.get('/addProduct/:id', (req,res) => {    // id for dynamic place holder
    res.sendFile(path.join(staticPath, 'addProduct.html'));
})

// get the upload link
app.get('/s3url', (req,res) => {
    //url generate function and use the block to th send the response
    generateUrl().then(url => res.json(url));
})

//add product
app.post('/add-product', (req, res) => {
    let {name, shortDes, des, images, sizes, actualPrice, discount, sellPrice, 
    stock, tags, tac, email, draft, id } = req.body;

    // validation
   if(!draft){
    if(!name.value.length){
        return res.json ({'alert':'enter product name'});
    } else if(shortDes.length > 100 || shortDes.value.length < 10 ){
        return res.json ({'alert':'short description must be between 10 to 100 letters long'});
    } else if( !des.length ){
        return res.json ({'alert':'enter detail description about product'});
    }else if(!images.length){// image link array
        return res.json ({'alert':'upload atleast on product'});
    }else if(!sizes.length){// size array
        return res.json ({'alert':'select at least one size'});
    }else if(!actualPrice.length || !discount.value.length || !sellPrice.value.length){
        return res.json ({'alert':'you must add pricings'});
    }else if(stock < 20){
        return res.json ({'alert':'Ypu should have at least 20 items in stock'});
    }else if(!tags.length){
        return res.json ({'alert':'enter few tags to help ranking your product in search'});
    }else if(!tac){
        return res.json ({'alert':'you must agree to our terms and conditions'});
    }

   }
    // add product 
    let docName = id == undefined ? `$name.toLowercase()}-${Math.floor(Math.random() * 5000)}` :id;
    db.collection('products').doc(docName).set(req.body)
    .then(data => {
        res.json({'product': name});
    })
    .catch(err => {
        return res.json ({'alert': 'some error occurred. Try again'});
    })
})

//get products
app.post('/get-products', (req, res) => {
    let { email, id, tag } = req.body;
    

    if(id){
       docRef = db.collection('products').doc(id)
    } else if(tag){
       docRef = db.collection('products').where('tags', 'array-contains', tag)
    } else {
        docRef = db.collection('products').where('email', '==', email)
    }

    docRef.get()
    .then(products => {
        if (products.empty) {
            return res.json('no products');
        }
        let productArr = [];
        if(id){
            return res.json(products.data());
        }
       else {
        products.forEach(item => {
            let data = item.data();
            data.id = item.id;
            productArr.push(data);
        })
        res.json(productArr);
       }
    })
})

app.post('/delete-product', (req,res) => {
    let {id} = re.body;

    db.collection('products').doc(id).delete()
    .then(data => {
        res.json('success');
    }).catch(err => {
        res.json('err');
    })
})

//product page
app.get('/products/:id', (req, res) => {
    res.sendFile(path.join(staticPath, "product.html"));
})

//404 route
app.get('/404', (req, res) => {
    res.sendFile(path.join(staticPath,'404.html'));  //here we get the 404 page before redirecting the user to it
})
app.use((req, res) => {
    res.redirect('/404');                             //here we redirect the user to 404 page after getting it
})

app.listen(3000, () => {
    console.log('listening on port 3000.......');     //here we provide port for the script server to use
})