//Giphy Endpoints
var api = "https://api.giphy.com";
var randomGif = "/v1/gifs/random?";
var trendingGif = "/v1/gifs/trending?";
var apiKey = "&api_key=dc6zaTOxFJmzC";

function init() {
    renderGiphy();
}

//GET GIPHY JSON FROM API
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

window.addEventListener('load', init())
