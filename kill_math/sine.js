// Visualizing the relationship between a point on a circle and the
// sine function.

// Setup the globals
var canvas = document.getElementById("sine");
var ctx = canvas.getContext("2d");
var theta = 0.4;
var animateFlag = false; // Is the animation running?
var changingPolar = false; // Are we mousemoving, having mousedowned on the LHS
var changingLinear = false; // Ditto, but on the RHS

// Add line method to canvas context objects
CanvasRenderingContext2D.prototype.line = function(
    x1, y1, x2, y2, color, lineWidth) {
    this.beginPath();
    this.moveTo(x1, y1);
    this.lineTo(x2, y2);
    if (typeof color !== 'undefined') {
	this.strokeStyle = color;
    }
    if (typeof lineWidth !== 'undefined') {
	this.lineWidth = lineWidth;
    }
    this.stroke();
}

redraw();

function redraw() { // clears the canvas and redraws it
    canvas.width = canvas.width;
    drawStaticElements();
    drawAnimatedElements();
}

function drawStaticElements() {
    // top, middle and bottom horizontal lines
    ctx.line(0, 15.5, 600, 15.5, "#ccc");
    ctx.line(0, 100, 600, 100);
    ctx.line(0, 184.5, 600, 184.5);

    // line separating LHS and RHS
    ctx.line(250, 15.5, 250, 184.5, "black", "2px");

    // circle
    ctx.beginPath();
    ctx.arc(105, 100, 84.5, 0, Math.PI*2, true);
    ctx.lineWidth = "1px";
    ctx.strokeStyle = "#ccc";
    ctx.closePath();
    ctx.stroke();

    // middle dot
    ctx.beginPath();
    ctx.arc(105, 100, 3, 0, 2*Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = "#888";
    ctx.fill();

    // labels
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText("1.0", 250, 13);
    ctx.fillText("0.0", 237, 113);
    ctx.fillText("-1.0", 250, 200);
}

function drawAnimatedElements() {
    // Number of points to plot
    var n = Math.round(100 * theta / Math.PI + 1)

    // plot the radius
    var x = 105+84.5*Math.cos(theta);
    var y = 100-84.5*Math.sin(theta);
    ctx.line(105, 100, x, y, "#ccc", "1px");

    // plot the vertical line
    ctx.line(x, 100, x, y, "red", "1px");

    // plot the arc representing the angle
    ctx.beginPath();
    ctx.moveTo(125, 100);
    ctx.arc(105, 100, 20, 0, -theta, true);
    ctx.strokeStyle = "#ccc";
    ctx.stroke();

    // plot the connecting line
    ctx.line(x, y, RHS(theta).x, RHS(theta).y, "#eee", "1px");

    // plot the endpoint
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fillStyle = "red";
    ctx.fill();

    // plot the sine curve
    var phi, newX, newY;
    pos = {"x": 250, "y": 100};
    for (var j = 1; j <= n; j++) {
	phi = j * theta/n;
	newPos = RHS(phi);
	ctx.line(pos.x, pos.y, newPos.x, newPos.y, "red", "1px");
	pos = newPos;
    }
    
    // plot the endpoint on the sine curve
    ctx.beginPath();
    ctx.arc(RHS(theta).x, RHS(theta).y, 5, 0, 2*Math.PI, true);
    ctx.fillStyle = "red";
    ctx.fill();

    function RHS(alpha) { // Returns x, y coords on RHS
	return {
	    "x": 250+(350*alpha)/(2*Math.PI),
	    "y": 100-84.5*Math.sin(alpha)
	}
    }

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

$("#sine").mousedown(function(e) {
    if (sineMousePosition(e).x < 250) { // handler for mousedown on LHS
	changingPolar = true;
	updatePolar(e);
    } else { // handler for mousedown on RHS
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
    theta = ((sineMousePosition(e).x-250)*2*Math.PI/350).limit(0, 2*Math.PI);
    redraw();
}

function sineMousePosition(e) {
    // Return the position within the #sine canvas.
    return {
	"x": e.pageX - $("#sine").offset().left,
	"y": e.pageY - $("#sine").offset().top
	}
}

Number.prototype.limit = function(a, b) {
    // Assumes a < b.  Returns the number if it's within the range a
    // to b, otherwise returns the smaller or larger endpoint, as
    // appropriate.  Idea from Mootools.
    if (this.valueOf() < a) {return a}
    if (this.valueOf() > b) {return b}
    return this.valueOf();
}
