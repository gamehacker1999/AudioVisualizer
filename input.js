function toggleHighShelf(){
    if(highshelf){
        highshelfBiquadFilter.frequency.setValueAtTime(1000,audioCtx.currentTime);
        highshelfBiquadFilter.gain.setValueAtTime(15,audioCtx.currentTime);
    }
    else{
        highshelfBiquadFilter.frequency.setValueAtTime(0,audioCtx.currentTime);
        highshelfBiquadFilter.gain.setValueAtTime(0,audioCtx.currentTime);
    }
}

function toggleLowShelf(){
    if(lowshelf){
        lowshelfBiquadFilter.frequency.setValueAtTime(1000,audioCtx.currentTime);
        lowshelfBiquadFilter.gain.setValueAtTime(15,audioCtx.currentTime);
    }
    else{
        lowshelfBiquadFilter.frequency.setValueAtTime(0,audioCtx.currentTime);
        lowshelfBiquadFilter.gain.setValueAtTime(0,audioCtx.currentTime);
    }
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