'use strict'

//canvas variables
let canvas;
let ctx;

//web audio api
let audioElement;
let audioCtx;
let sourceNode;
let analyzerNode;
let destinationNode;
let audioData;

const NUM_SAMPLES = 64;

const SOUND_PATH = Object.freeze({
    sound1: "media/New Adventure Theme.mp3",
    sound2: "media/Peanuts Theme.mp3",
    sound3:  "media/The Picard Song.mp3"
});

init();

update();

function init(){
    
    //getting the canvas element fand 2d context
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');
    
    audioElement = document.querySelector('audio');
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    
    // getting a reference to the <audio> element on the page
    audioElement = document.querySelector("audio");
    audioElement.src = SOUND_PATH.sound3;
    
    // create an a source node that points at the <audio> element
    sourceNode = audioCtx.createMediaElementSource(audioElement);
    
    // create an analyser node
    analyserNode = audioCtx.createAnalyser();
    
    //Fast Fourier Transform
    analyserNode.fftSize = NUM_SAMPLES;
    
    //audio data has numSamples/2 bins
    audioData = new Uint8Array(NUM_SAMPLES/2); 
    
    // creating a gain (volume) node
    gainNode = audioCtx.createGain();
    gainNode.gain.value = 1;
    
    // connecting the nodes - we now have an audio graph
    sourceNode.connect(analyserNode);
    analyserNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
}

function setupUI(){
    
}

function update(){
    requestAnimationFrame(update);
    
    
}

function manipulatePixels(){
    let imageData = ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height);
                
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;
    
    
}


