//Giphy Endpoints
var api = "https://api.giphy.com";
var randomGif = "/v1/gifs/random?";
var trendingGif = "/v1/gifs/trending?";
var searchGif = "/v1/gifs/search?";
var query = "&q=";
var apiKey = "&api_key=dc6zaTOxFJmzC";

//new
var tagArray;
var selectTag;

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
            var date = new Date(i.dateAdded); // 	turn string into a date object

            var htmlToAdd = '<div class="col-md-12">' +
                '<h1><span class ="displayDate">' + date.toDateString() + '</span></h1>' +
                '<h2><span class="displayTil">' + i.til + '</span></h2>' +
                '<h2>Context: <span class="displayContext">' + i.context + '</span></h2>' +
                '<h2>The Best Part: <span class="displayBestPartDay">' + i.bestPartDay + '</span></h2>' +
                '<h3>Tags: <span class="tags">' + i.tags + '</span></h3>' +
                '<h2 class="hide">ID: <span class="displayId">' + i._id + '</span></h2>' +
                '<input type="button" class="refresh-button" value="TIME TRAVEL" onClick="window.location.reload()">' +
                '</div>';

            jQuery("#record-display").append(htmlToAdd);

            //new
            tagArray = i.tags;
            // console.log("tags: " + tagArray);
            var j = tagArray[Math.floor(Math.random() * tagArray.length)];
            // console.log("j value: " + j);
            selectTag = j;
            console.log("select tag: " + selectTag);
            searchGiphy();
        }
    })
}

// new GET GIPHY JSON FROM API
function searchGiphy() {
    jQuery.ajax({
        // url : api + trendingGif + apiKey, //trending gif
        //new for tag related
        url: api + searchGif + query + selectTag + apiKey,
        dataType: 'json',
        success: function(response) {

            var data = response.data; //stores the data object
            var i = data[Math.floor(Math.random() * data.length)]; //randomly picks data object from current trending gifs
            // console.log(i.images.original.url); //checks the url property
            $('body').css('background-image', 'url(' + i.images.original.url + ')'); //writes the url to css as bg image
            // $('randbg').css('background', 'url(' + i.images.original.url + ')' + 'no-repeat center center fixed'); //writes the url to css as bg image
            // console.log("giphy url: " + i.url);
            console.log("giphy queryTags: " + selectTag);
            // console.log("giphy image url: " + i.images.original.url);
        }
    })

}

window.addEventListener('load', init())
