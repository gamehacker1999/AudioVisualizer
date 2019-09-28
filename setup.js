export function setupUI(){
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
        toggleHighShelf();
        toggleLowShelf();
    }

    toggleLowShelf();

    document.querySelector("#trebleRadio").checked=highshelf;
    document.querySelector("#trebleRadio").onchange = e=>{
        highshelf=e.target.checked;
        noEffect = false;
        lowshelf=false;
        toggleLowShelf();
        toggleHighShelf();
    }

    toggleHighShelf(); 
    
    document.querySelector("#noEffectRadio").checked = noEffect;
    document.querySelector("#noEffectRadio").onchange = e=>{
        lowshelf=false;
        highshelf=false;
        toggleLowShelf();
        toggleHighShelf();
        noEffect=!noEffect;
    }
    
}