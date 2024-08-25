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
var mongoDAO = require('./Backend/mongoDAO.js');
const e = require('express');

app.listen(port, () => {
  console.log('Server running on port ${port}');
});


app.get('/', (req, res) => {
  res.render('index.ejs');
});
