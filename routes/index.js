// GET routes
// root -> home
// /home
// /admin
// /success
// /archive
// /sumary
// /api/get/:id
// /api/delete/:id
// /add-til

// POST routes
// /api/create
// /api/update/:id

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
    res.render('record.html')
});

// simple route to show an HTML page for adding data
router.get('/record', function(req, res) {
    res.render('record.html')
})

// simple route to show an HTML page for recorded data
router.get('/admin', function(req, res) {
    res.render('admin.html')
})

// simple route to show an HTML page for recorded data
router.get('/remember', function(req, res) {
    res.render('remember.html')
})

// simple route to show an HTML page for entry confirmation
router.get('/success', function(req, res) {
    res.render('success.html')
})

// simple route to show an HTML page for TBA high level data
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
    var tags = []; // blank array to hold tags, not currently used

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

    if (req.body.dateAdded) {
        dateAdded = req.body.dateAdded;
        // add to object that holds updated data
        dataToUpdate['dateAdded'] = dateAdded;
    }

    //no longer used
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
    //'format': 'Rain is wet, This morning it was gross outside, Having ice cream'

    var msgArray = incomingMsg.split(',');
    //msg Array --> [Rain is wet, This morning it was gross outside, Having ice cream]
    var til = msgArray[0];
    var context = msgArray[1];
    var bestPartDay = msgArray[2];
    // var tags = msgArray[3].split('.'); //no longer used, was for splitting tags

    //now let's save to our database
    var recordObj = {
        til: til,
        context: context,
        bestPartDay: bestPartDay
        // tags: req.body.tags.split(','),
        // tags: tags
        // pageURL: req.body.pageURL,
    }

    var record = new Record(recordObj)

    record.save(function(err, data) {
        // set up the twilio response
        var twilioResp = new twilio.TwimlResponse();
        if (err) {
            // respond to user
            twilioResp.sms('There was an error and this wasn\'t saved :( Your message: ' + incomingMsg);
            // respond to twilio
            res.set('Content-Type', 'text/xml');
            res.send(twilioResp.toString());
        } else {
            // respond to user
            // twilioResp.sms('This note was saved :) NOW it\'s time for bed :) ' + incomingMsg);
            twilioResp.sms('Thanks for the memory! NOW it\'s time to brush your teeth :)');
            // respond to twilio
            res.set('Content-Type', 'text/xml');
            res.send(twilioResp.toString());
        }
    })
})

module.exports = router;
