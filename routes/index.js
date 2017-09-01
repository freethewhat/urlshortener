var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var monk = require('monk');
var base58 = require('base-58');

const dbUrl = 'localhost:27017/urlshortener';
const db = monk(dbUrl);

db.then((err) => {
  if(err){
    console.log(err);
  }
  console.log("Connected to Database");
});

/* GET home page. */
router.get('/', function(req, res, next) {


  res.render('index', { title: 'Express' });
});

router.post("/addurl", function(req,res,next){
  res.redirect('addurl', '/');
})
module.exports = router;
