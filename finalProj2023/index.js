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

const { colorize } = require('./colors.js');


//database imports
var sqlDAO = require('./backEnd/sqlDAO.js');
var mongoDAO = require('./backEnd/mongoDAO.js');
const e = require('express');

app.get('/', (req, res) => {
  res.render('index.ejs');
});

