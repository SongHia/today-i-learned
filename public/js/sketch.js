
  var apiTIL = "https://songhitp-today-i-learned.herokuapp.com/api/get";
  var textX; //x positioning for text display
  var records; //holds recordss objects from API
  
  var inputString; //holds keywords, URL, and title in same string
  
  var combinedArray = new Array(); //array with story data for randomization
  var currentLink; //holds the URL of the current story
  var currentTitle; //holds the title of the current story
  
  var headerCopy = 45;
  var bodyCopy = 20;

function setup()
{
  loadJSON(apiTIL, gotTIL);
  textFont("Montserrat");
  textSize(56);
  textLeading(50);
  var canvas = createCanvas(900, 550);
  textX = displayWidth*1/50;
  background('#4ECDC4');
  welcomeMessage(); //first screen
}

function draw()
{
  //holding key draws the transition animation
  // noStroke();
	 //if (mouseClicked == true) {
  //   for (var x = 0; x < width; x+=10) {
  //     for (var y = 0; y <height; y+=10) {
  //       //random rectangle color fill
  //       rect(x, y, 20, 20);
  //       fill(random(0,255),random(0,255),random(0,255));
  //     }
  //   }
  //   textSize(100);
  //   text("COMPUTING", displayWidth*1/10, displayHeight*1/3);
  // }
}

//when released new randomized results are shown
function mouseClicked() 
{
  fill(255);
  console.log("USER CLICKED");
  displaySuggestions(); 
}

function welcomeMessage() //start screen
{  
  textFont("Montserrat");
  textSize(56);
  fill(255);
  textStyle(BOLD);
  text("CLICK TO GET STARTED", displayWidth*1/20, displayHeight*5/20);
  // textSize(40);
  // textStyle(NORMAL);
  // textLeading(40);
  // text("INSPIRATION FROM THE MOST SHARED NYT STORIES", displayWidth*1/20, displayHeight*5/20, width*19/20, height);
  // textSize(30);
  // text("HOLD SPACEBAR FOR A SUGGESTION", displayWidth*1/20, displayHeight*12/20);
}

function getTopic()
{
  textFont("Montserrat");
  var randomTopic = int(random(0, combinedArray.length)); //randomly selects an index from the array
  var suggestedTopic = combinedArray[randomTopic]; //stores the random result in a string that will be parsed
  var allLines = splitTokens(suggestedTopic, "\n"); //splits the string based on linebreaks so TIL, context, Best Part Of Day can be separated
  currentTil = allLines[0]; 
  currentContext = allLines[1]; 
  currentBestPartDay = allLines[1];
  
  textSize(headerCopy);
  textStyle(BOLD);
  
  text("One Day I Learned: ",textX, displayHeight*1/20);
  textStyle(NORMAL);
  textSize(bodyCopy);
  text(currentTil.toUpperCase(), textX, displayHeight*1/20, width*19/20, displayHeight*4/20);
  
  textSize(headerCopy);
  textStyle(BOLD);
  text("The Context Was: " , textX, displayHeight*7/20);
  textStyle(NORMAL);
  textSize(bodyCopy);
  text(currentContext.toUpperCase(), textX, displayHeight*8/20);
  
  textSize(headerCopy);
  textStyle(BOLD);
  text("The Best Part Of That Day: ", textX, displayHeight*11/20);
  textStyle(NORMAL);
  textSize(bodyCopy);
  text(currentBestPartDay.toUpperCase(), textX, displayHeight*12/20);
}

//display screen of results
function displaySuggestions()
{
  removeElements(); //clears the previous story URL
  background('#4ECDC4'); //covers previous results
  textSize(50);
  getTopic(); //displays randomized topic
}

function gotTIL(tilData) {
    
  for(var i = 0; i < tilData.record.length; i++)
  {
    // createP(tilData.record[i].til);
    inputString = tilData.record[i].til +"\n" + tilData.record[i].context +"\n"+ tilData.record[i].bestParDay; //mega string
    combinedArray = append(combinedArray, inputString); //adds the string of associated story data to an array
    console.log(combinedArray);
  }
}