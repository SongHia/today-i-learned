
// GET routes
// http://localhost:3000/api/get
// http://localhost:3000/api/get/:id
// http://localhost:3000/api/delete/:id
// http://localhost:3000/add-til
// http://localhost:3000/directory

// (POST routes - use POSTMAN)
// http://localhost:3000/api/create
// http://localhost:3000/api/update/:id

//https://github.com/sslover/designing-for-data-personalization/blob/master/week8/mongoose-cheatsheet.md




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
    // tilID: req.body.tilID,
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

//get id
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

/**
 * GET '/api/delete/:id'
 * Receives a GET request specifying the animal to delete
 * @param  {String} req.param('id'). The animalId
 * @return {Object} JSON
 */


router.get('/api/delete/:id', function(req, res){

  var requestedId = req.param('id');

  // Mongoose method to remove, http://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
  Record.findByIdAndRemove(requestedId,function(err, data){
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that record to delete'};
      return res.json(error);
    }

    // otherwise, respond back with success
    var jsonData = {
      status: 'OK',
      message: 'Successfully deleted id ' + requestedId
    }

    res.json(jsonData);

  })

})


// /**
//  * POST '/api/update/:id'
//  * Receives a POST request with data of the animal to update, updates db, responds back
//  * @param  {String} req.param('id'). The animalId to update
//  * @param  {Object} req. An object containing the different attributes of the Animal
//  * @return {Object} JSON
//  */

router.post('/api/update/:id', function(req, res){

   var requestedId = req.param('id');

   var dataToUpdate = {}; // a blank object of data to update

    // pull out the information from the req.body and add it to the object to update
    var til, context, tags, bestPartDay, pageURL; 

    // we only want to update any field if it actually is contained within the req.body
    // otherwise, leave it alone.
    if(req.body.til) {
      til = req.body.til;
      // add to object that holds updated data
      dataToUpdate['til'] = til;
    }
    if(req.body.context) {
      context = req.body.age;
      // add to object that holds updated data
      dataToUpdate['context'] = context;
    }
    var tags = []; // blank array to hold tags
    if(req.body.tags){
      tags = req.body.tags.split(","); // split string into array
      // add to object that holds updated data
      dataToUpdate['tags'] = tags;
    }
    if(req.body.bestPartDay) {
    bestPartDay = req.body.bestPartDay;
    // add to object that holds updated data
    dataToUpdate['bestPartDay'] = bestPartDay;
    }
    if(req.body.pageURL) {
      pageURL = req.body.pageURL;
      // add to object that holds updated data
      dataToUpdate['pageURL'] = pageURL;
    }    

    console.log('the data to update is ' + JSON.stringify(dataToUpdate));

    // now, update that animal
    // mongoose method findByIdAndUpdate, see http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate  
    Record.findByIdAndUpdate(requestedId, dataToUpdate, function(err,data){
      // if err saving, respond back with error
      if (err){
        var error = {status:'ERROR', message: 'Error updating record'};
        return res.json(error);
      }

      console.log('Updated the record!');
      console.log(data);

      // now return the json data of the new person
      var jsonData = {
        status: 'OK',
        record: data
      }

      return res.json(jsonData);

    })

})

module.exports = router;