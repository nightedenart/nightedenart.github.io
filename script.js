var dpr = 1,
    canvas = document.getElementById('canvas'),
    atlasCircleCanvas = document.createElement('canvas'),
    atlasCircleContext = atlasCircleCanvas.getContext('2d'),
    ctx = canvas.getContext('2d'),
    actualCanvasWidth = canvas.width,
    actualCanvasHeight = canvas.height,
    globalScale = 0,
    circleGroups = [
        {
            xPos: 120,
            yPos: 60,
            radius: 200,
            color: "#19a7e3",
            opacity: .6,
            blend: true,
            rotate: 5
        },
        {
            xPos: 180,
            yPos: -100,
            radius: 240,
            color: "#19a7e3",
            opacity: .2,
            rotate: 5
        },
        {
            xPos: 100,
            yPos: 120,
            radius: 240,
            color: "#000",
            mask: true,
            blend: true,
            opacity: .25,
            rotate: -120
        },
        {
            xPos: 70,
            yPos: -30,
            radius: 180,
            color: "#4f9c99",
            opacity: 1,
            rotate: 120
        },
        {
            xPos: -30,
            yPos: 50,
            radius: 220,
            color: "#000",
            mask: true,
            blend: true,
            opacity: .75,
            rotate: 180
        },
        {
            xPos: 160,
            yPos: -200,
            radius: 220,
            color: "#000",
            mask: true,
            blend: true,
            opacity: 1,
            rotate: 0
        },
        {
            xPos: 100,
            yPos: 120,
            radius: 240,
            color: "#22a6b3",
            outlines: true,
            blend: true,
            opacity: 1,
            rotate: -120
        },


        {
            xPos: -280,
            yPos: -20,
            radius: 120,
            color: "#19a7e3",
            opacity: 1,
            rotate: 75
        },
        {
            xPos: -360,
            yPos: -40,
            radius: 120,
            color: "#19a7e3",
            opacity: 1,
            rotate: 80
        },
        {
            xPos: -380,
            yPos: -10,
            radius: 120,
            color: "#000",
            mask: true,
            rotate: -30,
            blend: true,
            opacity: 1
        },
        {
            xPos: -380,
            yPos: -10,
            radius: 120,
            color: "#000",
            mask: true,
            rotate: -30,
            blend: true,
            opacity: 1
        },
        {
            xPos: -400,
            yPos: -80,
            radius: 80,
            color: "#000",
            mask: true,
            rotate: 200,
            blend: true,
            opacity: 1
        },
        {
            xPos: -400,
            yPos: -80,
            radius: 80,
            color: "#000",
            mask: true,
            rotate: 200,
            blend: true,
            opacity: 1
        },
        {
            xPos: -360,
            yPos: -50,
            radius: 100,
            color: "#4f9c99",
            opacity: .7,
            rotate: 200
        },
        {
            xPos: -220,
            yPos: -80,
            radius: 160,
            color: "#000",
            mask: true,
            rotate: 60,
            blend: true,
            opacity: 1
        },
        {
            xPos: -220,
            yPos: -80,
            radius: 160,
            color: "#000",
            mask: true,
            rotate: 60,
            blend: true,
            opacity: 1
        },
        {
            xPos: -380,
            yPos: -10,
            radius: 120,
            color: "#22a6b3",
            outlines: true,
            rotate: -30,
            opacity: .4
        }
    ],
    /*
    circleGroups = [
        {
            xPos: 0,
            yPos: 0,
            radius: 200,
            color: "#19a7e3",
            opacity: 1,
            rotate: 5
        },
        {
            xPos: 100,
            yPos: -50,
            radius: 180,
            color: "#4f9c99",
            opacity: 1,
            rotate: 5
        },
        {
            xPos: 60,
            yPos: 70,
            radius: 150,
            color: "#000",
            blend: true,
            opacity: 1
        }
    ],
    */
    circleCount = 6,
    atlasOffsets = [],
    scalars = [],
    frames = 0,
    speed = 1,
    hum = 0,
    humIsAlternating = false,
    lightMode = false,
    animating = false,
    blending = true;

document.getElementById("js-blend-checkbox").addEventListener("change", function(){
	blending = !blending;
});

document.getElementById("js-light-checkbox").addEventListener("change", function(){
	lightMode = !lightMode;

	var maskColor = "#000";

	if (lightMode) {
		document.body.classList.add('js-light-mode');
		maskColor = "#fff";
	} else {
		document.body.classList.remove('js-light-mode');
	}

	for (var i = 0; i < circleGroups.length; i++) {
		if (circleGroups[i].mask && circleGroups[i].mask == true) {
			circleGroups[i].color = maskColor;
		}
	}

});

function hex2rgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

Math.easeOutExpo = function (t) { return 1*(-Math.pow(2, -10*t)+1 ) }

Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

if (canvas) {

    var ctx = canvas.getContext('2d');

    function setupCanvas() {
        var rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
    }

    function setupatlasCircleCanvas() {

        var totalWidth = 0,
            biggestHeight = 0;

        for (var i = 0; i < circleGroups.length; i++) {

            var diameter = circleGroups[i].radius * 2;

            if (i > 0)
                atlasOffsets.push(totalWidth);
            else
                atlasOffsets.push(0);

            totalWidth += diameter;

            if (diameter > biggestHeight)
                biggestHeight = diameter;
        }

        var rect = atlasCircleCanvas.getBoundingClientRect();
        atlasCircleCanvas.width = totalWidth * dpr;
        atlasCircleCanvas.height = biggestHeight * dpr;
    }

    function setupCircles() {
        for (var i = 0; i < circleGroups.length; i++) {
            for (var j = 0; j < circleCount; j++) {
                var value = -(j/circleCount);
                scalars.push(value);
            }
        }
    }

    function draw() {
        frames++;
        ctx.clearRect(0, 0, actualCanvasWidth, actualCanvasHeight);
        atlasCircleContext.clearRect(0, 0, atlasCircleCanvas.width, atlasCircleCanvas.height);

        ctx.save();

        if (speed > .1)
            speed = 1 - (.9 * ((frames * 1.25)/60));

        if (hum > 1 || hum < 0) {
            humIsAlternating = !humIsAlternating;
        }

        if (!humIsAlternating) {
            hum += 1/120;
        } else {
            hum -= 1/120;
        }

        var circleTotalCount = circleGroups.length * circleCount;

        for (var i = 0; i < circleTotalCount; i++) {

            var scale = scalars[i],
                parentIndex = Math.floor(i / circleCount);

            if (scale > 1) {
                scale = 0;
                scalars[i] = 0;
            }

            scale += (1/30 * speed);
            scalars[i] = scale;


            if (scale >= 0) {

                var radius = circleGroups[parentIndex].radius,
                    atlasOffset = atlasOffsets[parentIndex],
                    groupOpacity = 1,
                    colour = circleGroups[parentIndex].color,
                    parsedColour = hex2rgb(colour).r + ", " + hex2rgb(colour).g + ", " + hex2rgb(colour).b;

                if (circleGroups[parentIndex].opacity)
                    groupOpacity = circleGroups[parentIndex].opacity + 0.2;

                atlasCircleContext.beginPath();
                atlasCircleContext.arc((radius + atlasOffset), ((radius) + (radius * (1-scale))), (radius * scale), 0, 2 * Math.PI, false);

                if (!circleGroups[parentIndex].outlines) {
                    atlasCircleContext.fillStyle = "rgba(" + parsedColour + ", " + ((1-scale) * groupOpacity) + ")";
                } else {
                    atlasCircleContext.fillStyle = "rgba(0,0,0,0)";
                    atlasCircleContext.strokeStyle = "rgba(" + parsedColour + ", " + ((1-scale) * groupOpacity) + ")";
                    atlasCircleContext.stroke();
                }

                atlasCircleContext.fill();
            }
        }

        for (var i = 0; i < circleGroups.length; i++) {

	        ctx.save();

            var radius = circleGroups[i].radius,
                diameter = radius * 2,
                atlasOffset = atlasOffsets[i],
                xPos = actualCanvasWidth/2 - (diameter/2) + circleGroups[i].xPos,
                yPos = actualCanvasHeight/2 - (diameter/2) + circleGroups[i].yPos,
                colour = circleGroups[i].color,
                rotation = 0;

            if (blending) {
	            if (!circleGroups[i].blend) {
		            if (lightMode) {
                        ctx.globalCompositeOperation = "multiply";
                    } else {
                        ctx.globalCompositeOperation = "lighter";
                    }
	            }
            }

            if (circleGroups[i].rotate) {
                rotation = Math.radians(circleGroups[i].rotate);
                ctx.translate(canvas.width/2, canvas.height/2);
                ctx.translate(circleGroups[i].xPos, circleGroups[i].yPos);
                ctx.rotate(rotation);
                ctx.drawImage(atlasCircleCanvas, atlasOffset, 0, diameter, diameter, -radius , -radius , diameter, diameter);
            } else {
                ctx.drawImage(atlasCircleCanvas, atlasOffset, 0, diameter, diameter, xPos, yPos, diameter, diameter);
            }

            ctx.restore();

        }

        ctx.restore();
        
        if (globalScale <= 1) {
            globalScale += 1/120;

            var parsedScale = 0.5 + (0.5 * Math.easeOutExpo(globalScale));
            
            canvas.style.transform = "scale(" + parsedScale + ")";

            //canvas.style.width = Math.ceil(1280 * parsedScale) + "px";
            //canvas.style.height = Math.ceil(720 * parsedScale) + "px";
        }

        requestAnimationFrame(draw);
    }

    function setup() {
        setupCanvas();
        setupatlasCircleCanvas();
        setupCircles();

        requestAnimationFrame(draw);
    }


    setup();

}
