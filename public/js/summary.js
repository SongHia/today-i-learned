var api = "https://api.giphy.com";
var apiKey = "&api_key=dc6zaTOxFJmzC";
var tilText = []; //for keyword extratcted gif search

function init() {
    renderAll();
    renderGiphy();
}

// get Record JSON from /api/get
function renderAll() {
    jQuery('#all-records').empty();
    jQuery.ajax({
        url: '/api/get',
        dataType: 'json',
        success: function(response) {
            var record = response.record;
            for (var i = 0; i < record.length; i++) {
                tilText.push(record[i].til, record[i].context, record[i].bestPartDay);
            }
            passAlchemy(tilText);
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

function passAlchemy() {
    var tilTextString = String(tilText); //converts obj to string
    // var charSent = 18000; //max that can be sent 18,969 char with spaces currently
    // var trimmedString = tilTextString.substring(0, charSent);
    // console.log("characters sent: " + charSent);
    console.log("characters sent: " + tilTextString.length);
    params = {
        // text: trimmedString,
        text: tilTextString,
        apikey: '919a594d65f26f48b528c3e9c49a43c84474d294',
        outputMode: 'json'
    }
    getKeywords(params);
    getConcepts(params);
    getTaxnonomy(params);
    getEmotion(params);
    getSentiment(params);
    // getEntities(params); doesn't work
}

//http://www.alchemyapi.com/api/keyword/textc.html
function getKeywords(params) {
    var keywordsArray = [];
    url = 'https://gateway-a.watsonplatform.net/calls/text/TextGetRankedKeywords';
    $.ajax({
        type: "POST",
        url: url,
        data: params,
        success: function(data) {
            $.each(data.keywords, function(i, results) {
                keywordsArray.push(results.text);
            })
            console.log("keywords: " + keywordsArray);
        },
        dataType: 'json'
    });
}

//http://www.alchemyapi.com/api/concept/textc.html
function getConcepts(params) {
    var conceptsArray = [];
    url = 'https://gateway-a.watsonplatform.net/calls/text/TextGetRankedConcepts';
    $.ajax({
        type: "POST",
        url: url,
        data: params,
        success: function(data) {
            $.each(data.concepts, function(i, results) {
                conceptsArray.push(results.text);
            })
            console.log("concepts: " + conceptsArray);
        },
        dataType: 'json'
    });
}

//http://www.alchemyapi.com/api/taxonomy_calls/text.html
function getTaxnonomy(params) {
    var taxonomyArray = [];
    url = 'https://gateway-a.watsonplatform.net/calls/text/TextGetRankedTaxonomy';
    $.ajax({
        type: "POST",
        url: url,
        data: params,
        success: function(data) {
            $.each(data.taxonomy, function(i, results) {
                taxonomyArray.push(results.label);
            })
            console.log("taxonomy: " + taxonomyArray);
        },
        dataType: 'json'
    });
}

//http://www.alchemyapi.com/api/text-api-0
function getEmotion(params) {
    var emotionArray = [];
    url = 'https://gateway-a.watsonplatform.net/calls/text/TextGetEmotion';
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

// http: //www.alchemyapi.com/api/sentiment/textc.html
function getSentiment(params) {
    var sentimentArray = [];
    url = 'https://gateway-a.watsonplatform.net/calls/text/TextGetTextSentiment';
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

//doesn't really work
// function getEntities(params){
//     var entitiesArray =[];
//     url = 'https://access.alchemyapi.com/calls/text/TextGetRankedNamedEntities';
//     $.getJSON(url, params, function(data) {
//         $.each(data.entities, function(i, entities) {
//             // console.log("entity :" + entities.text + " count: " + entities.count);
//             // console.log(entities.type);         
//             $.each(entities.sentiment, function(i, sentiment) {
//                 entitiesArray.push(sentiment.type);
//             })   
//         })
//         console.log(entitiesArray);
//     });
// }

window.addEventListener('load', init())
