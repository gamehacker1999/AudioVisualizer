import {drawClouds} from './draw.js';
import {dayTime,cloudSpeed} from './gui.js';
export {init,audioCtx,highshelfBiquadFilter,lowshelfBiquadFilter,gainNode,audioElement,distortionFilter,convolver,convolverGain};

//canvas variables
let canvas;
let ctx;
let canvasCenterX;
let canvasCenterY;

//web audio api
let audioElement;
let audioCtx;
let sourceNode;
let analyzerNode;
let gainNode;
let audioData;
let waveform;

//distortion filters
let lowshelfBiquadFilter;
let highshelfBiquadFilter;
let reverberateFilter;
let distortionFilter;

//convolver
let convolver;
let convolverGain;

let playing = false;

let frameCounter;

let highshelf;
let lowshelf;
let noEffect;

let sunCenterX;
let sunCenterY;

let cloudPos1;
let cloudPos2;
let cloudPos3;
let cloudPos4;

let image1;
let image2;
let boatImageLeft;
let boatImageRight;

let boatPosRight;
let boatPosLeft;

//initializes all variables
function init(){
    
    const SOUND_PATH = Object.freeze({
        sound1: "media/PlayThatSong.mp3",
        sound2: "media/LightsDownLow.mp3",
        sound3: "media/SmallTownBoy.mp3",
        sound4: "media/Beneath The Mask.mp3",
        sound5: "media/New Adventure Theme.mp3",
        sound6: "media/Peanuts Theme.mp3",
        sound7: "media/The Picard Song.mp3"
    });
    const NUM_SAMPLES = 128;
    
    //getting the canvas element and 2d context
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');
    
    //getting the center point of the canvas
    canvasCenterX = canvas.width/2;
    canvasCenterY = canvas.height/2;
    
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    //cloud position
    cloudPos1 = 400;
    cloudPos2 = 700;
    cloudPos3 = 900;
    cloudPos4 = 180;

    //boat position
    boatPosRight = 600;
    boatPosLeft = 400;

    //sun positions
    sunCenterX = canvas.width/2;
    sunCenterY = 400;
    
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    
    // getting a reference to the <audio> element on the page
    audioElement = document.querySelector("audio");
    audioElement.src = SOUND_PATH.sound4;
    
    // create an a source node that points at the <audio> element
    sourceNode = audioCtx.createMediaElementSource(audioElement);
    
    // create an analyser node
    analyzerNode = audioCtx.createAnalyser();
    
    //Fast Fourier Transform
    analyzerNode.fftSize = NUM_SAMPLES;
    
    //audio data has numSamples/2 bins
    audioData = new Uint8Array(NUM_SAMPLES/2);
    
    //waveform data
    waveform = new Uint8Array(NUM_SAMPLES/2);
    
    // creating a gain (volume) node
    gainNode = audioCtx.createGain();
    gainNode.gain.value = 1;

    //creating convolver variables
    convolverGain = audioCtx.createGain();
    convolverGain.gain.value = 0;
    sourceNode.connect(convolverGain);
    convolver = audioCtx.createConvolver();

    let echoURL = "media/echo.wav";

    let impulseResponse = new XMLHttpRequest();
    impulseResponse.open("GET",echoURL,true);
    impulseResponse.responseType = "arraybuffer";

    impulseResponse.onload = function(){
        audioCtx.decodeAudioData(impulseResponse.response,function(buffer){
            convolver.buffer=buffer;
            convolverGain.gain.value = 0;
            convolverGain.connect(convolver);
            convolver.connect(gainNode);
        });
    }

    impulseResponse.send();

    //creating biquad filters
    highshelfBiquadFilter = audioCtx.createBiquadFilter();
    highshelfBiquadFilter.type = "highshelf";
    sourceNode.connect(highshelfBiquadFilter);
    highshelfBiquadFilter.connect(analyzerNode);

    lowshelfBiquadFilter = audioCtx.createBiquadFilter();
    lowshelfBiquadFilter.type = "lowshelf";
    sourceNode.connect(lowshelfBiquadFilter);
    lowshelfBiquadFilter.connect(analyzerNode);

    distortionFilter = audioCtx.createWaveShaper();
    sourceNode.connect(distortionFilter);
    distortionFilter.connect(analyzerNode);

    // connecting the nodes - we now have an audio graph
    sourceNode.connect(analyzerNode);
    analyzerNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    //loading images
    image1 = document.querySelector('#chair1');
    image2 = document.querySelector("#ball");
    boatImageLeft = document.querySelector("#boatLeft");
    boatImageRight = document.querySelector("#boatRight");
    
    frameCounter=0;
    
    highshelf=false;
    lowshelf=false;
    noEffect=true;
    
    //updating
    update();
}

//updates canvas every frame
function update(){
    requestAnimationFrame(update);
    
    frameCounter++;
        
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
    let grad = ctx.createLinearGradient(0,0,0,ctx.canvas.height);
    
    analyzerNode.getByteFrequencyData(audioData);
    analyzerNode.getByteTimeDomainData(waveform);

    let rects = 50;
    let angle = Math.PI*2/rects;
    let max = 0;

    //saving the current canvas state
    ctx.save();

    if(dayTime){
        //creates day time sky
        grad.addColorStop(0, 'navy');
        grad.addColorStop(0.3, 'blue');
        grad.addColorStop(0.7, '#add8e6');

        ctx.fillStyle = grad;
        ctx.fillRect(0,0,canvas.width,canvas.height);

        ctx.save();

        ctx.fillStyle = '#ffff66'; //light yellow color
        
        //draw day time sun
        let daySunX = 120;
        let daySunY = 100;
        let daySunRadius = 70;
        ctx.beginPath();
        ctx.arc(daySunX,daySunY, daySunRadius,0,Math.PI*2);
        ctx.closePath();
        ctx.fill();

        /*ctx.fillStyle = 'black';

        //drawing the circle
        ctx.beginPath();
        ctx.arc(115,100,40,0,Math.PI*2);
        ctx.closePath();
        ctx.fill();*/

        for(let i = 0; i<50; i++){
            ctx.save();
            ctx.translate(daySunX,daySunY);
            ctx.rotate(angle*i+15);
            let width = audioData[i]*0.5;

            //cloud shadows
            if(waveform[i]>max) {
                max = waveform[i]*0.5;
            }

            ctx.fillRect(daySunRadius-20,0,width,5);
            ctx.restore();
        }
        ctx.restore();
    }
    else{
        //creates sunset gradient
        grad.addColorStop(0,'navy'); //#fb7ba2
        grad.addColorStop(0.1,'blue'); //#fb7ba2
        grad.addColorStop(0.4,'orange'); //#fb7ba2
        grad.addColorStop(1, 'red'); //#fce043

        ctx.fillStyle = grad;
        ctx.fillRect(0,0,canvas.width,canvas.height);

        //sun movement
        //sunCenterX+=0.5;
        //sunCenterY+=0.5;
        
        if(sunCenterY>canvas.height+80){
            sunCenterX=-50;
            sunCenterY=-50;
        }
        
        grad.addColorStop(0,'#fc354c');
        grad.addColorStop(1, '#0fbabc');
        
        ctx.fillStyle = 'yellow';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 5;
        
        //drawing the circle
        ctx.beginPath();
        ctx.arc(sunCenterX,sunCenterY,100,0,Math.PI*2);
        ctx.closePath();
        ctx.fill();

        //sun rays and cloud shadows
        for(let i=0;i<50;i++){
            ctx.save();
            ctx.translate(sunCenterX,sunCenterY);
            ctx.rotate(angle*i+15);
            let width = audioData[i]*0.5;
            
            //cloud shadows
            if(waveform[i]>max) 
                max = waveform[i]*0.5;
            
            let x = (canvasCenterX)+(Math.cos(angle*i))*100;
            let y = (canvasCenterY)+(Math.sin(angle*i))*100;
            
            ctx.fillRect(100,0,width,5);
            ctx.restore();
        }
    }
    
    //sand
    ctx.globalAlpha=1.0;
    ctx.fillStyle = '#fdd8b5';
    ctx.fillRect(0,canvas.height/1.3,canvas.width,canvas.height);
    
    //waves
    
    ctx.beginPath();
    ctx.moveTo(0,canvas.height*2/3);
    for(let i=0;i<80;i++){
        
        //ctx.save();

        let height = audioData[i]*0.3;
        
        ctx.lineTo(i*13,canvas.height*2/3+(height+60.5));
        ctx.fillStyle='blue';
        ctx.strokeStyle = 'blue';
        //ctx.fillRect(i*12.5,canvas.height*2/3,13,height+60.5);
        //ctx.restore();
    }
    ctx.lineTo(canvas.width,canvas.height*2/3);
    ctx.fillStyle='blue';
    ctx.strokeStyle = 'blue';
    ctx.closePath();
    ctx.fill();
    
    //updating cloud positions and wrapping them around
    cloudPos1+=1/4*(cloudSpeed);
    if((cloudPos1*0.6)>canvas.width+20)
        cloudPos1=-245;

    cloudPos2+=1/4*(cloudSpeed);
    if((cloudPos2*0.6)>canvas.width+20)
        cloudPos2=-245;

    cloudPos3+=1/4*(cloudSpeed);
    if((cloudPos3*0.6)>canvas.width+20)
        cloudPos3=-245;

    cloudPos4+=1/4*(cloudSpeed);
    if((cloudPos4*0.6)>canvas.width+20)
        cloudPos4=-245;
    
    //drawing clouds
    drawClouds(cloudPos1,100,max,ctx);
    drawClouds(cloudPos2,250,max,ctx);
    drawClouds(cloudPos3,100,max,ctx);
    drawClouds(cloudPos4,250,max,ctx);

    //adding images

    if(dayTime) {
        boatPosRight+=.5;
        if((boatPosRight)>canvas.width+10)
            boatPosRight=-100;
        ctx.drawImage(boatImageRight,boatPosRight,325); //boat moving right

        boatPosLeft-=.75;
        if((boatPosLeft)<-100)
            boatPosLeft=canvas.width+50;
        ctx.drawImage(boatImageLeft,boatPosLeft,360); //boat moving right
    }
    ctx.drawImage(image1,300,380); //chair and umbrella

    //beach ball shadows
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY=8;
    ctx.shadowColor = '#8a795d';
    ctx.drawImage(image2,600,530); //beach ball with shadow

    ctx.restore();
}
