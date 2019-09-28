
//import * as dat from 'dat.gui';
//const gui = new dat.GUI();

import {drawClouds,manipulatePixels} from './draw.js';
import {requestFullscreen,toggleHighShelf,toggleLowShelf} from './input.js';
export {init};

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
let destinationNode;
let audioData;
let waveform;

//distortion filters
let lowshelfBiquadFilter;
let highshelfBiquadFilter;
let reverberateFilter;

//distortion booleans
let highshelf;
let lowshelf;
let noEffect;

let playing = false;

let sunCenterX;
let sunCenterY;

let cloudPos1;
let cloudPos2;
let cloudPos3;
let cloudPos4;

let tintRed = false;
let noise = false;
let invert = false;
let sepia = false;

let frameCounter;

let image1;
let image2;

function init(){
    
    const SOUND_PATH = Object.freeze({
        sound1: "media/New Adventure Theme.mp3",
        sound2: "media/Peanuts Theme.mp3",
        sound3:  "media/The Picard Song.mp3"
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

    //sun positions
    sunCenterX = canvas.width/2;
    sunCenterY = 400;
    
    audioElement = document.querySelector('audio');
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    
    // getting a reference to the <audio> element on the page
    audioElement = document.querySelector("audio");
    audioElement.src = SOUND_PATH.sound2;
    
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

    //creating biquad filters
    highshelfBiquadFilter = audioCtx.createBiquadFilter();
    highshelfBiquadFilter.type = "highshelf";
    sourceNode.connect(highshelfBiquadFilter);
    highshelfBiquadFilter.connect(analyzerNode);

    lowshelfBiquadFilter = audioCtx.createBiquadFilter();
    lowshelfBiquadFilter.type = "lowshelf";
    sourceNode.connect(lowshelfBiquadFilter);
    lowshelfBiquadFilter.connect(analyzerNode);

    // connecting the nodes - we now have an audio graph
    sourceNode.connect(analyzerNode);
    analyzerNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    //loading images
    image1 = document.querySelector('#chair1');
    image2 = document.querySelector("#ball");
    
    frameCounter=0;
    
    highshelf=false;
    lowshelf=false;
    noEffect=true;
    
    //setting up the UI
    setupUI();
    
    //updating
    update();
    
}

function update(){
    requestAnimationFrame(update);
    
    frameCounter++;
    
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
    let grad = ctx.createLinearGradient(0,0,0,ctx.canvas.height);
    grad.addColorStop(0,'#fb7ba2');
    grad.addColorStop(1, '#fce043');
    ctx.fillStyle = grad;    
    
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    analyzerNode.getByteFrequencyData(audioData);
    
    analyzerNode.getByteTimeDomainData(waveform);
    
    //sunCenterX+=0.5;
    //sunCenterY+=0.5;
    
    if(sunCenterY>canvas.height+80){
        sunCenterX=-50;
        sunCenterY=-50;
    }
    
    //saving the current canvas state
    ctx.save();
    grad.addColorStop(0,'#fc354c');
    grad.addColorStop(1, '#0fbabc');
    
    ctx.fillStyle = 'yellow';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    
    //drawing the circle
    ctx.beginPath();
    ctx.arc(sunCenterX,sunCenterY,100,0,Math.PI*2);
    ctx.closePath();
    //ctx.stroke();
    ctx.fill();
    
    let rects = 50;
    let angle = Math.PI*2/rects;
    
    let max = 0;
    for(let i=0;i<50;i++){
        
        ctx.save();
        ctx.translate(sunCenterX,sunCenterY);
        ctx.rotate(angle*i+15);
        let width = audioData[i]*0.5;
        
        if(waveform[i]>max) max = waveform[i]*0.5;
        
        let x = (canvasCenterX)+(Math.cos(angle*i))*100;
        let y = (canvasCenterY)+(Math.sin(angle*i))*100;
        
        
        ctx.fillRect(100,0,width,5);
        
        ctx.restore();
        
    }
    
    ctx.globalAlpha=1.0;
    ctx.fillStyle = '#fdd8b5';
    ctx.fillRect(0,canvas.height/1.3,canvas.width,canvas.height);
    
    ctx.globalAlpha = 1.0;
    
        for(let i=0;i<80;i++){
        
        ctx.save();

        let height = audioData[i]*0.3;
        
        let x = (canvasCenterX)+(Math.cos(angle*i))*100;
        let y = (canvasCenterY)+(Math.sin(angle*i))*100;
        
        ctx.fillStyle='blue';
        ctx.strokeStyle = 'blue';
        ctx.fillRect(i*12.5,canvas.height*2/3,13,height+60.5);
        
        ctx.restore();
        
    }
      

    //updating cloud positions and wrapping them around
    cloudPos1+=1/4;
    if((cloudPos1*0.6)>canvas.width+20)
        cloudPos1=-245;

    cloudPos2+=1/4;
    if((cloudPos2*0.6)>canvas.width+20)
        cloudPos2=-245;

    cloudPos3+=1/4;
    if((cloudPos3*0.6)>canvas.width+20)
        cloudPos3=-245;

    cloudPos4+=1/4;
    if((cloudPos4*0.6)>canvas.width+20)
        cloudPos4=-245;
    
    //drawing clouds
    drawClouds(cloudPos1,100,max,ctx);
    drawClouds(cloudPos2,250,max,ctx);
    drawClouds(cloudPos3,100,max,ctx);
    drawClouds(cloudPos4,250,max,ctx);

    //adding images
    ctx.drawImage(image1,300,380);

    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY=8;
    ctx.shadowColor = '#8a795d';
    ctx.drawImage(image2,600,530);

    //adding photoshipish effects
    manipulatePixels(ctx,tintRed,invert,noise,sepia);

    ctx.restore();
}

function setupUI(){
    //full screen button
    let fsButton = document.querySelector('#fullScreenButton');
    fsButton.onclick = e => {
        requestFullscreen(canvas);
    };
    
    let playButton = document.querySelector('#playButton');
    playButton.onclick = e =>{
        
        //if audio context is suspended then resume it
        if(audioCtx.state === 'suspended'){
            audioCtx.resume();
        }
        
        //if the music wasn't playing then play it
        if(playing===false){
            playing = true;
            audioElement.play();
            //e.target.innerHTML = 'Pause';
        }
        
        //else pause it
        else{
            playing=false;
            audioElement.pause();
            //e.target.innerHTML = 'Play';
        }
    };
    
    //selecting a track
    let trackSelect = document.querySelector('#songSelect');
    
    trackSelect.onchange = e => {
        //pause the current track if it is playing using dispatch events
        playButton.dispatchEvent(new MouseEvent("click"));
        
        //changing the song
        audioElement.src = e.target.value;
        
    };
    
    //setting up the volume slider
    let volumeSlider = document.querySelector('#volumeSlider');
    volumeSlider.oninput = e =>{
        gainNode.gain.value = e.target.value/100;
        volumeLabel.innerHTML = e.target.value;
    };
    volumeSlider.dispatchEvent(new InputEvent('input'));
    
    //setting up the checkboxes
    document.querySelector('#tintCB').checked = tintRed;
    document.querySelector('#tintCB').onchange = e => tintRed = e.target.checked;
    
    document.querySelector('#sepiaCB').checked = sepia;
    document.querySelector('#sepiaCB').onchange = e => sepia = e.target.checked;
    
    document.querySelector('#invertCB').checked = invert;
    document.querySelector('#invertCB').onchange = e => invert = e.target.checked;
    
    document.querySelector('#noiseCB').checked = noise;
    document.querySelector('#noiseCB').onchange = e => noise=e.target.checked;

    //setting up radio buttons
    document.querySelector("#baseRadio").checked = lowshelf;
    document.querySelector("#baseRadio").onchange = e =>{
        lowshelf = e.target.checked;
        noEffect=false;
        highshelf=false;
        toggleHighShelf(highshelfBiquadFilter,highshelf,audioCtx);
        toggleLowShelf(lowshelfBiquadFilter,lowshelf,audioCtx);
    }

    toggleLowShelf(lowshelfBiquadFilter,lowshelf,audioCtx);

    document.querySelector("#trebleRadio").checked=highshelf;
    document.querySelector("#trebleRadio").onchange = e=>{
        highshelf=e.target.checked;
        noEffect = false;
        lowshelf=false;
        toggleHighShelf(highshelfBiquadFilter,highshelf,audioCtx);
        toggleLowShelf(lowshelfBiquadFilter,lowshelf,audioCtx);
    }

    toggleHighShelf(highshelfBiquadFilter,highshelf,audioCtx);
    
    document.querySelector("#noEffectRadio").checked = noEffect;
    document.querySelector("#noEffectRadio").onchange = e=>{
        lowshelf=false;
        highshelf=false;
        toggleHighShelf(highshelfBiquadFilter,highshelf,audioCtx);
        toggleLowShelf(lowshelfBiquadFilter,lowshelf,audioCtx);
        noEffect=!noEffect;
    }
    
}
