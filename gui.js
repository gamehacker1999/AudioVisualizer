import {requestFullscreen,toggleHighShelf,toggleLowShelf} from './input.js';
import {drawClouds, manipulatePixels} from './draw.js';
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

let tinted = false;
let inverted = false;
let noised = false;
let sepiad = false;

let ControlPanel = function() {
  this.Play = function(){  };
  this.Volume = 50;
  this.Song = "Peanuts Theme";
  this.FullScreen = e=>{requestFullscreen(canvas)};
  this.Tint = false;
  this.Sepia = false;
  this.Noise = false;
  this.Invert = false;
  this.Duration = 0;
};

window.onload = function() {
    let controls = new ControlPanel();    
    let gui = new dat.GUI();
    gui.add(controls, 'Play'); //click

    let volumeSlider = gui.add(controls, 'Volume', 0, 100); //slider from -5 to 5

    gui.add(controls, 'FullScreen'); //click
    gui.add(controls, 'Song', [ 'New Adventure Theme', 'Peanuts Theme', 'The Picard Song' ] ); //drop down

    let f1 = gui.addFolder('Display'); //folder - then just use f1.add(...); and f1.open();
    let tint = f1.add(controls, 'Tint'); //checkbox
    let sepia = f1.add(controls, 'Sepia'); //checkbox    
    let noise = f1.add(controls, 'Noise'); //checkbox 
    let invert = f1.add(controls, 'Invert'); //checkbox

    //changes to gui
    volumeSlider.onChange(function(value) {
      // Fires on every change, drag, keypress, etc.
      //adjust volume
    });

    tint.onChange(function(value){
      tinted = !tinted;
    });

    invert.onChange(function(value){
      inverted = !inverted;
    });

    noise.onChange(function(value){
      noised = !noised;
    });

    sepia.onChange(function(value){
      sepiad = !sepiad;
    });
    
    /*controller.onFinishChange(function(value) {
      // Fires when a controller loses focus.
      alert("The new value is " + value);
    });*/
    
    //updating automatically (i.e. for progress bar for music)
    gui.add(controls, 'Duration', 0, 100).listen();

    let update = function() {
      requestAnimationFrame(update);
      manipulatePixels(ctx, tinted, inverted, noised, sepiad);
    };

    update();
};
