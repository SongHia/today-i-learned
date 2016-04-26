//Giphy Endpoints
var api = "https://api.giphy.com";
var randomGif = "/v1/gifs/random?";
var trendingGif = "/v1/gifs/trending?";
var searchGif = "/v1/gifs/search?";
var query = "&q=";
var apiKey = "&api_key=dc6zaTOxFJmzC";

//global variables
var record;
var tagArray; //for tag based gif search
var tilText; //for keyword extratcted gif search
var resultsArray = [];
var searchTerm;


//init function
function init() {
    renderDisplay();
}

function renderDisplay() {
    jQuery('#record-display').empty();
    jQuery.ajax({
        url: '/api/get',
        dataType: 'json',
        success: function(response) {
            record = response.record;
            var i = record[Math.floor(Math.random() * record.length)]; //random entry
            var date = new Date(i.dateAdded); //turns the random entry's data into data object
            if (i.name !== "" && i.name !== "undefined") { //checks for name and displays if available
                var htmlToAdd = '<div class="col-md-12">' +
                    '<h3><span class ="displayDate">' + date.toDateString() + '</span></h3>' + //convert date object to date
                    '<h3><span class="displayTil">' + i.til + '</span></h3>' +
                    '<h6>Context: <span class="displayContext">' + i.context + '</span></h6>' +
                    '<h6>The Best Parts: <span class="displayBestPartDay">' + i.bestPartDay + '</span></h6>' +
                    '<h6>Tags: <span class="tags">' + i.tags + '</span></h6>' +
                    '<h6>Name: <span class="name">' + i.name + '</span></h6>' +
                    '<h6 class="hide">ID: <span class="displayId">' + i._id + '</span></h6>' +
                    // '<input type="button" class="refresh-button" value="GIF ME MORE" onClick="window.location.reload()">' +
                    '<input type="button" class="refresh-button" value="GIF ME MORE" onClick="newEntry()">' +
                    '</div>';
            } else {
                var htmlToAdd = '<div class="col-md-12">' +
                    '<h2><span class ="displayDate">' + date.toDateString() + '</span></h2>' +
                    '<h2><span class="displayTil">' + i.til + '</span></h2>' +
                    '<h4>Context: <span class="displayContext">' + i.context + '</span></h4>' +
                    '<h4>The Best Parts: <span class="displayBestPartDay">' + i.bestPartDay + '</span></h4>' +
                    '<h4>Tags: <span class="tags">' + i.tags + '</span></h4>' +
                    // '<h4>Name: <span class="name">' + i.name + '</span></h4>' +
                    '<h4 class="hide">ID: <span class="displayId">' + i._id + '</span></h4>' +
                    // '<input type="button" class="refresh-button" value="GIF ME MORE" onClick="window.location.reload()">' +
                    '<input type="button" class="refresh-button" value="GIF ME MORE" onClick="newEntry()">' +
                    '</div>';
            }
            jQuery("#record-display").append(htmlToAdd); //adds the entry to the page
            tagArray = i.tags; //creates an array of all tags in entry for giphy search

            //for keyword analysis + giphy search (in progress)
            tilText = i.til + " " + i.context + " " + i.bestPartDay + " " + i.tags;
            findTag(); //find based on tag
        }
    })
}

//displays new entry via swiping left or right
function newEntry() {
    jQuery('#record-display').empty();
    var i = record[Math.floor(Math.random() * record.length)]; //random entry
    var date = new Date(i.dateAdded); //turns the random entry's data into data object
    if (i.name !== "" && i.name !== "undefined") { //checks for name and displays if available
        var htmlToAdd = '<div class="col-md-12">' +
            '<h2><span class ="displayDate">' + date.toDateString() + '</span></h2>' + //convert date object to date
            '<h2><span class="displayTil">' + i.til + '</span></h2>' +
            '<h4>Context: <span class="displayContext">' + i.context + '</span></h4>' +
            '<h4>The Best Parts: <span class="displayBestPartDay">' + i.bestPartDay + '</span></h4>' +
            '<h4>Tags: <span class="tags">' + i.tags + '</span></h4>' +
            '<h4>Name: <span class="name">' + i.name + '</span></h4>' +
            '<h4 class="hide">ID: <span class="displayId">' + i._id + '</span></h4>' +
            // '<input type="button" class="refresh-button" value="GIF ME MORE" onClick="window.location.reload()">' +
            '<input type="button" class="refresh-button" value="GIF ME MORE" onClick="newEntry()">' +
            '</div>';
    } else {
        var htmlToAdd = '<div class="col-md-12">' +
            '<h2><span class ="displayDate">' + date.toDateString() + '</span></h2>' +
            '<h2><span class="displayTil">' + i.til + '</span></h2>' +
            '<h4>Context: <span class="displayContext">' + i.context + '</span></h4>' +
            '<h4>The Best Parts: <span class="displayBestPartDay">' + i.bestPartDay + '</span></h4>' +
            '<h4>Tags: <span class="tags">' + i.tags + '</span></h4>' +
            // '<h4>Name: <span class="name">' + i.name + '</span></h4>' +
            '<h4 class="hide">ID: <span class="displayId">' + i._id + '</span></h4>' +
            // '<input type="button" class="refresh-button" value="GIF ME MORE" onClick="window.location.reload()">' +
            '<input type="button" class="refresh-button" value="GIF ME MORE" onClick="newEntry()">' +
            '</div>';
    }
    jQuery("#record-display").append(htmlToAdd); //adds the entry to the page
    tagArray = i.tags; //creates an array of all tags in entry for giphy search

    //for keyword analysis + giphy search (in progress)
    tilText = i.til + " " + i.context + " " + i.bestPartDay + " " + i.tags;
    // console.log("tilText: " + tilText);
    findTag(); //find based on tag
}

function findTag() {
    var j = tagArray[Math.floor(Math.random() * tagArray.length)];
    if (j !== "") {
        searchTerm = j;
        console.log("search term from tag: " + searchTerm);
        searchGiphy(searchTerm);
    } 
    //if no tags found extract keyword from Alchemy API
    else {
        findKeyword();
        // searchTerm = "time"; //default
    }
}

function findKeyword() {
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
            resultsArray.push(results.text);
        })
        console.log("resultsArray :" + resultsArray);
        var j = resultsArray[Math.floor(Math.random() * resultsArray.length)];
        searchTerm = j;
        console.log("search term from Alchemy keyword: " + j)
        searchGiphy(searchTerm);
    });
}

function searchGiphy(searchTerm) {
    jQuery.ajax({
        // url : api + trendingGif + apiKey, //trending gif old
        url: api + searchGif + query + searchTerm + apiKey,
        dataType: 'json',
        success: function(response) {

            var data = response.data; //stores the data object
            var i = data[Math.floor(Math.random() * data.length)]; //randomly picks data object from current trending gifs
            // console.log(i.images.original.url); //checks the url property
            $('body').css('background-image', 'url(' + i.images.original.url + ')'); //writes the url to css as bg image
            // $('randbg').css('background', 'url(' + i.images.original.url + ')' + 'no-repeat center center fixed'); //writes the url to css as bg image
            // console.log("final searchTerm: " + searchTerm);
            // console.log("giphy url: " + i.url);
            // console.log("giphy image url: " + i.images.original.url);

        //displays search term
        // jQuery('#searchterm-display').empty();
        // var htmlToAdd = '<div class="col-md-12">' +
        //  '<h4>This gif found with: ' + searchTerm + '</h4>' +
        // '</div>';
        // jQuery("#searchterm-display").append(htmlToAdd); //adds the entry to the page
        }
    })
}

// //NEW
// $("#record-display").swipe({
//     //Generic swipe handler for all directions
//     swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
//         console.log("swip recognition");
//         //Generate random number
//         // var randNum = Math.floor(Math.random() * tabletop.data().length);

//         if (direction == "right") {
//             swiperightAdvice();

//         }
//         if (direction == "left") {
//             swipeleftAdvice();
//         }
//     },
// });

// function swiperightAdvice() {
//     // console.log(randNum);
//     $("#record-display").removeClass().addClass('animated slideOutRight').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
//         $(this).removeClass();
//         // $(this).html(tabletop.data()[randNum].Advice).addClass('animated slideInLeft')

//         $(this).html.addClass('animated slideInLeft')
//     });
//     console.log("swiped right");
//     // renderDisplay();
//     newEntry();
// };

// function swipeleftAdvice() {
//     // console.log(randNum);
//     $("#record-display").removeClass().addClass('animated slideOutLeft').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
//         $(this).removeClass();
//         // $(this).html(htmlToAdd).addClass('animated slideInRight')
//         $(this).addClass('animated slideInRight')
//     });
//     console.log("swiped left");
//     // renderDisplay();
//     newEntry();
// };

window.addEventListener('load', init())
