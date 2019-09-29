import { requestFullscreen, toggleHighShelf, toggleLowShelf } from './input.js';
import { drawClouds, manipulatePixels } from './draw.js';
import { init, audioCtx, highshelfBiquadFilter, lowshelfBiquadFilter, gainNode, audioElement } from './main.js'

//getting canvas and ctx
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

//bitmap effects
let tinted = false;
let inverted = false;
let noised = false;
let sepiad = false;

//sound effects
let highShelfed = false;
let lowShelfed = false;
let noEffect = true;

//audio vars
let playing=false;

let ControlPanel = function () {

  this.Play = function () {
    //if audio context is suspended then resume it
    debugger;
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

  this.Volume = 50;
  this.Song = "Peanuts Theme";
  this.FullScreen = e => { requestFullscreen(canvas) };
  this.Tint = false;
  this.Sepia = false;
  this.Noise = false;
  this.Invert = false;
  this.highshelf = false;
  this.lowshelf = false;
  this.noEffect = true;
  this.Duration = 0;
};

window.onload = function () {
  let controls = new ControlPanel();
  let gui = new dat.GUI();
  let playButton = gui.add(controls, 'Play'); //click

  let volumeSlider = gui.add(controls, 'Volume', 0, 100); //slider from -5 to 5

  gui.add(controls, 'FullScreen'); //click
  let trackSelect = gui.add(controls, 'Song', ["New Adventure Theme", "Peanuts Theme",
   "The Picard Song"]); //drop down

  let f1 = gui.addFolder('Display'); //folder - then just use f1.add(...); and f1.open();
  let tint = f1.add(controls, 'Tint'); //checkbox
  let sepia = f1.add(controls, 'Sepia'); //checkbox    
  let noise = f1.add(controls, 'Noise'); //checkbox 
  let invert = f1.add(controls, 'Invert'); //checkbox

  let f2 = gui.addFolder('Effects');
  let highshelf = f2.add(controls, 'highshelf').listen();
  let lowshelf = f2.add(controls, 'lowshelf').listen();
  let noEffect = f2.add(controls, 'noEffect').listen();

  //changes to gui
  volumeSlider.onChange(function (value) {
    gainNode.gain.value = value / 100.0;
  });

  gainNode.gain.value = controls.Volume / 100;

  trackSelect.onChange(function(value){
    audioElement.src='media/'+value+'.mp3'; 
    playing=true;
    controls.Play(playButton);      
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

  highshelf.onChange(function (value) {
    if (controls.highshelf = true) {
      controls.noEffect = false;
      controls.lowshelf = false;
      highShelfed = true;
    }
    else {
      highShelfed = false;
    }

    toggleHighShelf(highshelfBiquadFilter, controls.highshelf, audioCtx);
    toggleLowShelf(lowshelfBiquadFilter, controls.lowshelf, audioCtx);

  });

  toggleHighShelf(highshelfBiquadFilter, controls.highshelf, audioCtx);

  lowshelf.onChange(function (value) {
    if (controls.lowshelf = true) {
      controls.noEffect = false;
      controls.highshelf = false;
    }

    toggleLowShelf(lowshelfBiquadFilter, controls.lowshelf, audioCtx);
    toggleHighShelf(highshelfBiquadFilter, controls.highshelf, audioCtx);


  });

  toggleLowShelf(lowshelfBiquadFilter, controls.lowshelf, audioCtx);

  noEffect.onChange(function (value) {
    if (controls.noEffect = true) {
      controls.highshelf = false;
      controls.lowshelf = false;
    }

    toggleLowShelf(lowshelfBiquadFilter, controls.lowshelf, audioCtx);
    toggleHighShelf(highshelfBiquadFilter, controls.highshelf, audioCtx);
  });

  /*controller.onFinishChange(function(value) {
    // Fires when a controller loses focus.
    alert("The new value is " + value);
  });*/

  //updating automatically (i.e. for progress bar for music)
  gui.add(controls, 'Duration', 0, 100).listen();

  let update = function () {
    requestAnimationFrame(update);
    manipulatePixels(ctx, tinted, inverted, noised, sepiad);
  };

  update();
};
