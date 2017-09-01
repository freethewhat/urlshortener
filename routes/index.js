var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var monk = require('monk');
var base58 = require('base58');

const dbUrl = 'localhost:27017/urlshortener';
const db = monk(dbUrl);

db.then(() => {
  console.log('Connected to Database');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/addurl', function(req,res,next){
  const countCollection = db.get('count');
  const urlsCollection = db.get('urls');

  let id = '';
  let encryptedId = '';

  countCollection.findOne({}).then((doc) => {
    id = doc.count + 1;
    encryptedId = base58.encode(id);

    urlsCollection.insert({'_id':id,'long_url':req.body.long_url,'date_creation':Date()});
    countCollection.update({'count':id -1},{'count': id});
  }).then(() =>{
    res.redirect('/newurl?short_url=' + encryptedId);
  });
});

router.get('/newurl', function(req, res, next) {
  res.render('newurl', {title: 'Your URL', 'short_url':req.param('short_url')});
})

module.exports = router;
