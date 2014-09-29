var DELAY = 60; // Number of seconds between screen shots

$($.getJSON("index.json", function(index) {
    // Get viewport width and height
    var width = $(window).width();
    var height = $(window).height();

    // Figure out the number of books across and down, and the sizes
    // Start out with an approximate height of 400 and width 2/3rds of
    // that, and then modify a little to ensure that we get an

    var approxCoverHeight = 400;
    var yNumber = Math.floor(height / approxCoverHeight)+1;
    var coverHeight = Math.floor(height / yNumber);

    var approxCoverWidth = Math.floor(approxCoverHeight*2.0/3.0);
    var xNumber = Math.floor(width / approxCoverWidth)+1;
    var coverWidth = Math.floor(width / xNumber);

    var numBooks = xNumber * yNumber;

    display();
    $(".foo").show();
    function display() {
	index = shuffle(index);
	for (var x = 0; x < xNumber; x++) {
	    for (var y = 0; y < yNumber; y++) {
		book = index[x+y*xNumber];
		$("body").append(
		    "<span class='foo' style='display: none;'><a target='_blank' href='"+book.link_url+"'><img src='"+
			book.file+"' "+
			"width='"+
			coverWidth+
			"' height='"+
			coverHeight+
			"' style='position: fixed; left: "+
			x*coverWidth+
			"px; top: "+
			y*coverHeight+
			"px;' /></a></span>");
	    }
	}
    }
    setInterval(function() {
	$(".foo").fadeOut(
	    200,
	    function() {
		$(".foo").remove();
		display();
		$(".foo").fadeIn(800);
	    });
    }, DELAY*1000);
}))


//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [rev. #1]

shuffle = function(v){
    for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
    return v;
};
