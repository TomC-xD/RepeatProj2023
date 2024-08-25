const path = require('path');
const express = require('express');
const app = express();
const port = 4010;
let ejs = require('ejs');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

//Import body-parser middleware
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

//database imports
var sqlDAO = require('./Backend/sqlDAO.js');
const express = require('express');


//connects application to port
  app.listen(port, () => {
    console.log(`running on port ${port}`);
  });




app.get('/', (req, res) => {
  res.render('index.ejs');
});

//display all stores from sql
app.get('/stores', (req, res) => {
  sqlDAO.getStore()
    .then((data) => {
      res.render('stores', { stores: data });
    }).catch((error) => {
      
      console.log('Error in page 1:' + error);
      res.send(error);
    })
})


//when delete button is pressed delete store sql
app.post('/stores/delete/:id', (req, res) => {
  const storeId = req.params.id;
  sqlDAO.deleteStore(storeId)
    .then(() => {
      res.redirect('/stores'); 
    })
    .catch(err => {
      res.send(err);
    });
});

//display all products from sql
app.get('/products', (req, res) => {
  sqlDAO.getAllProducts()
    .then((data) => {
      res.render('products', { products: data });
    }).catch((err) => {
      console.log('Error in page 1:' + err);
      res.send(err);
    })
});

//delete product from database
app.get('/products/delete/:pid', (req, res) => {
  const productId = req.params.pid;
  sqlDAO.checkProductInStores(productId)
    .then((productStores) => { // Check if the product is being sold
      if (productStores.length > 0) {
        return res.status(400).send(`${productId} is currently being sold`);
      } else {
        return sqlDAO.deleteProduct(productId)
          .then(() => {
            //Redirects to the products page after deleting product
            res.redirect('/products');
          });
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});


