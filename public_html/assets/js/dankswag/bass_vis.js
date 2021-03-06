function createVisualizer(){
var player = $("audio").get(0);
var canvas = $("#vis-canvas").get(0);

$(player).on("play", function(){
	$(canvas).fadeIn();
});

$(player).on("pause", function(){
	$(canvas).fadeOut();
});

$(canvas).fadeOut();

function drawCurve(ctx, points){
	ctx.moveTo(points[0].x, points[0].y);
	for (i = 1; i < points.length - 2; i ++){
		var xc = (points[i].x + points[i + 1].x) / 2;
		var yc = (points[i].y + points[i + 1].y) / 2;
		ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
	}
	ctx.quadraticCurveTo(points[i].x, points[i].y, points[i+1].x,points[i+1].y);
}

var pts = [];

function resizeVis(){
	canvas.width = $(window).width();
	canvas.height = $(window).height();
}
resizeVis();
$(window).resize(resizeVis);

var ctx = canvas.getContext("2d");

var analyser;
var audioCtx = new (window.AudioContext || window.webkitAudioContext);

analyser = audioCtx.createAnalyser();
analyser.fftSize = 256 * 64;
analyser.smoothingTimeConstant = 0.1; // we kinda need shaking to be immediate

var source = audioCtx.createMediaElementSource(player);

source.connect(analyser);  // source > analyser > output
analyser.connect(audioCtx.destination);

streamData = new Uint8Array(128 * 64);

var shakeThreshold = 7000;
var shakeDelay = 1000;
var lastShakeTime = new Date().getTime();

var totalVol;

var oldColor = {r: 0, g: 0, b: 0};
var newColor = {r: 0, g: 0, b: 0};
var colorTransitionTime = 0;

var osLogo = new Image();
osLogo.src = "/assets/images/os-logotype.svg";

function randomDir(){
	var dx = Math.random() - 0.5, dy = Math.random() - 0.5;
	return {x: dx, y: dy};
}

var particles = [];

	
for(var i=0;i<100;i++){
	particles.push({x: 0, y: 0, z: 10, dir: randomDir()});
}

var lastCalledTime = new Date().getTime();

var sampleAudioStream = function() {
	if(player.paused){
		// ctx.clearRect(0, 0, canvas.width, canvas.height);
		requestAnimationFrame(sampleAudioStream);
		return;
	}
	
	var timeNow = new Date().getTime();
	var delta = timeNow - lastCalledTime;
	lastCalledTime = timeNow;
	
	oldColor = newColor;
	newColor = Please.HEX_to_RGB(c[1]);
	colorTransitionTime = 0;

    analyser.getByteFrequencyData(streamData);
	totalVol = 0;
	for (var i = 0; i < 80; i++) {
		totalVol += Math.pow(streamData[i], 2.72) / 20000;
	}
	
	var offsetX = 0, offsetY = 0;
	
	if(totalVol > shakeThreshold){
		offsetX = Math.random() * 20 - 10;
		offsetY = Math.random() * 20 - 10;
		lastShakeTime = timeNow;
	} else if(timeNow - lastShakeTime < shakeDelay){
		offsetX = Math.random() * 20 - 10;
		offsetY = Math.random() * 20 - 10;
	}
	
    for (var i = 0; i < 80; i++) {
		var data = Math.pow(streamData[i], 2.72) / 20000;
		if(data < 100) data = 100;
		
		data = data * (canvas.height / 2) / 250;
        pts[i] = {
			x: (data) * Math.cos(i * Math.PI * 2 / 160 - (Math.PI / 2)) + (canvas.width / 2) + offsetX,
			y: (data) * Math.sin(i * Math.PI * 2 / 160 - (Math.PI / 2)) + (canvas.height / 2) + offsetY
		};
    }
	
	for (var i = 80; i < 160; i++) {
		var data = Math.pow(streamData[160 - i], 2.72) / 20000;
		if(data < 100) data = 100;
		data = data * (canvas.height / 2) / 250;
        pts[i] = {
			x: (data) * Math.cos(i * Math.PI * 2 / 160 - (Math.PI / 2)) + (canvas.width / 2) + offsetX,
			y: (data) * Math.sin(i * Math.PI * 2 / 160 - (Math.PI / 2)) + (canvas.height / 2) + offsetY
		};
    }
	
	for(var i=0;i<particles.length;i++){
		var p = particles[i];
		
		var speed = 1 / 20;
		if(offsetX != 0 && offsetY != 0){
			speed *= 5;
		}
		
		p.x += p.dir.x * speed;
		p.y += p.dir.y * speed;
		p.z -= speed;
	}
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	for(var i=0;i<particles.length;i++){
		var p = particles[i];
		var x = p.x * canvas.width / p.z;
		var y = p.y * canvas.height / p.z;
		var radius = 100 / p.z;
		
		if(Math.abs(x) > canvas.width / 2 || Math.abs(y) > canvas.height / 2 || radius < 0){
			particles[i] = {x: 0, y: 0, z: 10, dir: randomDir()};
			continue;
		}
		
		var gradient = ctx.createRadialGradient(x + canvas.width / 2, y + canvas.height / 2, 0, x + canvas.width / 2, y + canvas.height / 2, radius);
		gradient.addColorStop(0, "white");
		gradient.addColorStop(0.3, "white");
		gradient.addColorStop(1, "transparent");
		ctx.fillStyle = gradient;
		
		ctx.beginPath();
		ctx.arc(x + (canvas.width / 2), y + (canvas.height) / 2, radius, 0, Math.PI*2, true); 
		ctx.closePath();
		ctx.fill();
	}

    ctx.beginPath();
    drawCurve(ctx, pts);
    ctx.closePath();
    ctx.strokeStyle = Please.RGB_to_HEX(newColor);
    ctx.fillStyle = "#6677cc";
    ctx.lineWidth = 3;
    ctx.stroke();
	
	ctx.fillStyle = Please.RGB_to_HEX(newColor);
	ctx.fill();
	
	var targetWidth = 180 * (canvas.height / 2) / 250;
	var targetHeight = osLogo.naturalHeight * targetWidth / osLogo.naturalWidth;
	var logoX = -(targetWidth / 2) + offsetX + (canvas.width / 2);
	var logoY = -(targetHeight / 2) + offsetY + (canvas.height / 2);
	ctx.drawImage(osLogo, 0, 0, osLogo.naturalWidth, osLogo.naturalHeight, logoX, logoY, targetWidth, targetHeight);
	requestAnimationFrame(sampleAudioStream);
};

requestAnimationFrame(sampleAudioStream);

}

if(!!window.AudioContext || !!window.webkitAudioContext) createVisualizer();
