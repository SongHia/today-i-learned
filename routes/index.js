// http://localhost:3000/api/get
// (GET route)
// http://localhost:3000/api/get/:id
// (GET route - copy and paste the id in place of :id... you can see the id in the response of http://localhost:3000/api/get)
// http://localhost:3000/api/delete/:id
// (GET route - copy and paste the id in place of :id... you can see the id in the response of http://localhost:3000/api/get)
// http://localhost:3000/api/update/:id
// (POST route - use POSTMAN)
// http://localhost:3000/api/create
// (POST route - use POSTMAN)




var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// our db model
var Record = require("../models/record.js");

/**
 * GET '/'
 * Default home route. Just relays a success message back.
 * @param  {Object} req
 * @return {Object} json
 */
router.get('/', function(req, res) {

  console.log('home page requested!');

  var jsonData = {
  	'name': 'song-the-more-you-know',
  	'api-status':'OK'
  }
  // respond with json data
  res.json(jsonData)
});

// simple route to show an HTML page for adding data
router.get('/add-til', function(req,res){

  res.render('add-til.html')

})

// simple route to show an HTML page for recorded data
router.get('/directory', function(req,res){

  res.render('directory.html')

})

// /**
//  * POST '/api/create'
//  * Receives a POST request of the new user and location, saves to db, responds back
//  * @param  {Object} req. An object containing the different attributes of the Person
//  * @return {Object} JSON
//  */
router.post('/api/create', function(req, res){

  console.log(req.body);
  
  var recordObj = {
    tilID: req.body.tilID,
    til: req.body.til,
    context: req.body.context,
    tags: req.body.tags.split(','),
    bestPartDay: req.body.bestPartDay,
    pageURL: req.body.pageURL,
    // dateAdded: { type: Date, default: Date.now}
  }

  var record = new Record(recordObj);

  record.save(function(err,data){
    if(err){
      var error = {
        status: "ERROR",
        message: err
      }
      return res.json(err)
    }

    var jsonData = {
      status: "OK",
      record: data
    }

    return res.json(jsonData);

  })

})

//get api
router.get('/api/get', function(req,res){

  Record.find(function(err,data){

      if(err){
        var error = {
          status: "ERROR",
          message: err
        }
        return res.json(err)
      }

      var jsonData = {
        status: "OK",
        record: data
      }

      return res.json(jsonData);

  })

})

router.get('/api/get/:id', function(req, res){

  var requestedId = req.param('id');

  // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model.findById
  Record.findById(requestedId, function(err,data){

    // if err or no user found, respond with error 
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that record'};
       return res.json(error);
    }

    // otherwise respond with JSON data of the animal
    var jsonData = {
      status: 'OK',
      record: data
    }

    return res.json(jsonData);
  
  })
})

module.exports = router;