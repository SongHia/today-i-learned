  var api = "https://api.giphy.com";
  var apiTIL = "https://songhitp-today-i-learned.herokuapp.com/api/get"
  
  //Giphy Endpoints
  var randomGif = "/v1/gifs/random?";
  var trendingGif = "/v1/gifs/trending?";
  var searchGif = "/v1/gifs/search?";
  var query = "&q=til";
  
  var apiKey = "&api_key=dc6zaTOxFJmzC";
  
  //embed_url: "http://giphy.com/embed/5BgIKShmpvESQ"

function setup() {
  noCanvas();
  var url = api + searchGif + apiKey + query;
  loadJSON(url, gotData);
  loadJSON(apiTIL, gotTIL);
}

function gotData(giphy) {
  println(giphy.data[0].embed_url);
  // createImg(giphy.data[0].embed_url);
  
  //works to display mage in the canvas
  // createImg(giphy.data[0].images.original.url);
  
  for(var i = 0; i < giphy.data.length; i++)
  {
    createImg(giphy.data[i].images.original.url);
  }
  
  //create HTML elements
  // createElement('h1', articles[i].whatever);
  // createP(articles[i].snippet.whatever);
}

//had to add chrome extension: http://stackoverflow.com/questions/20035101/no-access-control-allow-origin-header-is-present-on-the-requested-resource
function gotTIL(tilData) {
  println(tilData.record[0].til);
  
  for(var i = 0; i < tilData.record.length; i++)
  {
    createP(tilData.record[i].til);
  }
}



// function draw() {
// }

// var films = [];
// var filmData;

// function preload() {
//   filmData = loadJSON("films.json");
// }

// function setup() {
//   createCanvas(480, 120);
//   for (var i = 0; i < filmData.length; i++) {
//     var o = filmData[i];
//     films[i] = new Film(o);
//   }
//   noStroke();
// }

// function draw() {
//   background(0);
//   for (var i = 0; i < films.length; i++) {
//     var x = i*32 + 32;
//     films[i].display(x, 105); 
//   }
// }

// function Film(f) {
//   this.title = f.title;
//   this.director = f.director;
//   this.year = f.year;
//   this.rating = f.rating;
  
//   this.display = function(x, y) {
//     var ratingGray = map(this.rating, 6.5, 8.1, 102, 255);
//     push();
//     translate(x, y);
//     rotate(-QUARTER_PI);
//     fill(ratingGray);
//     text(this.title, 0, 0);
//     pop();
//   }
// }