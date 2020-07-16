//
//  ____  ____  ____  _  _                            
//  (_  _)(  __)(    \( \/ )                           
//    )(   ) _)  ) D ( )  (                            
//   (__) (____)(____/(_/\_)                           
//   __     __    ___   __                             
//  (  )   /  \  / __) /  \                            
//  / (_/\(  O )( (_ \(  O )                           
//  \____/ \__/  \___/ \__/                            
//    ___  ____  __ _  ____  ____   __  ____  __  ____ 
//   / __)(  __)(  ( \(  __)(  _ \ / _\(_  _)/  \(  _ \
//  ( (_ \ ) _) /    / ) _)  )   //    \ )( (  O ))   /
//   \___/(____)\_)__)(____)(__\_)\_/\_/(__) \__/(__\_)
//
//
//  Welcome to the Official TEDx Logo Generator!
//  Created amidst the crazy world of the COVID-19 Pandemic, June 2020
//  Design system created by Mike Femia, Peter Zweifel, Dian Lofton, and Casey Walter
//  Site designed and coded by Anand Upender (anandupender.com) with direction from David Rosenberg
//  Created with rad CSS animations from Animate.css and SASS Compiling. No <canvas> libraries used
//  View this project on Github: https://github.com/anandupender/tedx-logo
//
//


// GLOBAL CONSTANTS - CANVAS
var canvas;
var ctx;
let canvasWidth = 2920;
let canvasHeight = 1200;
let scaleFactor = 4;
let canvasMargin = 30;

// GLOBAL CONSTANTS - CANVAS IMAGE
const logo = new Image(); 
logo.onload = function() {
    imageWidth = imageHeight * logo.width / logo.height;
}
logo.src = 'assets/logo.png';
const xPos = 50;
const yPos = 50;
const imageHeight = 50;
var imageWidth;
const logoRightSpace = 10;
const letterXHeight = 20;
const xHeight = 50;

// GLOBAL CONSTANTS - TIPS
const tipBox = document.querySelector("#tipBox");
const tipMultiWord = "Tip: Multi-word event names start on the second line";
const tipWordWrap = "Tip: When the name gets too long, it wraps to the next line";
const tipFinal = "Tip: There can be a max of three lines of event name text";
const tipLong = "Tip: The first word can have 15 characters maximum";
const tipTooLong = "Tip: Your event name is too long or has a word that is too long";

// GLOBAL VARIABLES - USER INPUT
let input = document.querySelector('#eventName');
var currContentHeight;
var currContentWidth;
let currEventModifier = "";

// GLOBAL VARIABLES - DEMO
const demoNames = ["Sydney","Grand Rapids","International School of Hyderabad", "Secretaria De Educacion Del Estado De Zacatecas"];
var demoCounter = 0;
var demoToggle = true;

// GLOBAL VARIABLES - CAROUSEL
const tedxImage = document.querySelector("#tedxHighlights");
let counter = 1;
let numImages = 4;

window.onload = function() {
    createCanvas();
    prepareUserInput();
    updateValue("", canvas,ctx);
    // FEATURE: SHOW PLACEHOLDER NAMES
    window.setInterval(function(){
        showPlaceholderExamples();
    },2500);

    document.querySelector("#eventName").focus();
    console.log(easter1);
    console.log(`
    Thanks for stopping by and looking under the hood!
    Site created by Anand Upender at TED Conferences LLC in 2020
    Have a great day! (⌐ ͡■ ͜ʖ ͡■)
    `);
};

function createCanvas(){
    canvas = document.querySelector('#canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.width = canvasWidth/scaleFactor + "px";
    canvas.style.height = canvasHeight/scaleFactor + "px";
    ctx = canvas.getContext("2d");
    ctx.scale(scaleFactor,scaleFactor);
    ctx.font = "normal 70px Helvetica";
}

// FUNCTION - GET USER EVENT NAME INPUT AND FILTER OUT INPROPER CHARACTERS
function prepareUserInput(){
    input.addEventListener('input', () => {
        input.value = input.value.replace(/[^a-zA-Z ]/g, "")    //do not allow special characters
        if(input.value != ""){
            demoToggle = false; 
        }
        updateValue(input.value, canvas, ctx);
        if(input.value.toLowerCase().includes(easter2.name)){
            window.open(easter2.url, '_blank');
        }
    });
}

// FUNCTION - UPDATE CANVAS WITH USER INPUT AND CURRENT EVENT MODIFIER
function updateValue(userInput, currCanvas, currCtx,color){
    userInput += " " + currEventModifier;

    // Clear screen
    currCtx.clearRect(0,0,currCanvas.clientWidth,currCanvas.height);
    var textColor;
    if(color == "black"){
        textColor = "#FFF";
    }else{
        textColor = "#000";
    }

    //Draw Logo
    currCtx.drawImage(logo, canvasMargin, canvasMargin,imageWidth,imageHeight);

    currCtx.fillStyle = textColor;
    let newLines = checkAndSplitWords(userInput);

    if(newLines != null){
        let maxWidth = 0;
        let maxHeight = 0;
        for(let currLine = 0; currLine < newLines.length;currLine++){

            // If showing demo placeholders, decrease font color
            if(demoToggle){
                currCtx.fillStyle = "#d5d5d5";
            }else{
                currCtx.fillStyle = textColor;
            }

            if(currEventModifier != "" && currLine == newLines.length - 1){
                let splitWords = newLines[currLine].split(" ");
                let writtenWords = "";
                for(let i = 0; i < splitWords.length;i++){
                    let prevWidth = currCtx.measureText(writtenWords).width; //calculate width before changing font
                    if(i == splitWords.length - 1) { //bold last word!
                        currCtx.font = "bold 70px Helvetica";
                    }else{
                        currCtx.font = "normal 70px Helvetica";
                        splitWords[i] += " ";
                    }

                    // If only two words and less than 15 characters, put on first line
                    let xAdder = 0;
                    let yAdder = 0;
                    if(splitWords.length == 2 && newLines[currLine].length < 15  && newLines.length == 1){ 
                        xAdder = imageWidth + logoRightSpace;
                    }else{
                        yAdder = ((letterXHeight + xHeight)*(currLine+1))
                    }
                    currCtx.fillText(splitWords[i], canvasMargin + prevWidth + xAdder, canvasMargin + imageHeight + yAdder);
                    writtenWords+=splitWords[i];

                    // Keep track of max text width
                    if(canvasMargin + prevWidth + currCtx.measureText(splitWords[i]).width + xAdder > maxWidth){
                        maxWidth = canvasMargin + prevWidth + currCtx.measureText(splitWords[i]).width + xAdder;
                    }
                    if(canvasMargin + imageHeight + yAdder > maxHeight){
                        maxHeight = canvasMargin + imageHeight + yAdder;
                    }
                }
            }else{
                currCtx.font = "normal 70px Helvetica";
                let xAdder = 0;
                let yAdder = 0;
                if(userInput.trim().indexOf(' ') != -1 || newLines[currLine].length > 15){ // multiple words or long word
                    yAdder = ((letterXHeight + xHeight)*(currLine+1));
                }else{
                    xAdder = imageWidth + logoRightSpace;
                }
                currCtx.fillText(newLines[currLine], canvasMargin + xAdder, canvasMargin + imageHeight + yAdder);

                // Keep track of max text width
                if(canvasMargin + currCtx.measureText(newLines[currLine]).width + xAdder > maxWidth){
                    maxWidth = canvasMargin + currCtx.measureText(newLines[currLine]).width + xAdder;
                }
                if(yAdder + canvasMargin + imageHeight > maxHeight){
                    maxHeight = yAdder + canvasMargin + imageHeight;
                }
            }
        }

        // Update the overal width of all content in the canvas
        if(currCanvas == canvas){
            currContentWidth = maxWidth;
            currContentHeight = maxHeight;
        }
    }

    // WHEN NOT ON DEMO MODE, SHOW TIPS AS THE USER TYPES
    if(!demoToggle){
        let futureTip;
        if(newLines == null){
            futureTip = tipTooLong;
        }else if(newLines.length == 1 && newLines[0].split(" ").length > 1 && currEventModifier==""){
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

// FUNCTION - CHECK LINE WIDTH OF WORDS AND SPLIT INTO MULTIPLE LINES
function checkAndSplitWords(fullWord){
    let splitWords = fullWord.split(" ");
    var toReturn = ["","",""];
    let currLine = 0;

    for(var i = 0; i < splitWords.length;i++){
        if(currLine < 3){
            if(ctx.measureText(toReturn[currLine] + splitWords[i]).width > imageWidth*4){
                toReturn[currLine] = toReturn[currLine].trim();
                currLine++;
                i--; //don't go on to the next one if it doesn't fit
            }else{
                toReturn[currLine] += splitWords[i] + " ";
            }
        }else{
            return null;  //too long, show nothing!
        }
    }

    //truncate array to just the lines with values
    for(var j = 0; j < 3;j++){
        if(toReturn[j] === "" || toReturn[j] === undefined){
            toReturn.splice(j,2)
        }
        else{
            toReturn[j] = toReturn[j].trim();
        }
    }
    return toReturn;
}

var zip = new JSZip();
var topSection = document.querySelector(".topSection");
var savedSection = document.querySelector(".savedContainer");

// FUNCTION - SAVE BUTTON FUNCTION
function saveImage(){
    if(input.value != ""){
        prepForDownload("black");
    }else{
        alert("Hold your horses! You can download your logos after entering your event name.");
    }
}

// FUNCTION - CREATE TEMPORARY CANVAS TO CROP TO PROPER SIZE 
function prepForDownload(color){
   
    // Create a temporary canvas sized to the cropped size
    var canvasTemp=document.createElement('canvas');
    canvasTemp.width=(currContentWidth + canvasMargin)*scaleFactor;
    canvasTemp.height=(currContentHeight + canvasMargin)*scaleFactor;

    var ctxTemp=canvasTemp.getContext('2d');
    ctxTemp.scale(scaleFactor,scaleFactor);

    updateValue(input.value, canvasTemp,ctxTemp,color);

    //TODO: fix this janky way of waiting till all images uploaded before saving
    canvasTemp.toBlob(function (blob) {
        zip.file(color+".png", blob);
        if(color == "black"){
            prepForDownload("white");
        }else{
            zip.generateAsync({type:"blob"})
            .then(function (blob) {
                saveAs(blob, "tedx.zip");
                // alert("Congratulations! Check out that gorgeous logo of yours!");
                if(currEventModifier != ""){
                    currEventModifier = " " + currEventModifier;
                }
                // savedSection.innerHTML = "Congrats TEDx" + input.value + currEventModifier + " Organizer!";
                // topSection.classList.add("saved");
                // window.setTimeout(function (){
                //     topSection.classList.remove("saved");
                // },3000);
                alert("🎉 Woohoo! Congrats on your official TEDx Logo");
            });
        }
    });
}

// FUNCTION - HELPER TO ALLOW FOR RADIO BUTTONS TO BE UNSELECTED
var options = document.querySelectorAll('input[type="radio"]')
for(var i = 0; i < options.length;i++){
    options[i].onclick = function(){
        if (this.previous) {
            this.checked = false;
            currEventModifier = "";
        }else{
            currEventModifier = this.value.charAt(0).toUpperCase() +  this.value.slice(1);
        }
        if(input.value){
            updateValue(input.value,canvas,ctx);
        }
        this.previous = this.checked;        
    }
}

// FUNCTION - SHOW TIP HELPER
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

// FUNCTION: SHOW PLACEHOLDER NAMES HELPER
function showPlaceholderExamples(){
    if((input.value == "" || input.value == " ")){
        demoToggle = true;
        updateValue(demoNames[demoCounter],canvas,ctx);
        demoCounter++;
        if(demoCounter == demoNames.length){
            demoCounter = 0;
        }
    }else{
        demoToggle = false;
    }
}

// FUNCTION - ROTATE THROUGH IMAGES ON BOTTOM 
function swapImage(){
    tedxImage.src="assets/tedx"+counter+".jpg";
    counter++;
    if(counter > numImages){
        counter = 1;
    }
}

window.setInterval(swapImage,2500);

const easter1 = `
████████ ███████ ██████  ██   ██                                             
   ██    ██      ██   ██  ██ ██                                              
   ██    █████   ██   ██   ███                                               
   ██    ██      ██   ██  ██ ██                                              
   ██    ███████ ██████  ██   ██                                             
                                                                             
                                                                             
██       ██████   ██████   ██████                                            
██      ██    ██ ██       ██    ██                                           
██      ██    ██ ██   ███ ██    ██                                           
██      ██    ██ ██    ██ ██    ██                                           
███████  ██████   ██████   ██████                                            
`;

const easter2 = {name:"anandupender",url:"https://www.anandupender.com/"};

// DEMO FEATURE: MAKE BUTTONS INTERACT WITH MOUSE POSITION

// document.onmousemove = handleMouseMove;
// let maxDist = 200;
// var button = document.querySelector("#emoji")
// var buttonLoc = button.getBoundingClientRect();
// var buttonX = (buttonLoc.right + buttonLoc.left)/2;
// var buttonY = (buttonLoc.bottom + buttonLoc.top)/2;

// function handleMouseMove(event){
//     var dist = Math.sqrt( Math.pow((event.pageX-buttonX), 2) + Math.pow((event.pageY-buttonY), 2) );
//     var angleDeg = Math.atan2(buttonY - event.pageY, buttonX - event.pageX) * 180 / Math.PI;

//     console.log(dist);
//     if(dist >= (buttonLoc.right - buttonLoc.left)/2 && dist < maxDist){
//         // angleDeg=90;
//         button.style.transform = "rotate("+ angleDeg+"deg)";
//     }else{
//         // button.style.transform = "rotate(0deg)"; //keep is straight when you're inside the button
//     }
// }


// COOL CODE THAT ALLOWS YOU TO TYPE DIRECTLY ON THE CANVAS IMAGE
// let testWordInput = "";
// updateValue(testWordInput);

// FUNCTION TO CAPTURE KEYPRESSES OUTSIDE OF THE INPUT FIELD, TOO INTRUSIVE
// function startDemo(){
//     window.addEventListener("keydown", function (event) {
//         if (event.defaultPrevented) {
//           return; // Do nothing if the event was already processed
//         }
//         if(event.key.length == 1){
//             testWordInput+=event.key;
//         }else if(event.key == "Backspace"){
//             testWordInput = testWordInput.substring(0, testWordInput.length - 1);
//         }
//         demoToggle = false;
//         updateValue(testWordInput);
    
//         console.log(testWordInput);
//     }, true);
// }

// SOME SORT OF LIBRARY THAT HELPS YOU GET THE CHARACTERISTICS OF A FONT
// const metrics = FontMetrics({
//     fontFamily: 'Helvetica',
//     fontWeight: 'normal',
//     fontSize: 200,
//     origin: 'baseline'
//   })
//   console.log(metrics);



