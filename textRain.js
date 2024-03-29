
    //Credit: https://github.com/Rudxain/RGB-digital-rain?tab=readme-ov-file for inspiration,
    //Credit: https://codepen.io/gnsp/pen/vYBQZJm for general method of implementation

    var body = document.body,
    html = document.documentElement; // Credit: https://stackoverflow.com/questions/1145850/how-to-get-height-of-entire-document-with-javascript for fixing size of svg
    //Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
    //Get webpage size
    var pageWidth = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
    var pageHeight = html.clientHeight; //Is in absolute position, so just need the screen height.

    //console.log(body.scrollHeight);
    //console.log(body.offsetHeight)
    //console.log(html.clientHeight)
    //console.log(html.scrollHeight)
    //console.log(html.offsetHeight)

    //Parameters
    const columnWidth = 30;
    const fontSize = 16;
    const fallSpeed = fontSize;

    // Text Rain fall update| 100 - 300ms, in 25ms increments
    //Performance issues can occur for this to go slower than intended!
    const timeStepSizeMS = 25;
    const textRainUpdateRangeMS = 200;
    const textRainUpdateminMS = 100;
    const trailMSIncrement = timeStepSizeMS;
    const minTrail = 1;


    //Initialisation
    const columnCount = Math.floor(pageWidth / columnWidth) + 1; //Ensure at least two text columns...
    var twoDTextRainArray = Array(columnCount);
    var textRainLengthsArray = Array(columnCount); // Keeping track of array lengths for trails.

    //Create svg canvas
    var svgTextRain = document.createElementNS("http://www.w3.org/2000/svg", "svg",);
    svgTextRain.classList.add("textRain") //Set to use external css

    svgTextRain.setAttribute('width', pageWidth);
    svgTextRain.setAttribute('height', pageHeight);
    var svgTextRainNS = svgTextRain.namespaceURI;

    //Black background
    var rect = document.createElementNS(svgTextRainNS, 'rect');
    rect.setAttribute('x', 0);
    rect.setAttribute('y', 0);
    rect.setAttribute('width', pageWidth);
    rect.setAttribute('height', pageHeight);
    rect.setAttribute('fill', '#000000');

    svgTextRain.appendChild(rect);
    document.body.appendChild(svgTextRain);



    //Initialise the text rain leaders 
    var index = 0

    for (index; index < columnCount; index++) {
                //Get leader attributes to determine trail length
                //Set fall update time (ms) 
                var fallUpdateMs = Math.round((Math.random() * textRainUpdateRangeMS / timeStepSizeMS)) * timeStepSizeMS + textRainUpdateminMS;
    //console.log(fallUpdateMs)

    //Create array based on fall speed.
    var trailLength = Math.floor(((textRainUpdateRangeMS + textRainUpdateminMS) - fallUpdateMs) / trailMSIncrement) + minTrail;
    //console.log(trailLength)

    textRainLengthsArray[index] = trailLength + 1; // Trail plus leader
    twoDTextRainArray[index] = Array(trailLength + 1);

    //Generate leader.
    //Create object
    twoDTextRainArray[index][0] = document.createElementNS(svgTextRainNS, 'text');
    //Assign object parameters
    //Initial Position
    twoDTextRainArray[index][0].setAttribute('x', (columnWidth * index) - columnWidth / 16);
    twoDTextRainArray[index][0].setAttribute('y', Math.floor(Math.random() * -pageHeight * 2));
    //twoDTextRainArray[index][0].setAttribute('y', 200); //Testing

    //Font details
    twoDTextRainArray[index][0].setAttribute('fill', '#ffffff');
    //twoDTextRainArray[index].setAttribute('stroke', '#ffffff'); //Makes them bold
    twoDTextRainArray[index][0].setAttribute('font-size', fontSize.toString());
    //Contents - randomised
    twoDTextRainArray[index][0].textContent = String.fromCharCode(Math.floor(Math.random() * 93) + 1);
    //Assign fall attribute.
    twoDTextRainArray[index][0].setAttribute('fallUpdateMS', fallUpdateMs);
    twoDTextRainArray[index][0].setAttribute('idleTimeMS', 0);

    //Generate trails
    var trailIndex = 1;
    for (trailIndex; trailIndex < textRainLengthsArray[index]; trailIndex++) {
        //Generate trail text element
        twoDTextRainArray[index][trailIndex] = document.createElementNS(svgTextRainNS, 'text');
    //Set attributes similar to leader...
    var trailX = twoDTextRainArray[index][0].getAttribute('x') * 1;
    var trailY = twoDTextRainArray[index][0].getAttribute('y') * 1 - (trailIndex * fallSpeed);

    twoDTextRainArray[index][trailIndex].setAttribute('x', trailX);
    twoDTextRainArray[index][trailIndex].setAttribute('y', trailY);
    //Font details
    twoDTextRainArray[index][trailIndex].setAttribute('fill', '#ffffff');
    //twoDTextRainArray[index][trailIndex].setAttribute('stroke', '#ffffff'); //Makes them bold
    twoDTextRainArray[index][trailIndex].setAttribute('font-size', fontSize.toString());
    var textOpacity = (textRainLengthsArray[index] - trailIndex) / textRainLengthsArray[index]
    twoDTextRainArray[index][trailIndex].setAttribute('fill-opacity', textOpacity.toString());
    //twoDTextRainArray[index][trailIndex].setAttribute('stroke-opacity', textOpacity.toString()); //Fades outline
    //Contents - randomised, not same as leader!
    twoDTextRainArray[index][trailIndex].textContent = String.fromCharCode(Math.floor(Math.random() * 93) + 1);

                    //Will update position based on text ahead - done based on order within function!
                    //twoDTextRainArray[index][trailIndex].setAttribute('nextY', twoDTextRainArray[index][trailIndex-1].getAttribute('y')); // Redundant for now...
                    //console.log(index + " | " + trailIndex);
                }
            }
    //console.log(twoDTextRainArray);
    //Put text elements onto canvas
    updateCanvas(); //Thought that canvas had to be redrawn from scratch every time. This is not the case!

    //Functions

    //Iterate through time for leaders.
    function timeStep() {
                var index = 0
    //console.log(columnCount);
    //Update leader time passed
    for (index; index < columnCount; index++) {
                    //If time to shift text down, reset idle time, otherwise increase idle time
                    var textTimeIdle = twoDTextRainArray[index][0].getAttribute('idleTimeMS') * 1 + timeStepSizeMS;
    var textUpdateTime = twoDTextRainArray[index][0].getAttribute('fallUpdateMS') * 1;
                    //console.log(index);
                    if (textTimeIdle >= textUpdateTime) {
        //Reset idle time, move text & trail down.
        twoDTextRainArray[index][0].setAttribute('idleTimeMS', 0);
    textRainShift(index, textRainLengthsArray[index]);
                        //console.log(index);
                    } else {
        //Increment idle time
        twoDTextRainArray[index][0].setAttribute('idleTimeMS', textTimeIdle);
                    }
                    
                }


            }

    function textRainShift(columnIndex, trailLength) {
                //Start from end of trail, and work towards leader.
                //console.log(columnIndex + " | " + trailLength);
                for (index = trailLength - 1; index > 0; index--) {
                    //Update position for trail element
                    var textAheadPos = twoDTextRainArray[columnIndex][index - 1].getAttribute('y') * 1;
    twoDTextRainArray[columnIndex][index].setAttribute('y', textAheadPos);
    //Update character - random
    twoDTextRainArray[columnIndex][index].textContent = String.fromCharCode(Math.floor(Math.random() * 93) + 1);
                }

    //Have leader fall.
    //Update character - random
    twoDTextRainArray[columnIndex][0].textContent = String.fromCharCode(Math.floor(Math.random() * 93) + 1);
    //Update y position
    var nextLeaderYPos = twoDTextRainArray[columnIndex][0].getAttribute('y') * 1 + fallSpeed;

                //Determine whether to continue falling or restart.
                if ((nextLeaderYPos > (pageHeight * 5) / 6 && Math.random() > 0.9) || nextLeaderYPos > pageHeight) {
        //Return to top of screen
        twoDTextRainArray[columnIndex][0].setAttribute('y', Math.floor(Math.random() * -pageHeight));
                } else {
        //Continue to fall
        twoDTextRainArray[columnIndex][0].setAttribute('y', nextLeaderYPos);
                }
                

            }

    function updateCanvas() {
                //Background
                //svgTextRain.appendChild(rect);
                //Text characters
                var columnIndex = 0;

    for (columnIndex; columnIndex < columnCount; columnIndex++) {
                    //console.log(columnCount);
                    var trailIndex = 0
    for (trailIndex; trailIndex < textRainLengthsArray[columnIndex]; trailIndex++) {
        //Put text characters onto canvas
        svgTextRain.appendChild(twoDTextRainArray[columnIndex][trailIndex]);
                        //console.log(columnIndex + " | " + trailIndex);
                    }

                }

    //Place onto webpage
    document.body.appendChild(svgTextRain);
            }


    //Bug testing function...
    function checkYPos() {
                for (leaderIndex = 0; leaderIndex < columnCount; leaderIndex++) {
        console.log("Index " + leaderIndex + ", yPos:" + twoDTextRainArray[leaderIndex][0].getAttribute('y'))
    }
                
            }


    //How often the rain will update (ms)
    setInterval(timeStep, timeStepSizeMS);

//setInterval(checkYPos, 10000);

