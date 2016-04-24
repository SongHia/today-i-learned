//Giphy Endpoints
var api = "https://api.giphy.com";
var randomGif = "/v1/gifs/random?";
var trendingGif = "/v1/gifs/trending?";
var apiKey = "&api_key=dc6zaTOxFJmzC";

var tilText = []; //for keyword extratcted gif search
var keywordsArray = [];

function init() {
    renderAll();
    renderGiphy();

}

// get Record JSON from /api/get
function renderAll() {
    // first, make sure the #record-holder is empty
    jQuery('#all-records').empty();

    jQuery.ajax({
        url: '/api/get',
        dataType: 'json',
        success: function(response) {
            var record = response.record;
            for (var i = 0; i < record.length; i++) {
                var date = new Date(record[i].dateAdded); // turn string into a date object
                var htmlToAdd = '<div class="col-md-12 archive-display">' +
                    '<h1><span class ="dateConverted">' + date.toDateString() + '</span></h1>' + //translated date
                    // '<h1><span class ="dateAdded">' + record[i].dateAdded + '</span></h1>' + //orginal date record
                    '<h1>Today I learned: <span class="til">' + record[i].til + '</span></h1>' +
                    '<ul>' +
                    '<li>Context: <span class="context">' + record[i].context + '</span></li>' +
                    '<li>Best Parts Of The Day: <span class="bestPartDay">' + record[i].bestPartDay + '</span></li>' +
                    '<li>Tags: <span class="tags">' + record[i].tags + '</span></li>' +
                    '<li>Name: <span class="name">' + record[i].name + '</span></li>' +
                    '<li class="hide">ID: <span class="id">' + record[i]._id + '</span></li>' +
                    '</ul>' +
                    // '<button type="button" class="edit-button" id="' + record[i]._id + '" onclick="deleteRecord(event)">Delete Record</button>' +
                    // '<button type="button" class="edit-button" data-toggle="modal" data-target="#editModal"">Edit Record</button>' +
                    '</div>';
                jQuery("#all-records").append(htmlToAdd);
                //for keyword analysis + giphy search (in progress)
                tilText.push(record[i].til);
                // console.log("all tilText: " + tilText);
                // findKeyword(tilText);
            }
            convert(tilText);
        }
    })
}

// new GET GIPHY JSON FROM API
function renderGiphy() {
    jQuery.ajax({
        url: api + trendingGif + apiKey, //trending gif
        dataType: 'json',
        success: function(response) {
            var data = response.data; //stores the data object
            var i = data[Math.floor(Math.random() * data.length)]; //randomly picks data object from current trending gifs
            $('body').css('background-image', 'url(' + i.images.original.url + ')'); //writes the url to css as bg image
        }
    })

}

function convert(tilText) {
    console.log("length " + tilText.length);
    tilText.toString();
    console.log(tilText);
    findKeyword(tilText);
}

function findKeyword(tilText) {
    params = {
            // text: encodeURI(tilText),
            text: tilText,
            apikey: '919a594d65f26f48b528c3e9c49a43c84474d294',
            outputMode: 'json'
        }
        //API ENDPOINT http://api.jquery.com/jquery.getjson/
        //SAMPLE APPROACH - gets JSON of data from Alchemy API
        //http://webtutsdepot.com/2009/11/28/how-to-read-json-with-javascript/
        //Text document content (must be uri-argument encoded)

    url = 'https://access.alchemyapi.com/calls/text/TextGetRankedKeywords';
    // url = 'http://access.alchemyapi.com/calls/text/TextGetRankedConcepts';

    $.getJSON(url, params, function(data) {
        $.each(data.keywords, function(i, results) {
            keywordsArray.push(results.text);
        })
        console.log("keywordsArray :" + keywordsArray);
        var j = keywordsArray[Math.floor(Math.random() * keywordsArray.length)];
        console.log("Alchemy keywords: " + j)
        // searchGiphy(searchTerm);
    });
}
window.addEventListener('load', init())
