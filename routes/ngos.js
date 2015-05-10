var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST
	
router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))

//build the REST operations at the base for ngos
//this will be accessible from http://127.0.0.1:3000/ngos if the default route for / is left unchanged
router.route('/')
    //GET all ngos
    .get(function(req, res, next) {
        //retrieve all blobs from Monogo
        mongoose.model('Ngo').find({}, function (err, ngos) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/blobs folder. We are also setting "blobs" to be an accessible variable in our jade view
                    html: function(){
                        res.render('ngos/index', {
                              title: 'All NGOs',
                              "ngos" : ngos
                          });
                    },
                    //JSON response will show all blobs in JSON format
                    json: function(){
                        res.json(ngos);
                    }
                });
              }     
        });
    })
    //POST a new blob
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var name = req.body.name;
        var country = req.body.country;
        var establishedOn = req.body.establishedOn;
        var website = req.body.website;
        var workingArea = req.body.workingArea;
        //call the create function for our database
        mongoose.model('Ngo').create({
            name : name,
            country : country,
            establishedOn : establishedOn,
            website : website,
            workingArea: workingArea
        }, function (err, ngo) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //Ngo has been created
                  console.log('POST creating new ngo: ' + ngo);
                  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("ngos");
                        // And forward to success page
                        res.redirect("/ngos");
                    },
                    //JSON response will show the newly created blob
                    json: function(){
                        res.json(ngo);
                    }
                });
              }
        })
    });

router.get('/new', function(req, res) {
    res.render('ngos/new', { title: 'Add Your NGO' });
});

module.exports = router;