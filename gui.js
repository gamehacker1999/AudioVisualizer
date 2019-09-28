var FizzyText = function() {
  this.message = 'dat.gui';
  this.speed = 0.8;
  this.displayOutline = false;
  this.explode = function() { ... };
  // Define render logic ...
};

window.onload = function() {
    var text = new FizzyText();
    var gui = new dat.GUI();
    gui.add(text, 'message'); //text box
    gui.add(text, 'speed', -5, 5); //slider from -5 to 5
    gui.add(text, 'displayOutline'); //checkbox
    gui.add(text, 'Play');  //click
    gui.add(text, 'Full Screen'); //click
    gui.add(text, 'message', [ 'New Adventure Theme', 'Peanuts Theme', 'The Picard Song' ] ); //drop down
    var f1 = gui.addFolder('Flow Field'); //folder - then just use f1.add(...); and f1.open();
    
    //changes to gui
    controller.onFinishChange(function(value) {
      // Fires when a controller loses focus.
      alert("The new value is " + value);
    });  
    
    //updating automatically (i.e. for progress bar for music)
    var fizzyText = new FizzyText();
    var gui = new dat.GUI();

    gui.add(fizzyText, 'noiseStrength', 0, 100).listen();

    var update = function() {
      requestAnimationFrame(update);
      fizzyText.noiseStrength = Math.random();
    };

    update();
};
