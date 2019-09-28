'use strict'

//import * as dat from 'dat.gui';
//const gui = new dat.GUI();

//canvas variables
let canvas;
let ctx;
let canvasCenterX;
let canvasCenterY;

//web audio api
let audioElement;
let audioCtx;
let sourceNode;
let analyzerNode;
let gainNode;
let destinationNode;
let audioData;
let waveform;

//distortion filters
let lowshelfBiquadFilter;
let highshelfBiquadFilter;
let reverberateFilter;

//distortion booleans
let highshelf;
let lowshelf;
let noEffect;

let playing = false;

let sunCenterX;
let sunCenterY;

let cloudPos1;
let cloudPos2;
let cloudPos3;
let cloudPos4;

let tintRed = false;
let noise = false;
let invert = false;
let sepia = false;

let frameCounter;

let image1;
let image2;

function update(){
    requestAnimationFrame(update);
    
    frameCounter++;
    
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
    let grad = ctx.createLinearGradient(0,0,0,ctx.canvas.height);
    grad.addColorStop(0,'#fb7ba2');
    grad.addColorStop(1, '#fce043');
    ctx.fillStyle = grad;    
    
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    analyzerNode.getByteFrequencyData(audioData);
    
    analyzerNode.getByteTimeDomainData(waveform);
    
    //sunCenterX+=0.5;
    //sunCenterY+=0.5;
    
    if(sunCenterY>canvas.height+80){
        sunCenterX=-50;
        sunCenterY=-50;
    }
    
    //saving the current canvas state
    ctx.save();
    grad.addColorStop(0,'#fc354c');
    grad.addColorStop(1, '#0fbabc');
    
    ctx.fillStyle = 'yellow';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    
    //drawing the circle
    ctx.beginPath();
    ctx.arc(sunCenterX,sunCenterY,100,0,Math.PI*2);
    ctx.closePath();
    //ctx.stroke();
    ctx.fill();
    
    let rects = 50;
    let angle = Math.PI*2/rects;
    
    let max = 0;
    for(let i=0;i<50;i++){
        
        ctx.save();
        ctx.translate(sunCenterX,sunCenterY);
        ctx.rotate(angle*i+15);
        let width = audioData[i]*0.5;
        
        if(waveform[i]>max) max = waveform[i]*0.5;
        
        let x = (canvasCenterX)+(Math.cos(angle*i))*100;
        let y = (canvasCenterY)+(Math.sin(angle*i))*100;
        
        
        ctx.fillRect(100,0,width,5);
        
        ctx.restore();
        
    }
    
    ctx.globalAlpha=1.0;
    ctx.fillStyle = '#fdd8b5';
    ctx.fillRect(0,canvas.height/1.3,canvas.width,canvas.height);
    
    ctx.globalAlpha = 1.0;
    
        for(let i=0;i<80;i++){
        
        ctx.save();

        let height = audioData[i]*0.3;
        
        let x = (canvasCenterX)+(Math.cos(angle*i))*100;
        let y = (canvasCenterY)+(Math.sin(angle*i))*100;
        
        ctx.fillStyle='blue';
        ctx.strokeStyle = 'blue';
        ctx.fillRect(i*12.5,canvas.height*2/3,13,height+60.5);
        
        ctx.restore();
        
    }
      

    //updating cloud positions and wrapping them around
    cloudPos1+=1/4;
    if((cloudPos1*0.6)>canvas.width+20)
        cloudPos1=-245;

    cloudPos2+=1/4;
    if((cloudPos2*0.6)>canvas.width+20)
        cloudPos2=-245;

    cloudPos3+=1/4;
    if((cloudPos3*0.6)>canvas.width+20)
        cloudPos3=-245;

    cloudPos4+=1/4;
    if((cloudPos4*0.6)>canvas.width+20)
        cloudPos4=-245;
    
    //drawing clouds
    drawClouds(cloudPos1,100,max);
    drawClouds(cloudPos2,250,max);
    drawClouds(cloudPos3,100,max);
    drawClouds(cloudPos4,250,max);

    //adding images
    ctx.drawImage(image1,300,380);

    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY=8;
    ctx.shadowColor = '#8a795d';
    ctx.drawImage(image2,600,530);

    //adding photoshipish effects
    manipulatePixels();

    ctx.restore();
}
