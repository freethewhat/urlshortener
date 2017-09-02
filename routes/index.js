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
  const countCollection = db.get('count');
  const urlsCollection = db.get('urls');

  let id = '';
  let encryptedId = '';
  let hostname = "https://thawing-bastion-70505.herokuapp.com/"

  countCollection.findOne({}).then((doc) => {
    id = doc.count + 1;
    encryptedId = base58.encode(id);

    urlsCollection.insert({'_id':id,'long_url':req.body.long_url,'date_creation':Date()});
    countCollection.update({'count':id -1},{'count': id});
  }).then(() =>{
    res.redirect('/newurl?short_url=' + hostname + encryptedId);
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
