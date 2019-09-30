export {requestFullscreen,toggleHighShelf,toggleLowShelf, toggleDistortion};

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

function toggleHighShelf(highshelfBiquadFilter,highshelf,audioCtx){
    if(highshelf){
        highshelfBiquadFilter.frequency.setValueAtTime(1000,audioCtx.currentTime);
        highshelfBiquadFilter.gain.setValueAtTime(15,audioCtx.currentTime);
    }
    else{
        highshelfBiquadFilter.frequency.setValueAtTime(0,audioCtx.currentTime);
        highshelfBiquadFilter.gain.setValueAtTime(0,audioCtx.currentTime);
    }
}

function toggleLowShelf(lowshelfBiquadFilter,lowshelf,audioCtx){
    if(lowshelf){
        lowshelfBiquadFilter.frequency.setValueAtTime(1000,audioCtx.currentTime);
        lowshelfBiquadFilter.gain.setValueAtTime(15,audioCtx.currentTime);
    }
    else{
        lowshelfBiquadFilter.frequency.setValueAtTime(0,audioCtx.currentTime);
        lowshelfBiquadFilter.gain.setValueAtTime(0,audioCtx.currentTime);
    }
}

function toggleDistortion(distortion, distortionFilter, distortionAmount){
    if(distortion){
      distortionFilter.curve = null; // being paranoid and trying to trigger garbage collection
      distortionFilter.curve = makeDistortionCurve(distortionAmount);
    }else{
      distortionFilter.curve = null;
    }
  }
  
  // from: https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode
function makeDistortionCurve(amount=20) {
    let n_samples = 256, curve = new Float32Array(n_samples);
    for (let i =0 ; i < n_samples; ++i ) {
        let x = i * 2 / n_samples - 1;
        curve[i] = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x));
    }
    return curve;
    }