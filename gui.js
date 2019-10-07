import { requestFullscreen, toggleHighShelf, toggleLowShelf, toggleDistortion } from './input.js';
import { manipulatePixels } from './draw.js';
import { audioCtx, highshelfBiquadFilter, lowshelfBiquadFilter, gainNode, audioElement, distortionFilter } from './main.js'

export {datGUI, brightnessAmount, nightTime};

let brightnessAmount = 100;
let distortionAmount = 0;
let nightTime = false; //night or day mode 
let maxProgressWidth = 500; //this is max width of progress bar
let duration; //duration of the current song
let progressBar; //progress bar

//wrapper function for all dat gui code
function datGUI(){
  //getting canvas and ctx
  let canvas = document.querySelector('canvas');
  let ctx = canvas.getContext('2d');

  //bitmap effects
  let tinted = false;
  let inverted = false;
  let noised = false;
  let sepiad = false;
  let grayScaled=false;

  //audio variables
  let playing=false;
  let distorted = false;

  //sets up control panel object which will be displayed on screen
  let controlPanel = function () {

    this.Play = function () {
      //if audio context is suspended then resume it
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      //if the music wasn't playing then play it
      if (playing === false) {
        playing = true;
        audioElement.play();
      }

      //else pause it
      else {
        playing = false;
        audioElement.pause();
      }
    };

    this.Song = "Peanuts Theme";
    this.Volume = 50;
    this.FullScreen = e => { requestFullscreen(canvas) };
    this.Night = false;
    this.Tint = false;
    this.Sepia = false;
    this.Noise = false;
    this.Invert = false;
    this.GrayScale = false;
    this.Brightness = 100;
    this.Highshelf = false;
    this.Lowshelf = false;
    this.NoEffect = true;
    this.Distortion = false;
    this.DistortionValue = 0;
  };

  //initialization when window loads for control panel
  window.onload = function () {
    let controls = new controlPanel();
    let gui = new dat.GUI({autoPlace: false});
    let guiContainer = document.querySelector("#guiContainer");
    guiContainer.appendChild(gui.domElement);

    let playButton = document.querySelector("#playButton");
    playButton.onclick = e =>{
      controls.Play();
      e.target.src = "images/pauseButton.png";
    };

    progressBar = document.querySelector("#progressBar");

    gui.add(controls, 'FullScreen'); //click
    let trackSelect = gui.add(controls, 'Song', ["New Adventure Theme", "Peanuts Theme",
    "The Picard Song"]); //drop down
    let volumeSlider = gui.add(controls, 'Volume', 0, 100); //slider from -5 to 5

    progressBar.style.animationDuration = audioElement.duration;

    let fModes = gui.addFolder('Modes'); //folder - then just use f1.add(...); and f1.open();
    let night = fModes.add(controls, 'Night');

    let f1 = gui.addFolder('Display'); //folder - then just use f1.add(...); and f1.open();
    let tint = f1.add(controls, 'Tint'); //checkbox
    let sepia = f1.add(controls, 'Sepia'); //checkbox    
    let noise = f1.add(controls, 'Noise'); //checkbox 
    let invert = f1.add(controls, 'Invert'); //checkbox
    let grayScale = f1.add(controls, 'GrayScale'); //checkbox
    let brightnessSlider = f1.add(controls, 'Brightness', 30, 100);

    let f2 = gui.addFolder('Effects');

    //converting the effect checkboxes to radio buttons
    let highshelf = f2.add(controls, 'Highshelf').listen();
    let highshelfInput = [].slice.call(highshelf.domElement.childNodes);
    highshelfInput[0].type='radio';

    let lowshelf = f2.add(controls, 'Lowshelf').listen();
    let lowshelfInput = [].slice.call(lowshelf.domElement.childNodes);
    lowshelfInput[0].type='radio';

    let noEffect = f2.add(controls, 'NoEffect').listen();
    let noEffectInput = [].slice.call(noEffect.domElement.childNodes);
    noEffectInput[0].type='radio';

    let f3 = gui.addFolder('Wave Distortion');
    let distortion = f3.add(controls,'Distortion');
    let distortionSlider = f3.add(controls,'DistortionValue', 0, 100);

    let progressBar2 = document.querySelector("#progressBar2");

    document.querySelector("#progressBar2").onclick = (e)=>{
      let percent = e.offsetX/e.target.offsetWidth;
      audioElement.currentTime = percent*audioElement.duration;
    };

    //changes to gui
    volumeSlider.onChange(function (value) {
      gainNode.gain.value = value / 100.0;
    });

    brightnessSlider.onChange(function (value) {
      brightnessAmount = value;
      if(brightnessAmount<30){
        brightnessAmount = 30;
      }
    });

    distortionSlider.onChange(function (value) {
        distortionAmount = value;
        if(distorted){
          toggleDistortion(distorted, distortionFilter, distortionAmount);
        }
    });

    gainNode.gain.value = controls.Volume / 100;

    trackSelect.onChange(function(value){
      audioElement.src='media/'+value+'.mp3'; 
      playing=true;
      controls.Play(playButton);   
      duration = audioElement.duration;   
    });

    night.onChange(function(value){
      nightTime = !nightTime;
    });

    tint.onChange(function (value) {
      tinted = !tinted;
    });

    invert.onChange(function (value) {
      inverted = !inverted;
    });

    noise.onChange(function (value) {
      noised = !noised;
    });

    sepia.onChange(function (value) {
      sepiad = !sepiad;
    });

    grayScale.onChange(function(value){
      grayScaled=!grayScaled;
    });

    distortion.onChange(function(value){
      distorted = !distorted;
      toggleDistortion(distorted, distortionFilter, distortionAmount);
    });

    highshelf.onChange(function (value) {
      if (controls.Highshelf = true) {
        controls.NoEffect = false;
        controls.Lowshelf = false;
      }
      else {
        highShelfed = false;
      }

      toggleHighShelf(highshelfBiquadFilter, controls.Highshelf, audioCtx);
      toggleLowShelf(lowshelfBiquadFilter, controls.Lowshelf, audioCtx);

    });

    toggleHighShelf(highshelfBiquadFilter, controls.Highshelf, audioCtx);

    lowshelf.onChange(function (value) {
      if (controls.Lowshelf = true) {
        controls.NoEffect = false;
        controls.Highshelf = false;
      }

      toggleLowShelf(lowshelfBiquadFilter, controls.Lowshelf, audioCtx);
      toggleHighShelf(highshelfBiquadFilter, controls.Highshelf, audioCtx);
    });

    toggleLowShelf(lowshelfBiquadFilter, controls.Lowshelf, audioCtx);

    noEffect.onChange(function (value) {
      if (controls.NoEffect = true) {
        controls.Highshelf = false;
        controls.Lowshelf = false;
      }

      toggleLowShelf(lowshelfBiquadFilter, controls.Lowshelf, audioCtx);
      toggleHighShelf(highshelfBiquadFilter, controls.Highshelf, audioCtx);
    });

    update(playButton,progressBar);
  };

  //updates gui logic 
  //e.g. manipulate pixels, play/pause
  let update = function (playButton,progressBar) {
    //passing playbutton so that this value can be switched
    requestAnimationFrame(function(){
      update(playButton,progressBar);
    });

    //changing pixel values
    manipulatePixels(ctx, tinted, inverted, noised, sepiad, grayScaled);

    //if song is playing then play button should say pause
    //else it should say play
    if(playing){
      playButton.src="images/pauseButton.png";
    }

    else{
      playButton.src="images/playButton.png";
    }

    let ratio = audioElement.currentTime/audioElement.duration;

    let currentTime = audioElement.currentTime;
    let duration = audioElement.duration;

    let currentTimeMin = Math.trunc(currentTime/60);
    let currentTimeSec = Math.trunc(currentTime%60);

    let durationMin = Math.trunc(duration/60);
    let durationSec = Math.trunc(duration%60);

    if(isNaN(durationSec)){
      durationSec=0;
    }

    if(isNaN(durationMin)){
      durationMin=0;
    }

    document.querySelector("#durationTime").innerHTML =  currentTimeMin+":"+(currentTimeSec>9?"":"0")+currentTimeSec+"/"+
      durationMin+":"+(durationSec>9?"":"0")+durationSec;

    let curWidth = maxProgressWidth*ratio;
    progressBar.style.width = curWidth+"px";
    let remaining = 500-curWidth;
    //document.querySelector("#progressBar2").style.width = remaining+"px";
  };
}