var canvas = document.getElementById("sine");
var ctx = canvas.getContext("2d");
var theta = 0.4;
var animateFlag = false;
redraw();

function redraw() {
    canvas.width = canvas.width;
    setupCanvas();
    plot(theta);
}

function setupCanvas() {
    // Draw all the pieces that don't change

    // top line
    ctx.beginPath();
    ctx.moveTo(0, 15.5);
    ctx.lineTo(600, 15.5);
    ctx.strokeStyle = "#ccc";
    ctx.stroke();

    // mid line
    ctx.beginPath();
    ctx.moveTo(0, 100);
    ctx.lineTo(600, 100);
    ctx.stroke();

    // bottom line
    ctx.beginPath();
    ctx.moveTo(0, 184.5);
    ctx.lineTo(600, 184.5);
    ctx.stroke();

    // circle
    ctx.beginPath();
    ctx.arc(105, 100, 84.5, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.stroke();

    // line separating the two halves
    ctx.beginPath();
    ctx.moveTo(250, 15.5);
    ctx.lineTo(250, 184.5);
    ctx.lineWidth = "2px";
    ctx.strokeStyle = "black";
    ctx.stroke();

    // top label
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText("1.0", 250, 13);
    
    // middle label
    ctx.fillText("0.0", 237, 113);

    // bottom label
    ctx.fillText("-1.0", 250, 200);

    // middle dot
    ctx.beginPath();
    ctx.arc(105, 100, 3, 0, 2*Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = "#888";
    ctx.fill();
}

function plot(theta) {
    // Plot the animated elements

    // Number of points to plot
    var n = Math.round(100 * theta / Math.PI + 1)

    // plot the radius
    ctx.beginPath();
    ctx.moveTo(105, 100);
    var x = 105+84.5*Math.cos(theta);
    var y = 100-84.5*Math.sin(theta);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#ccc";
    ctx.stroke();


    // plot the vertical line
    ctx.beginPath();
    ctx.moveTo(x, 100);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "red";
    ctx.stroke();

    // plot the arc
    ctx.beginPath();
    ctx.moveTo(125, 100);
    ctx.arc(105, 100, 20, 0, -theta, true);
    ctx.strokeStyle = "#ccc";
    ctx.stroke();

    // plot the connecting line
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(250 + (350*theta) / (2*Math.PI),
	       100-84.5*Math.sin(theta));
    ctx.strokeStyle = "#eee";
    ctx.stroke();

    // plot the endpoint
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fillStyle = "red";
    ctx.fill();



    // plot the sine curve to date
    var phi;
    x = 250;
    y = 100;
    var newX, newY;
    ctx.strokeStyle = "red";
    for (var j = 1; j <= n; j++) {
	phi = j * theta/n;
	newX = 250 + (350 * phi) / (2*Math.PI);
	newY = 100 - 84.5*Math.sin(phi);
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(newX, newY);
	ctx.stroke();
	x = newX;
	y = newY;
    }
    
    // plot the endpoint on the sine curve
    ctx.beginPath();
    ctx.arc(250+(350*theta)/(2*Math.PI),
	    100-84.5*Math.sin(theta), 
	    5, 0, 2*Math.PI, true);
    ctx.fillStyle = "red";
    ctx.fill();
}


function startSineAnimation() {
    // Handler for the start button
    $("#startSineAnimation").hide();
    $("#stopSineAnimation").show();
    animateFlag = true;
    window.requestAnimationFrame(animate);
};

function stopSineAnimation() {
    // Handler for the stop button
    $("#startSineAnimation").show();
    $("#stopSineAnimation").hide();
    animateFlag = false;
}

function animate() {
    if (animateFlag) {
	if (theta < 2*Math.PI) {
	    theta += 0.01;
	} else {
	    theta = 0.01;
	}
	redraw();
	window.requestAnimationFrame(animate);
    }
}



var changingPolar = false, changingLinear = false;

$("#sine").mousedown(function(e) {
    if (sineMousePosition(e).x < 250) {
	changingPolar = true;
	updatePolar(e);
    } else {
	changingLinear = true;
	updateLinear(e);
    }
});

$("html").mousemove(function(e) {
    if (changingPolar) {
	updatePolar(e);
    }
    if (changingLinear) {
	updateLinear(e);
    }
});

$("html").mouseup(function() {
    changingPolar = false;
    changingLinear = false;
});

function updatePolar(e) {
    var newTheta;
    var position = sineMousePosition(e);
    var deltaX = position.x - 105;
    var deltaY = -(position.y - 100);
    if (deltaX == 0 && deltaY == 0) {
	newTheta = 0
    } else if (deltaX == 0 && deltaY > 0) {
	newTheta = Math.PI/2
    } else if (deltaX == 0 && deltaY < 0) {
	newTheta = Math.PI/2
    } else if (deltaY == 0 && deltaX > 0) {
	newTheta = 0
    } else if (deltaY == 0 && deltaX < 0) {
	newTheta = Math.PI
    } else if (deltaX > 0 && deltaY > 0) {
	newTheta = Math.atan(deltaY / deltaX);
    } else if (deltaX > 0 && deltaY < 0) {
	newTheta = Math.atan(deltaY / deltaX) + 2*Math.PI;
    } else { // we're on the left of the origin, and the following formula works
	newTheta = Math.atan(deltaY / deltaX) + Math.PI;
    }
    theta = newTheta;
    redraw();
}

function updateLinear(e) {
    theta = ((sineMousePosition(e).x-250)*2*Math.PI/350).limit(0, 2*Math.Pi);
    redraw();
}

Number.prototype.limit = function(a, b) {
    // Assumes a < b.  Returns the number if it's within the range a
    // to b, otherwise returns the smaller or larger endpoint, as
    // appropriate.  Idea from Mootools.
    if (this.valueOf() < a) {return a}
    if (this.valueOf() > b) {return b}
    return this.valueOf();
}

function sineMousePosition(e) {
    // Return the position within the #sine canvas.
    return {
	"x": e.pageX - $("#sine").offset().left,
	"y": e.pageY - $("#sine").offset().top
	}
}
    
