//Giphy Endpoints
var api = "https://api.giphy.com";
var randomGif = "/v1/gifs/random?";
var trendingGif = "/v1/gifs/trending?";
var searchGif = "/v1/gifs/search?";
var query = "&q=";
var apiKey = "&api_key=dc6zaTOxFJmzC";

//new
var tagArray;
var selectTag = "success";

function init() {
    searchGiphy();
}



// new GET GIPHY JSON FROM API
function searchGiphy() {
    //clean record holder
    jQuery('#display').empty();
    var htmlToAdd = '<div class="col-md-12">' +
        '<div class="push"></div>' +
        // '<input type="button" class="refresh-button" value="TIME TRAVEL" onClick="window.location.reload()">' +
        '<div class="success-btn"><a href="/home">add another</a></div>'+
        // '<input type="button" class="refresh-button" value="ADD ANOTHER" onClick="window.location.href=/home">' +
        '</div>';

    jQuery("#display").append(htmlToAdd);

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
