export function init(){
    
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
