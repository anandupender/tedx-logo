let input = document.querySelector('#eventName');
let globalEventModifier = "";
input.addEventListener('input', () => updateValue(input.value));

let tipBox = document.querySelector("#tipBox");
let tipMultiWord = "Tip: Multi-word event names start on the second line";
let tipWordWrap = "Tip: When the name gets too long, it wraps to the next line";
let tipFinal = "Tip: There can be a max of three lines of event name text";
let tipLong = "Tip: The first word can have 15 characters maximum";

let canvasWidth = 2920;
let canvasHeight = 1200;
let scaleFactor = 4;
let canvasMargin = 20;

var canvas = document.querySelector('#canvas');
canvas.width = canvasWidth;
canvas.height = canvasHeight;
canvas.style.width = canvasWidth/scaleFactor + "px";
canvas.style.height = canvasHeight/scaleFactor + "px";
var ctx = canvas.getContext("2d");
ctx.scale(scaleFactor,scaleFactor);
ctx.font = "normal 69px Helvetica";

let logo = new Image();
logo.src = '../assets/logo.png';
let xPos,yPos = 50;
let imageHeight = 50;
let imageWidth = imageHeight * logo.width / logo.height;
let logoRightSpace = 10;
let letterXHeight = 20;
let xHeight = 50;
let innerBoxHeight = imageHeight + (3*letterXHeight) + (3*xHeight);

function updateValue(userInput){
    userInput += " " + globalEventModifier;
    console.log(userInput);

    document.querySelector("#saveButton").style.display = "block";
    ctx.clearRect(0,0,canvas.clientWidth,canvas.height); //clear screen

    ctx.fillStyle = "#EEE";
    ctx.fillRect(0, 0, canvas.width, canvas.height); //draw boundary margin box

    ctx.fillStyle = "#FFF";
    ctx.fillRect(canvasMargin, canvasMargin, imageWidth * 4, innerBoxHeight);// draw writing area

    ctx.drawImage(logo, canvasMargin, canvasMargin,imageWidth,imageHeight);

    ctx.fillStyle = "black";
    let newLines = checkAndSplitWords(userInput);

    for(let currLine = 0; currLine < newLines.length;currLine++){

        //if there is a modifier, bold it!
        if(globalEventModifier != "" && currLine == newLines.length - 1){
            let splitWords = newLines[currLine].split(" ");
            console.log(splitWords);
            let writtenWords = "";
            for(let i = 0; i < splitWords.length;i++){
                let prevWidth = ctx.measureText(writtenWords).width; //calculate width before changing font
                if(i == splitWords.length - 1) { //bold last one!
                    ctx.font = "bold 69px Helvetica";
                }else{
                    ctx.font = "normal 69px Helvetica";
                    splitWords[i] += " ";
                }
                if(splitWords.length == 2 && newLines[currLine].length < 15){ //only two words and less than 15 characters, put on first line
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
    let futureTip;
    if(newLines.length == 1){
        futureTip = tipMultiWord;
    }else if(newLines.length == 2){
        futureTip = tipWordWrap;
    }else if(newLines.length == 3){
        futureTip = tipFinal;
    }
    showTip(futureTip);
}

function checkAndSplitWords(fullWord){
    let splitWords = fullWord.split(" ");
    console.log("splitWords: " + splitWords);
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
            break;
        }
    }
    console.log("final: " + toReturn);
    return toReturn;

}

function saveImage(){
    image = canvas.toDataURL("image/png", .1);
    var link = document.createElement('a');
    link.download = "myNewTEDxLogo.png";
    link.href = image;
    link.click();
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
        //if(input.value){
        updateValue(input.value);
        // }else{
        //     globalEventModifier = "";
        //     updateValue("");
        // }
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

// const metrics = FontMetrics({
//     fontFamily: 'Helvetica',
//     fontWeight: 'normal',
//     fontSize: 200,
//     origin: 'baseline'
//   })
//   console.log(metrics);

//Real ToDos
// make first push to github!
// crop the saved canvas image as to not include white space - OR redraw canvas size as it changes!
//get real Helvetica file, font weight
//fix all alignments with proper x-height stuff
//get real TED logo
//add modifiers
//fix way too many characters edge case 
// dont allow TEDxYouth without any words typed
// comment all code
//optimize code

//Make it look Real ToDos
// add TED legal Footer
//link back to the TED site
//

//Ideas ToDo
// Validation as to not allow special characters
//tips as to show the rules
//special styling checks like make sure each word is capitalized




