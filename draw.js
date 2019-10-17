export {drawClouds, manipulatePixels};

//draws the clouds at the top of canvas using bezier curves
//reference: https://www.html5canvastutorials.com/advanced/html5-canvas-save-drawing-as-an-image/ 
function drawClouds(x,y,max=0, ctx){
    ctx.save();

    //setting shadows
    ctx.shadowOffsetX = max/7;
    ctx.shadowOffsetY=max/11;
    ctx.shadowColor = 'silver';

    //style for shadow
    ctx.scale(0.6,0.6);
    ctx.strokeStyle = 'white';
    ctx.fillStyle='white';

    //draw cloud
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.bezierCurveTo(x-40,y+20,x-40,y+70,x+60,y+70);
    ctx.bezierCurveTo(x+80,y+100,x+150,y+100,x+170,y+70);
    ctx.bezierCurveTo(x+250,y+70,x+250,y+40,x+220,y+20);
    ctx.bezierCurveTo(x+260,y-40,x+200,y-50,x+170,y-30);
    ctx.bezierCurveTo(x+150,y-75,x+80,y-60,x+80,y-30);
    ctx.bezierCurveTo(x+30,y-75,x-20,y-60,x,y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.restore();
}

//changes the look of the canvas using bitmap manipulation
//e.g. invert, noise, brightness, etc.
function manipulatePixels(ctx, tintRed, invert, noise, sepia,greyScale,brightnessAmount){
    
    let imageData = ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;
    
    for(let i = 0;i<length;i+=4){
        
        //tint red if checked
        if(tintRed)
            data[i]+=100;
        
        //invert if checked
        if(invert){
            data[i]=255-data[i];
            data[i+1]=255-data[i+1];
            data[i+2]=255-data[i+2];    
        }
        
        //create noise
        if(noise&&Math.random()<0.1){
            data[i]=data[i+1]=data[i+2]=128;
        }
        
        //sepia
        if(sepia){
            let inputRed = data[i];
            let inputGreen = data[i+1];
            let inputBlue = data[i+2];
            
            data[i]=(inputRed * .393) + (inputGreen *.769) + (inputBlue * .189)
            data[i+1]=(inputRed * .349) + (inputGreen *.686) + (inputBlue * .168)
            data[i+2]=(inputRed * .272) + (inputGreen *.534) + (inputBlue * .131)
            
            //clamping the values to 0 to 255
            if(data[i]>255)
                data[i]=255;
            if(data[i+1]>255)
                data[i+1]=255;    
            if(data[i+2]>255)
                data[i+2]=255;
        }

        //grayscale
        if(greyScale){
            let v = (data[i]+data[i+1]+data[i+2])/3;
            data[i]=data[i+1]=data[i+2] = v;
        }

        //brightness
        data[i] = data[i] * (brightnessAmount/100);
        data[i+1] = data[i+1] * (brightnessAmount/100);
        data[i+2] = data[i+2] * (brightnessAmount/100);
    }
    ctx.putImageData(imageData,0,0);
}