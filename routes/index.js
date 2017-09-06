var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var monk = require('monk');
var base58 = require('base58');

const db = monk(process.env.URLSHORTENER);

db.then(() => {
  //console.log('Connected to Database');
});

router.post('/addurl', function(req,res,next){
  // connects to database collections
  const countCollection = db.get('count');
  const urlsCollection = db.get('urls');

  // initial setup variables for ID selection and encoding
  let id = '';
  let encryptedId = '';

  // hostname used in the url parameter in redirect
  // seems like there may be better way to do this
  let hostname = "https://thawing-bastion-70505.herokuapp.com/"

  // looks the current count in count collection
  // need to determine a way to see if the URL is already in the database
  urlsCollection.findOne({"long_url":req.body.long_url}).then((doc) => {
    if(doc === null) {
      countCollection.findOne({}).then((doc) => {
        id = doc.count + 1;
        encryptedId = base58.encode(id);

        //add the new url to the URL collection and add the new count into count collection
        urlsCollection.insert({'_id':id,'long_url':req.body.long_url,'date_creation':Date()});
        countCollection.update({'count':id -1},{'count': id});
      }).then(() =>{
        //once complete redirect to the
        res.redirect('/newurl?short_url=' + hostname + encryptedId);
      });
    } else {
      console.log("already in DB: " + doc._id);
      encryptedId = base58.encode(doc._id);

      res.redirect('/newurl?short_url=' + hostname + encryptedId);
    }
  });
});

router.get('/admin', function(req, res) {
  const urlsCollection = db.get('urls');

  urlsCollection.find({},{}).then((docs) => {
    res.render('admin', {title: "Admin Page", websites: docs});
  });
});

router.get('/newurl', function(req, res, next) {
  res.render('newurl', {title: 'Your URL', 'short_url':req.param('short_url')});
});

router.get('/:encoded_id', function(req, res, next) {
  urlsCollection = db.get('urls');
  var decoded_id = base58.decode(req.param('encoded_id'));

  urlsCollection.findOne({"_id":decoded_id}).then((doc) => {
    if(doc){
      res.redirect(doc.long_url);
    } else {
      res.redirect('/');
    }
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
