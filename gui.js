import { requestFullscreen, toggleHighShelf, toggleLowShelf } from './input.js';
import { manipulatePixels } from './draw.js';
import { audioCtx, highshelfBiquadFilter, lowshelfBiquadFilter, gainNode, audioElement } from './main.js'

export {datGUI, brightnessAmount};

let brightnessAmount = 100;

function datGUI()
{
  //getting canvas and ctx
  let canvas = document.querySelector('canvas');
  let ctx = canvas.getContext('2d');

  //bitmap effects
  let tinted = false;
  let inverted = false;
  let noised = false;
  let sepiad = false;

  //audio variables
  let playing=false;

  let ControlPanel = function () {

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

    this.Volume = 50;
    this.Song = "Peanuts Theme";
    this.FullScreen = e => { requestFullscreen(canvas) };
    this.Tint = false;
    this.Sepia = false;
    this.Noise = false;
    this.Invert = false;
    this.Brightness = 100;
    this.Highshelf = false;
    this.Lowshelf = false;
    this.NoEffect = true;
    this.Distortion = false;
    this.DistortionValue = 0;
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
    let brightnessSlider = f1.add(controls, 'Brightness', 0, 100);

    let f2 = gui.addFolder('Effects');
    let highshelf = f2.add(controls, 'Highshelf').listen();
    let lowshelf = f2.add(controls, 'Lowshelf').listen();
    let noEffect = f2.add(controls, 'NoEffect').listen();

    let f3 = gui.addFolder('Wave Distortion');
    let distortion = f3.add(controls,'Distortion');
    let distortionSlider = f3.add(controls,'DistortionValue',0,100);

    //changes to gui
    volumeSlider.onChange(function (value) {
      gainNode.gain.value = value / 100.0;
    });

    brightnessSlider.onChange(function (value) {
      gainNode.gain.value = value / 100.0;
      brightnessAmount = value;
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
}