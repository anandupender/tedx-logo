let input = document.querySelector('#eventName');
let globalEventModifier = "";

let tipBox = document.querySelector("#tipBox");
let tipMultiWord = "Tip: Multi-word event names start on the second line";
let tipWordWrap = "Tip: When the name gets too long, it wraps to the next line";
let tipFinal = "Tip: There can be a max of three lines of event name text";
let tipLong = "Tip: The first word can have 15 characters maximum";
let tipTooLong = "Tip: A single word cannot exceed the max width of the box";

let demoNames = ["Sydney","Grand Rapids","International School of Hyderabad", "Secretaria De Educacion Del Estado De Zacatecas"];
var demoCounter = 0;
var demoToggle = true;

let canvasWidth = 2920;
let canvasHeight = 1200;
let scaleFactor = 4;
let canvasMargin = 10;

var canvas = document.querySelector('#canvas');
canvas.width = canvasWidth;
canvas.height = canvasHeight;
canvas.style.width = canvasWidth/scaleFactor + "px";
canvas.style.height = canvasHeight/scaleFactor + "px";
var ctx = canvas.getContext("2d");
ctx.scale(scaleFactor,scaleFactor);
ctx.font = "normal 69px Helvetica";

var logo = new Image();
logo.src = 'assets/logo.png';
let xPos,yPos = 50;
let imageHeight = 50;
let imageWidth = imageHeight * logo.width / logo.height;
let logoRightSpace = 10;
let letterXHeight = 20;
let xHeight = 50;
let innerBoxHeight = imageHeight + (3*letterXHeight) + (3*xHeight);

input.addEventListener('input', () => {
    input.value = input.value.replace(/[^a-zA-Z ]/g, "")    //do not allow special characters
    if(input.value != ""){
        demoToggle = false; 
    }
    updateValue(input.value);
});

function updateValue(userInput){
    userInput += " " + globalEventModifier;

    document.querySelector("#saveButton").style.display = "block";
    ctx.clearRect(0,0,canvas.clientWidth,canvas.height); //clear screen

    // ctx.fillStyle = "#FFF";
    // ctx.fillRect(canvasMargin, canvasMargin, imageWidth * 4, innerBoxHeight);// draw writing area

    ctx.drawImage(logo, canvasMargin, canvasMargin,imageWidth,imageHeight);

    ctx.fillStyle = "black";
    let newLines = checkAndSplitWords(userInput);

    if(newLines != null){

        for(let currLine = 0; currLine < newLines.length;currLine++){

            //if there is a modifier, bold it!
            if(demoToggle){
                ctx.fillStyle = "#e5e5e5";
            }else{
                ctx.fillStyle = "#000000";
            }
            if(globalEventModifier != "" && currLine == newLines.length - 1){
                let splitWords = newLines[currLine].split(" ");
                let writtenWords = "";
                for(let i = 0; i < splitWords.length;i++){
                    let prevWidth = ctx.measureText(writtenWords).width; //calculate width before changing font
                    if(i == splitWords.length - 1) { //bold last one!
                        ctx.font = "bold 69px Helvetica";
                    }else{
                        ctx.font = "normal 69px Helvetica";
                        splitWords[i] += " ";
                    }
                    if(splitWords.length == 2 && newLines[currLine].length < 15 && newLines.length == 1){ //only two words and less than 15 characters, put on first line
                        ctx.fillText(splitWords[i], canvasMargin + imageWidth + logoRightSpace + prevWidth, canvasMargin + imageHeight);
                    }
                    else{
                        ctx.fillText(splitWords[i], canvasMargin + prevWidth, canvasMargin + imageHeight + ((letterXHeight + xHeight)*(currLine+1)));
                    }
                    writtenWords+=splitWords[i];
                }
            }else{
                if(userInput.trim().indexOf(' ') != -1){ // multiple words
                    ctx.font = "normal 69px Helvetica";
                    ctx.fillText(newLines[currLine], canvasMargin, canvasMargin + imageHeight + ((letterXHeight + xHeight)*(currLine+1)));
                }else{
                    ctx.font = "normal 69px Helvetica";
                    if(newLines[currLine].length < 15){
                        ctx.fillText(newLines[currLine], canvasMargin + imageWidth + logoRightSpace, canvasMargin + imageHeight);
                    }else{
                        ctx.fillText(newLines[currLine], canvasMargin, canvasMargin + imageHeight + ((letterXHeight + xHeight)*(currLine+1)));
                    }
                }
                
            }

        }
    }

    if(!demoToggle){
        let futureTip;
        if(newLines == null){
            futureTip = tipTooLong;
        }else if(newLines.length == 1 && newLines[0].split(" ").length > 1 && globalEventModifier==""){
            futureTip = tipMultiWord;
        }else if(newLines.length == 2){
            futureTip = tipWordWrap;
        }else if(newLines.length == 3){
            futureTip = tipFinal;
        }else{
            futureTip = "";
        }
        showTip(futureTip);
    }
}

function checkAndSplitWords(fullWord){
    let splitWords = fullWord.split(" ");
    var firstLine = "";
    var secondLine = "";
    var thirdLine = "";
    var toReturn = [];

    var i = 0;
    let currLine = 1;
    while(i < splitWords.length){
        if(currLine == 1){
            if(ctx.measureText(firstLine + splitWords[i]).width > imageWidth*4){
                currLine++;
            }else{
                firstLine += splitWords[i] +  " " ;
                toReturn = [firstLine.trim()];
                i++;
            }
        }else if(currLine == 2){
            if(ctx.measureText(secondLine + splitWords[i]).width > imageWidth*4){
                currLine++;
            }else{
                secondLine += splitWords[i]  +  " ";
                toReturn = [firstLine.trim(), secondLine.trim()];
                i++;
            }
        }else if(currLine == 3){
            if(ctx.measureText(thirdLine + splitWords[i]).width > imageWidth*4){
                currLine++;
            }else{
                thirdLine += splitWords[i] + " ";
                toReturn = [firstLine.trim(), secondLine.trim(), thirdLine.trim()];
                i++;
            }
        }else{  //word is just too long in general even for a full line!
            console.log("too long");
            toReturn = null;
            break;
        }
    }
    return toReturn;

}

function saveImage(){
    if(input.value != ""){
        image = canvas.toDataURL("image/png", .1);
        var link = document.createElement('a');
        link.download = "myNewTEDxLogo.png";
        link.href = image;
        link.click();
        alert("Congratulations! You're one step closer to running your TEDx event!");
    }else{
        alert("Hold your horses! You can download your logos after entering your event name.");
    }
}

// Allow for radio buttons to be unchecked!
var options = document.querySelectorAll('input[type="radio"]')
for(var i = 0; i < options.length;i++){
    options[i].onclick = function(){
        if (this.previous) {
            this.checked = false;
            globalEventModifier = "";
        }else{
            globalEventModifier = this.value.charAt(0).toUpperCase() +  this.value.slice(1);
        }
        if(input.value){
            updateValue(input.value);
        }
        this.previous = this.checked;        
    }
}

function showTip(tip){

    if(tipBox.innerHTML != tip){
        // Fade out Tip
        tipBox.style.opacity = 0;
            // Wait for the transition 
        setTimeout(function(){ 
            tipBox.innerHTML = tip;
            // Fade in
            tipBox.style.opacity = 1;
        },250);
    }
}

updateValue("");

// FEATURE: SHOW PLACEHOLDER NAMES

window.setInterval(function(){
    showPlaceholderExamples();
},2500);

function showPlaceholderExamples(){
    if((input.value == "" || input.value == " ") && testWordInput == ""){
        demoToggle = true;
        updateValue(demoNames[demoCounter]);
        demoCounter++;
        if(demoCounter == demoNames.length){
            demoCounter = 0;
        }
    }else{
        demoToggle = false;
    }
}

// COOL CODE THAT ALLOWS YOU TO TYPE DIRECTLY ON THE CANVAS IMAGE
let testWordInput = "";
updateValue(testWordInput);

// Ability to start this demo mode from console if I want
function startDemo(){
    window.addEventListener("keydown", function (event) {
        if (event.defaultPrevented) {
          return; // Do nothing if the event was already processed
        }
        if(event.key.length == 1){
            testWordInput+=event.key;
        }else if(event.key == "Backspace"){
            testWordInput = testWordInput.substring(0, testWordInput.length - 1);
        }
        demoToggle = false;
        updateValue(testWordInput);
    
        console.log(testWordInput);
    }, true);
}

//image carousel
let image = document.querySelector("#tedxHighlights");
let counter = 1;
let numImages = 4;
window.setInterval(swapImage,3000);

function swapImage(){
    image.src="assets/tedx"+counter+".jpg";
    counter++;
    if(counter > numImages){
        counter = 1;
    }
}

window.onload = function() {
    document.querySelector("#eventName").focus();
  }

// const metrics = FontMetrics({
//     fontFamily: 'Helvetica',
//     fontWeight: 'normal',
//     fontSize: 200,
//     origin: 'baseline'
//   })
//   console.log(metrics);

//Real ToDos
// crop the saved canvas image as to not include white space - OR redraw canvas size as it changes!
// get real Helvetica file, font weight
// fix all alignments with proper x-height stuff
// get real TED logo
// comment all code
// optimize code




