//Giphy Endpoints
var api = "https://api.giphy.com";
var randomGif = "/v1/gifs/random?";
var trendingGif = "/v1/gifs/trending?";
var searchGif = "/v1/gifs/search?";
var query = "&q=";
var apiKey = "&api_key=dc6zaTOxFJmzC";

var tagArray;
var searchTerm;
var tilText;

var keywordsArray = [];

function init() {
    renderDisplay();
}

// get Record JSON from /api/get 
function renderDisplay() {
    // first, make sure the #record-holder is empty
    jQuery('#record-display').empty();

    jQuery.ajax({
        url: '/api/get',
        dataType: 'json',
        success: function(response) {
            // console.log(response);

            var record = response.record;
            // console.log(record);

            var i = record[Math.floor(Math.random() * record.length)];
            // console.log(i.til);

            // for(var i=0;i<record.length;i++){
            var date = new Date(i.dateAdded); //    turn string into a date object

            //checks for name and displays if available
            if (i.name != "") {
                var htmlToAdd = '<div class="col-md-12">' +
                    '<h2><span class ="displayDate">' + date.toDateString() + '</span></h2>' + //convert date object to date
                    '<h2><span class="displayTil">' + i.til + '</span></h2>' +
                    '<h4>Context: <span class="displayContext">' + i.context + '</span></h4>' +
                    '<h4>The Best Parts: <span class="displayBestPartDay">' + i.bestPartDay + '</span></h4>' +
                    '<h4>Tags: <span class="tags">' + i.tags + '</span></h4>' +
                    // '<h4>Name: <span class="name">' + i.name + '</span></h4>' +
                    '<h4 class="hide">ID: <span class="displayId">' + i._id + '</span></h4>' +
                    '<input type="button" class="refresh-button" value="GIF ME MORE" onClick="window.location.reload()">' +
                    '</div>';
            } else {
                var htmlToAdd = '<div class="col-md-12">' +
                    '<h2><span class ="displayDate">' + date.toDateString() + '</span></h2>' + //convert date object to date
                    '<h2><span class="displayTil">' + i.til + '</span></h2>' +
                    '<h4>Context: <span class="displayContext">' + i.context + '</span></h4>' +
                    '<h4>The Best Parts: <span class="displayBestPartDay">' + i.bestPartDay + '</span></h4>' +
                    '<h4>Tags: <span class="tags">' + i.tags + '</span></h4>' +
                    '<h4 class="hide">ID: <span class="displayId">' + i._id + '</span></h4>' +
                    '<input type="button" class="refresh-button" value="GIF ME MORE" onClick="window.location.reload()">' +
                    '</div>';
            }
            jQuery("#record-display").append(htmlToAdd);

            tagArray = i.tags; //used for giphy search by tags

            //for keyword analysis + giphy search (in progress)
            tilText = i.til + " " + i.context + " " + i.bestPartDay + " " + i.tags;
            findTag();
            // findKeyword();
        }
    })
}


function findTag() {

    var j = tagArray[Math.floor(Math.random() * tagArray.length)];
    if (j != "") {
        searchTerm = j;
    } else {
        findKeyword();
        // searchTerm = "time"; //default
    }
    console.log("search term from tag: " + searchTerm);
    searchGiphy();
}

//needs work
function findKeyword() {
    // tilText = "DEADLINES ARE YOUR FRIEND. PUBLIC DEADLINES ARE YOUR BEST FRIEND.";
    console.log("tilText: " + tilText);
    params = {
        // text: encodeURI(tilText),
        text: tilText,
        apikey: '919a594d65f26f48b528c3e9c49a43c84474d294',
        outputMode: 'json'
    }

    //API ENDPOINT http://api.jquery.com/jquery.getjson/

    url = 'https://access.alchemyapi.com/calls/text/TextGetRankedKeywords';
    // url = 'http://access.alchemyapi.com/calls/text/TextGetRankedConcepts';

    //SAMPLE APPROACH - gets JSON of data from Alchemy API
    //http://webtutsdepot.com/2009/11/28/how-to-read-json-with-javascript/
    //http://www.alchemyapi.com/api/keyword/textc.html
    //Text document content (must be uri-argument encoded)
    $.getJSON(url, params, function(data) {
        // console.log('data objects: ');
        // console.log(data);

        // $('body').append(' ('+data.keywords[2].text+':'+data.status+')<br>');

        $.each(data.keywords, function(i, results) {
            // $('body').append(' '+results.text + '<br>');
            // console.log(results.text);
            keywordsArray.push(results.text);
        })

        console.log("keywordsArray :" + keywordsArray);
        var j = keywordsArray[Math.floor(Math.random() * keywordsArray.length)];
        console.log("selected keyword: " + j)

        if (j != "") {
            searchTerm = j;
        } else {
            findTag();
            // searchTerm = "time"; //default
        }

        //NOT WORKING
        // for (var i = 0; i < data.length; i++){
        //     console.log("LOOPING");
        //     console.log(data.keywords[i].text);
        // }
    });
    // console.log("keywordsArray: " + keywordsArray);
    // searchGiphy();
}



// new GET GIPHY JSON FROM API
function searchGiphy() {
    jQuery.ajax({
        // url : api + trendingGif + apiKey, //trending gif
        //new for tag related
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
        }
    })

}

//NEW
  $("#record-display").swipe( {

    //Generic swipe handler for all directions
    swipe:function(event, direction, distance, duration, fingerCount, fingerData) {

      console.log("got swipe first thing");
      //Generate random number
      // var randNum = Math.floor(Math.random() * tabletop.data().length);
      if (direction == "right") {
        swiperightAdvice();

      }
      if (direction == "left") {
        swipeleftAdvice();
      }
    },
  });

  function swiperightAdvice() {
    // console.log(randNum);
    $("#record-display").removeClass().addClass('animated slideOutRight').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass();
      $(this).html.addClass('animated slideInLeft')
    });
    console.log("swipe right");
    renderDisplay();

  };

  function swipeleftAdvice() {
    // console.log(randNum);
    $("#record-display").removeClass().addClass('animated slideOutLeft').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass();
      $(this).addClass('animated slideInRight')
    });
    console.log("swiped left");
    renderDisplay();
  };




window.addEventListener('load', init())
