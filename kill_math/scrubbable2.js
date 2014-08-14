// Simple implementation of a scrubbable number prototype.

$(function() {
    initScrubbableNumbers2();
    // The use of setInterval and updateAnswer2 is a kludge.  Ideally
    // we'd use data binding, perhaps using a framework such as
    // backbone or angular, but this is fine as quick-and-dirty hack.
    setInterval(updateAnswer2, 10); 
});

function updateAnswer2() {
    // The computation of the answer and updating of the DOM is all
    // hardwired at present.  Obviously, this would need to change in
    // a real implementation!
    var contents = {};
    for (var j=1; j <= 6; j++) {
	contents["n"+j] = parseInt($("#n2_"+j+"Child2Content")[0].textContent);
    }
    var answer = contents.n1+contents.n2+contents.n3 * contents.n4 +
	    contents.n5*contents.n6;
    $("#answer2")[0].textContent = answer.toString();

    answer = Math.round(
	Math.pow(1.01, 20)* parseInt($("#n3Child2Content")[0].textContent));
    $("#answer3")[0].textContent = answer.toString();
}

function initScrubbableNumbers2() {
    if (typeof document.registerElement !== "undefined") {
	var htmlElement = document.registerElement('scrubbable-number2');
    }
    $("scrubbable-number2").each(function() {
	var childId = this.id+"Child2";
	var n = this.textContent;
	this.textContent = "";
	var html = "<span id='"+childId+"' class='number cursorHover'>";
	html += "<span id='"+childId+"Content' style='user-select: none;'>";
	html += n+"</span>";
	html += "</canvas></span>";
	$("#"+this.id).append(html);
	new scrubbableNumber2(parseInt(n), "#"+childId);
    });
}

function scrubbableNumber2(n, id) {
    // Create a scrubbable number with value n and id id.
    this.n = n;
    this.number = $(id);
    this.content = $(id+"Content");
    this.content.text(format(this.n));
    this.icon = $(id+"Icon");
    this.number.mouseenter(function() {
	this.number.css("backgroundColor", "#ddd");
    }.bind(this));
    this.number.mousedown(function(e) {
	this.selected = true; // flag to indicate that scrubbing has commenced
	this.startX = mousePosition(e).x;
	this.newN = this.n;
	this.val = generateValues(this.n);
	this.highlightNumber();
	$("html").addClass("cursorHover");
    }.bind(this));
    $("html").mousemove(function(e) {
	if (this.selected) {
	    var delta = mousePosition(e).x-this.startX;
	    this.newN = this.rescaling(delta);
	    this.content.text(format(this.newN));
	};
    }.bind(this));
    $("html").mouseup(function() {
	if (this.selected) {
	    this.selected = false;
	    this.removeHighlight();
	    this.n = this.newN;
	    this.content.text(this.n);
	    this.number.css("backgroundColor", "white");
	    $("html").removeClass("cursorHover");
	};
    }.bind(this));
    this.number.mouseleave(function() {
	if (!this.selected) {
	    this.removeHighlight();
	    this.number.css("backgroundColor", "white");
	}
    }.bind(this));
};

scrubbableNumber2.prototype.highlightNumber = function() {
    this.number.css("border", "solid 1px #888");
    this.number.css("backgroundColor", "#aaa");
}

scrubbableNumber2.prototype.removeHighlight = function() {
    this.number.css("border", "solid 1px white");
    this.number.css("backgroundColor", "#ddd");
}

scrubbableNumber2.prototype.rescaling = function(delta) {
    // Scale the mouse displacement delta, and return the
    // corresponding value for the scrubbable number
    return this.val[Math.round(delta/4).toString()];
}

function generateValues(m) {
    // m is the current value of the scrubbable number.  The function
    // returns an associative array whose keys are -999, -998, ...,
    // 999, representing possible (scaled) mouse displacements.  The
    // values are the corresponding values for the scrubbable number.
    var val = {"0": m};
    function generate(n, multiplier) {
	var key, cur=n, curPower=1, nextPower=10;
	for (var index = 1; index < 1000; index++) {
	    cur += multiplier*curPower;
	    key = (multiplier*index).toString();
	    val[key] = cur;
	    while (cur % nextPower == 0 && cur != 0) {
		curPower *= 10;
		nextPower *= 10;
	    }
	}
    }
    generate(m, 1);
    generate(m, -1);
    return val;
}

function format(n) {
    return Math.round(n).toString();
};

function mousePosition(e) {
    return {"x": e.pageX, "y": e.pageY};
};

