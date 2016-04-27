// GET routes
// http://localhost:3000/api/get
// http://localhost:3000/api/get/:id
// http://localhost:3000/api/delete/:id
// http://localhost:3000/add-til
// http://localhost:3000/directory
// POST routes
// http://localhost:3000/api/create
// http://localhost:3000/api/update/:id

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Record = require("../models/record.js"); // our db model
var twilio = require('twilio');

/**
 * GET '/'
 * Default home route. Just relays a success message back.
 * @param  {Object} req
 * @return {Object} json
 */
router.get('/', function(req, res) {

    console.log('home page requested!');

    // var jsonData = {
    //  'name': 'today-i-learned',
    //  'api-status':'OK',
    //   'instructions': 'text 917-746-4128 with your lesson of the day',
    //   'format': 'Rain is wet, This morning it was gross outside, Having ice cream, tag1. tag2. tag3'
    // }
    // // respond with json data
    // res.json(jsonData)

    res.render('home.html')

});

// simple route to show an HTML page for adding data
router.get('/home', function(req, res) {

    res.render('home.html')

})

// simple route to show an HTML page for recorded data
router.get('/admin', function(req, res) {

    res.render('admin.html')

})

// simple route to show an HTML page for recorded data
router.get('/archive', function(req, res) {

    res.render('archive.html')

})

// simple route to show an HTML page for success
router.get('/success', function(req, res) {

    res.render('success.html')

})

// simple route to show an HTML page for success
router.get('/summary', function(req, res) {

    res.render('summary.html')

})

// /**
//  * POST '/api/create'
//  * Receives a POST request of the new user and location, saves to db, responds back
//  * @param  {Object} req. An object containing the different attributes of the Person
//  * @return {Object} JSON
//  */
router.post('/api/create', function(req, res) {

    console.log(req.body);

    var recordObj = {
        til: req.body.til,
        context: req.body.context,
        bestPartDay: req.body.bestPartDay,
        // name: req.body.name,
        // tags: req.body.tags.split(',')
        // pageURL: req.body.pageURL,

    }

    var record = new Record(recordObj);

    record.save(function(err, data) {
        if (err) {
            var error = {
                status: "ERROR",
                message: err
            }
            return res.json(err)

        }

        // var jsonData = {
        //   status: "OK",
        //   record: data
        // }

        // return res.json(jsonData);

        return res.redirect('/success');
    })
})

//get api
router.get('/api/get', function(req, res) {

    Record.find(function(err, data) {

        if (err) {
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
router.get('/api/get/:id', function(req, res) {

    var requestedId = req.param('id');

    // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model.findById
    Record.findById(requestedId, function(err, data) {

        // if err or no user found, respond with error 
        if (err || data == null) {
            var error = {
                status: 'ERROR',
                message: 'Could not find that record'
            };
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


router.get('/api/delete/:id', function(req, res) {

    var requestedId = req.param('id');

    // Mongoose method to remove, http://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
    Record.findByIdAndRemove(requestedId, function(err, data) {
        if (err || data == null) {
            var error = {
                status: 'ERROR',
                message: 'Could not find that record to delete'
            };
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

router.post('/api/update/:id', function(req, res) {

    var requestedId = req.param('id');

    var dataToUpdate = {}; // a blank object of data to update

    // pull out the information from the req.body and add it to the object to update
    var til, context, bestPartDay, name, dateAdded;
    var tags = []; // blank array to hold tags


    // we only want to update any field if it actually is contained within the req.body
    // otherwise, leave it alone.
    if (req.body.til) {
        til = req.body.til;
        // add to object that holds updated data
        dataToUpdate['til'] = til;
    }
    if (req.body.context) {
        context = req.body.context;
        // add to object that holds updated data
        dataToUpdate['context'] = context;
    }
    if (req.body.bestPartDay) {
        bestPartDay = req.body.bestPartDay;
        // add to object that holds updated data
        dataToUpdate['bestPartDay'] = bestPartDay;
    }

    if (req.body.tags) {
        tags = req.body.tags.split(","); // split string into array
        // add to object that holds updated data
        dataToUpdate['tags'] = tags;
    }
    if (req.body.name) {
        name = req.body.name;
        // add to object that holds updated data
        dataToUpdate['name'] = name;
    }


    //NEW
    if (req.body.dateAdded) {
        dateAdded = req.body.dateAdded;
        // add to object that holds updated data
        dataToUpdate['dateAdded'] = dateAdded;
    }

    // if(req.body.pageURL) {
    //   pageURL = req.body.pageURL;
    //   // add to object that holds updated data
    //   dataToUpdate['pageURL'] = pageURL;
    // }    

    console.log('the data to update is ' + JSON.stringify(dataToUpdate));

    // now, update that record
    // mongoose method findByIdAndUpdate, see http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate  
    Record.findByIdAndUpdate(requestedId, dataToUpdate, function(err, data) {
        // if err saving, respond back with error
        if (err) {
            var error = {
                status: 'ERROR',
                message: 'Error updating record'
            };
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

// this route gets called whenever Twilio receives a message
router.post('/twilio-callback', function(req, res) {

    // there's lots contained in the body
    console.log(req.body);
    // the actual message is contained in req.body.Body
    var incomingMsg = req.body.Body;

    //incoming messages look like:
    //'format': 'Rain is wet, This morning it was gross outside, Having ice cream, tag1. tag2. tag3'


    var msgArray = incomingMsg.split(',');
    //msg Array --> [Rain is wet, This morning it was gross outside, Having ice cream, tag1.tag2.tag3]
    var til = msgArray[0];
    var context = msgArray[1];
    var bestPartDay = msgArray[2];
    // var tags = msgArray[3].split('.');


    //now let's save to our database
    var recordObj = {
        til: til,
        context: context,
        // tags: req.body.tags.split(','),
        bestPartDay: bestPartDay,
        // tags: tags
            // pageURL: req.body.pageURL,
    }

    var record = new Record(recordObj)

    record.save(function(err, data) {
        // set up the twilio response
        var twilioResp = new twilio.TwimlResponse();
        if (err) {
            // respond to user
            twilioResp.sms('Oops! We couldn\'t save your lesson! --> ' + incomingMsg);
            // respond to twilio
            res.set('Content-Type', 'text/xml');
            res.send(twilioResp.toString());
        } else {
            // respond to user
            twilioResp.sms('Successfully saved your lesson! --> ' + incomingMsg);
            // respond to twilio
            res.set('Content-Type', 'text/xml');
            res.send(twilioResp.toString());
        }
    })


})

module.exports = router;
