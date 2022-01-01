import jQuery from "jquery";
var $ = window.$ = window.jQuery = jQuery;

var panelState = {
	currentPanel: 0
};
window.panelState = panelState;
var panels = new Array();
var panelPositions = new Array();
var markerPositions = [36,106,175,240];
var transitioning = false;
var dropdownFirstTime = true;

$.ready = function() {
	initSetup();
	$("body").keydown(keyPressed);
	$(".demos h3").click(dropdownClicked);
	$(".info strong").mouseenter(showTooltip);
	$(".info strong").mouseleave(hideTooltip);
	$(".info img").click(imageClicked);
	$(".lightbox").click(closeLightbox);
	//moveto(1);
};

function imageClicked(args) {
	$(".lightbox").fadeIn();
	$("#lightboxImg").attr("src",args.target.src.split("/").pop());
}

function closeLightbox() {
	$(".lightbox").fadeOut();
}

function showTooltip(args) {
	console.log(args);
	let t0p = "0%";
	let left = "0%";
	let newtext = "";
	let width = 100;
	switch (args.target.id)
	{
		case("meng"):
			t0p = "7%";
			left = "-16%";
			newtext = "2:1";
			break;
		case("alevels"):
			t0p = "15%";
			left = "12%";
			newtext = "A A B (Maths, Physics, Further Maths)";
			break;
		case("baml"):
			t0p = "37%";
			left = "-9%";
			newtext = "Working in Python, SQL, and C#. Used Test-driven and Agile development.";
			width = 150;
			break;
		case("ce"):
			t0p = "59%";
			left = "-1%";
			newtext = "Quickly comprehending complex and unfamiliar data for clients in a high-pressure environment.";
			width = 170;
			break;
		case("programming"):
			t0p = "79%";
			left = "17%";
			newtext = "Python, with extensive Snowflake and MongoDB experience.";
			break;
	}
	$(".tipbox").css({
		"top": t0p,
		"left": left,
		"width": width
	});
	
	$(".tiptext").text(newtext);
	$(".tipbox").fadeIn();
		
}

function hideTooltip() {
	$(".tipbox").hide();
}

function dropdownClicked(args) {
	$(".tipbox").hide();
	if (dropdownFirstTime && args.target.id == "education") {
		$(".tipbox").css({
			"top": "7%",
			"left": "-20%",
			"width": 120
		});
		$(".tiptext").text("Hover over this text for more info!");
		$(".tipbox").fadeIn();
		dropdownFirstTime = false;
	}
	if (args.target.id == "elemental") {
		$(".info img#elementalImg").fadeToggle();
	}
	$("#"+args.target.id+"Div").slideToggle("slow");
}

var konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 13];
var konamiPos = 0;

function konamiCode(key) {
	if (key == konami[konamiPos])
		konamiPos++;
	else
		konamiPos = 0;
	if (konamiPos == konami.length){
		rollToTop();
		konamiPos = 0;
	}
}

function rollToTop() {
	console.log("rolling");
	moveto(0);
	$("body").css("-moz-transform-origin","50% 50% 225px");
	$("body").css("-webkit-transform-origin","50% 50% 225px");
	setTimeout(function(){
		$("#whatisthis").css("border-spacing",270);
		$("#whatisthis").animate({
			"border-spacing": 360
		},{
			step:function(now){
				$("#whatisthis").css("-moz-transform","rotateX("+now+"deg)");
				$("#whatisthis").css("-webkit-transform","rotateX("+now+"deg)");
				$("#p0").css("-moz-transform","rotateX("+(now-270)+"deg)");
				$("#p0").css("-webkit-transform","rotateX("+(now-270)+"deg)");
			},
			time: 1500,
			complete:function(){
				$("body").css("-moz-transform-origin","50% 50% 250px");
				$("body").css("-webkit-transform-origin","50% 50% 250px");
			}
		});
	}, 600);
}

export function moveto(target, reversed)
{
	if ($(".tiptext").text().indexOf("Click") == -1)
		$(".tipbox").hide();

	transitioning = true;
	console.log(`Moving from panel ${window.panelState.currentPanel} to ${target}.`);
	window.panelState.currentPanel = target;
	let distToFront = panelPositions[target];

	if (distToFront >= 270)
		reversed = true;
	
	let time = reversed? 600 : 600*(distToFront/90);

	let startValue =  reversed ? panelPositions[target] : distToFront;
	let targetValue = reversed ? 360 : 0;

	$(".pane").css("border-spacing",startValue);
	$(".pane").animate({
		"border-spacing": targetValue
	},{
		step:function(now){
			// front
			panelPositions[target] = (now)%360;
			// left
			panelPositions[((target+4)-1)%4] = (now + 270)%360;
			// right
			panelPositions[(target+1)%4] = (now + 90)%360;
			// back
			panelPositions[(target+2)%4] = (now + 180)%360;
			updatePositions();
		},
		duration:time,
		complete: function(){transitioning=false;}
	});

	$(".hackymarker").animate({
		"left":markerPositions[target]
	}, time);
}

function keyPressed(args) {
	console.log(`key ${args.which} was pressed.`);
	konamiCode(args.which);
	// right arrow
	if (args.which === 39) {
		if (!transitioning)
			moveto((window.panelState.currentPanel+1)%4, false);
	}
	// left arrow
	else if (args.which === 37) {
		if (!transitioning)
			moveto((window.panelState.currentPanel+3)%4, true);
	}
	// escape
	else if (args.which===27){
		$("#whatisthis").css("-moz-transform","rotateX(270deg)");
		$("#whatisthis").css("-webkit-transform","rotateX(270deg)");
		$("#p0").css("-moz-transform","rotateX(0deg)");
		$("#p0").css("-webkit-transform","rotateX(0deg)");
	}
}

function initSetup(){
	for (let i=0; i < 4; i++) {
		panels[i] = $("#p"+i);
	}
	panelPositions = [0, 90, 180, 270];
	updatePositions();
	$(".info").hide();
	$(".lightbox").hide();
}

function updatePositions() {
	for (let i=0; i < 4; i++) {
		panels[i].css("-moz-transform","rotateY("+panelPositions[i]+"deg)");
		panels[i].css("-webkit-transform","rotateY("+panelPositions[i]+"deg)");
		if (panelPositions[i]%360 >= 270 || panelPositions[i]%360 <= 90)
			panels[i].show();
		else
			panels[i].hide();
	}
}

export default moveto;