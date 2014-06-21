var canvas = document.getElementById("sine");
var ctx = canvas.getContext("2d");
var theta = 0;
var n = 0; // Number of points plotted so far
setupDrawing();

function startSineAnimation() {
    window.requestAnimationFrame(animate);
};

function animate() {
    if (theta < 2*Math.PI) {
	theta += 0.01;
	n += 1;
    } else {
	theta = 0.01;
	n = 1;
    }
    canvas.width = canvas.width;
    setupDrawing();
    plot(theta, n);
    window.requestAnimationFrame(animate);
}

function setupDrawing() {
    ctx.strokeStyle = "#ccc";

    // top line
    ctx.beginPath();
    ctx.moveTo(0, 15.5);
    ctx.lineTo(600, 15.5);
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

function plot(theta, n) {
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
    
}
