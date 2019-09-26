'use strict'

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

//distortion filters
let lowshelfBiquadFilter;
let highshelfBiquadFileter;
let reverberateFilter;

let playing = false;

const NUM_SAMPLES = 128;

const SOUND_PATH = Object.freeze({
    sound1: "media/New Adventure Theme.mp3",
    sound2: "media/Peanuts Theme.mp3",
    sound3:  "media/The Picard Song.mp3"
});

let tintRed = false;
let noise = false;
let invert = false;
let sepia = false;

window.onload = init;

function init(){
    
    //getting the canvas element and 2d context
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');
    
    //getting the center point of the canvas
    canvasCenterX = canvas.width/2;
    canvasCenterY = canvas.height/2;
    
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,600,480);
    
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
    
    // creating a gain (volume) node
    gainNode = audioCtx.createGain();
    gainNode.gain.value = 1;
    
    // connecting the nodes - we now have an audio graph
    sourceNode.connect(analyzerNode);
    analyzerNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    //setting up the UI
    setupUI();
    
    //updating
    update();
    
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
    
    
}

function update(){
    requestAnimationFrame(update);
    
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
    let grad = ctx.createLinearGradient(0,0,0,ctx.canvas.height);
    grad.addColorStop(0,'#d3959b');
    grad.addColorStop(1, '#bfe6ba');
    ctx.fillStyle = grad;
    
    ctx.fillRect(0,0,600,480);
    
    analyzerNode.getByteFrequencyData(audioData);
    
    //saving the current canvas state
    ctx.save();
    grad.addColorStop(0,'#fc354c');
    grad.addColorStop(1, '#0fbabc');
    
    ctx.fillStyle = grad;
    ctx.strokeStyle = grad;
    ctx.lineWidth = 5;
    
    //drawing the circle
    ctx.beginPath();
    ctx.arc(canvasCenterX,canvasCenterY,100,0,Math.PI*2);
    ctx.closePath();
    ctx.stroke();
    
    let rects = 50;
    let angle = Math.PI*2/rects;
    
    for(let i=0;i<50;i++){
        
        ctx.save();
        ctx.translate(canvasCenterX,canvasCenterY);
        ctx.rotate(angle*i);
        let width = audioData[i]*0.5;
        
        let x = (canvasCenterX)+(Math.cos(angle*i))*100;
        let y = (canvasCenterY)+(Math.sin(angle*i))*100;
        
        
        ctx.fillRect(100,0,width,5);
        
        ctx.restore();
        
    }
    
    ctx.restore();
    
    manipulatePixels();
    
}

function manipulatePixels(){
    let imageData = ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height);
    
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;
    
    for(let i = 0;i<length;i+=4){
        
        if(tintRed)
            data[i]+=100;
        
        if(invert){
            data[i]=255-data[i];
            data[i+1]=255-data[i+1];
            data[i+2]=255-data[i+2];
            
        }
        
        if(noise&&Math.random()<0.1){
            data[i]=data[i+1]=data[i+2]=128;
            
            //data[i+3]=255; //alpha
        }
        
        if(sepia){
            let inputRed = data[i];
            let inputGreen = data[i+1];
            let inputBlue = data[i+2];
            
            
            data[i]=(inputRed * .393) + (inputGreen *.769) + (inputBlue * .189)
            data[i+1]=(inputRed * .349) + (inputGreen *.686) + (inputBlue * .168)
            data[i+2]=(inputRed * .272) + (inputGreen *.534) + (inputBlue * .131)
            
            //clamping the values to 0 to 255
            if(data[i]>255)
                data[i]=255;
            if(data[i+1]>255)
                data[i+1]=255;    
            if(data[i+2]>255)
                data[i+2]=255;
            
        }
        
    }
    
    ctx.putImageData(imageData,0,0);

}

function requestFullscreen(element) {
    
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } 
    else if (element.mozRequestFullscreen) {
        element.mozRequestFullscreen();
    } 
    else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
        element.mozRequestFullScreen();
    } 
    else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
    // .. and do nothing if the method is not supported
}


