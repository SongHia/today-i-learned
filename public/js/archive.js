//API keys
var giphyKey = "&api_key=dc6zaTOxFJmzC"; //Giphy
var alchemyKey = "919a594d65f26f48b528c3e9c49a43c84474d294"; //Alchemy

//objects
var tilRecord; //for TIL API object
var giphyRecord; //for Giphy search object

//global variables
var tilText; //for keyword extratcted gif search
var searchTerm;
var searchType;
var resultsArray;

function init() {
    getTILJSON();
}

function getTILJSON() {
    jQuery.ajax({
        url: '/api/get',
        dataType: 'json',
        success: function(response) {
            tilRecord = response.record;
            loadEntry();
        }
    })
}

function loadEntry() {
    jQuery("#record-display").empty(); //clear old entry
    var i = tilRecord[Math.floor(Math.random() * tilRecord.length)]; //get random entry
    var date = new Date(i.dateAdded); //convert entry date into a date object
    var htmlToAdd = '<div class="col-md-12">' +
        '<h3><span class ="displayDate">' + date.toDateString() + '</span></h3>' + //human readable date
        '<p><span class="displayTil">' + i.til + '</span></p>' +
        '<p>Context: <span class="displayContext">' + i.context + '</span></p>' +
        '<p>The Best Parts: <span class="displayBestPartDay">' + i.bestPartDay + '</span></p>' +
        '<input type="button" class="refresh-button" value="GIF ME MORE" onClick="loadEntry()">' +
        '</div>';
    jQuery("#record-display").append(htmlToAdd); //add new entry
    tilText = i.til + " " + i.context + " " + i.bestPartDay; //Alchemy input text
    passAlchemy(tilText);
}

function passAlchemy(tilText) {
    console.log("characters sent: " + tilText.length);
    params = {
        text: tilText,
        apikey: alchemyKey,
        outputMode: 'json'
    }
    getKeywords(params);
    // getConcepts(params);
    // getTaxnonomy(params);
    // getEmotion(params);
    // getSentiment(params);
}

function getKeywords(params) {
    resultsArray = []; //clears array
    searchType = "keywords";
    url = 'https://gateway-a.watsonplatform.net/calls/text/TextGetRankedKeywords';

    $.ajax({
        type: "POST",
        url: url,
        data: params,
        success: function(data) {
            $.each(data.keywords, function(i, results) {
                resultsArray.push(results.text);
            })
            console.log("keywordArray: " + resultsArray);
            var j = resultsArray[Math.floor(Math.random() * resultsArray.length)];
            searchTerm = j;
            console.log("search term from Alchemy keyword: " + j)
            searchGiphy(resultsArray, searchTerm, searchType);
        },
        dataType: 'json'
    });
}

//http://www.alchemyapi.com/api/concept/textc.html
function getConcepts(params) {
    resultsArray = []; //clears array
    searchType = "concepts";
    url = 'http://gateway-a.watsonplatform.net/calls/text/TextGetRankedConcepts';
    $.ajax({
        type: "POST",
        url: url,
        data: params,
        success: function(data) {
            $.each(data.concepts, function(i, results) {
                resultsArray.push(results.text);
            })
            console.log("concepts: " + resultsArray);
            var j = resultsArray[Math.floor(Math.random() * resultsArray.length)];
            searchTerm = j;
            console.log("search term from Alchemy concept: " + j)
            searchGiphy(resultsArray, searchTerm, searchType);
        },
        dataType: 'json'
    });
}

function getTaxnonomy(params) {
    resultsArray = [];
    searchType = "taxonomies";
    url = 'http://gateway-a.watsonplatform.net/calls/text/TextGetRankedTaxonomy';
    $.ajax({
        type: "POST",
        url: url,
        data: params,
        success: function(data) {
            $.each(data.taxonomy, function(i, results) {
                resultsArray.push(results.label);
            })
            console.log("taxonomies: " + resultsArray);
            var j = resultsArray[Math.floor(Math.random() * resultsArray.length)];
            searchTerm = j;
            searchGiphy(resultsArray, searchTerm, searchType);
        },
        dataType: 'json'
    });
}

//needs work
function getEmotion(params) {
    resultsArray = [];
    searchType = "emotion scores";
    url = 'http://gateway-a.watsonplatform.net/calls/text/TextGetEmotion';
    $.ajax({
        type: "POST",
        url: url,
        data: params,
        success: function(data) {
            console.log("anger score: " + data.docEmotions.anger);
            console.log("disgust score: " + data.docEmotions.disgust);
            console.log("fear score: " + data.docEmotions.fear);
            console.log("joy score: " + data.docEmotions.joy);
            console.log("sadness score: " + data.docEmotions.sadness);
        },
        dataType: 'json'
    });
}

//needs work
function getSentiment(params) {
    var sentimentArray = [];
    url = 'http://gateway-a.watsonplatform.net/calls/text/TextGetTextSentiment';
    $.ajax({
        type: "POST",
        url: url,
        data: params,
        success: function(data) {
            sentimentArray.push(data.docSentiment.type);
            console.log("sentiment " + sentimentArray);
            console.log("sentiment score " + data.docSentiment.score);
        },
        dataType: 'json'
    });
}

function searchGiphy(resultsArray, searchTerm, searchType) {
    var api = "https://api.giphy.com";
    var searchGif = "/v1/gifs/search?";
    var query = "&q=";
    $.ajax({
        url: api + searchGif + query + searchTerm + giphyKey,
        dataType: 'json',
        success: function(response) {
            giphyRecord = response.data;
            giphyBackground(giphyRecord);
        }
    })
}

function giphyBackground() {
    jQuery("#giphy-display").empty(); 
    var i = giphyRecord[Math.floor(Math.random() * giphyRecord.length)]; //random giphy from results
    // $('body').css('background-image', 'url(' + i.images.original.url + ')'); //writes the url to css as bg image

    var htmlToAdd = '<img src="' + i.images.original.url + '">';
    jQuery("#giphy-display").append(htmlToAdd);

    // loadAlchemy();    
}

// function loadAlchemy() {
//     jQuery("#searchterm-display").empty();
//     var htmlToAdd = '<div class="col-md-12">' +
//         '<h6>Alchemy found these ' + searchType + ": " + resultsArray + " and searched Giphy for " + searchTerm + '</h6>' +
//         '</div>';
//     jQuery("#searchterm-display").append(htmlToAdd); //adds entry information
// }

window.addEventListener('load', init())