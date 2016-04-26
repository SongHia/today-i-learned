var giphyKey = "&api_key=dc6zaTOxFJmzC"; //Giphy
var searchTerm = "success";
var giphyRecord; //for Giphy search object

function init() {
    var htmlToAdd = '<div class="col-md-12">' +
        '<div class="push"></div>' +
        '<div class="success-btn"><a href="/home">add another</a></div>' +
        '</div>';
    jQuery("#display").append(htmlToAdd);
    searchGiphy();
}

function searchGiphy() {
    var api = "https://api.giphy.com";
    var searchGif = "/v1/gifs/search?";
    var query = "&q=";
    $.ajax({
        url: api + searchGif + query + searchTerm + giphyKey,
        dataType: 'json',
        success: function(response) {
            giphyRecord = response.data;
            giphyBackground();
        }
    })
}

function giphyBackground() {
    jQuery("#display").empty();
    var i = giphyRecord[Math.floor(Math.random() * giphyRecord.length)]; //random giphy from results
    $('body').css('background-image', 'url(' + i.images.original.url + ')'); //writes the url to css as bg image
}

window.addEventListener('load', init())
