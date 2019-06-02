var canvas, raf, ctx, clock = true, theta = 0, attacking = false, bricks = [], gameOver = false;
var playAgain = {
	text : 'Play Again',
	x: 0,
	y: 230,
	width: 350,
	height: 50,
	draw: function(){
		ctx.font = '400 40px Kremlin Pro Web';
		this.width = ctx.measureText(this.text).width;
		this.x = canvas.width/2 - this.width/2;
		ctx.fillStyle = 'rgba(250, 250, 250, 0.6)';
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.fillStyle = 'rgba(50, 250, 50, 1)';			    	
		ctx.fillText(this.text, this.x, this.y + this.height - 10);
	}
}
var ballBlue = {
	x: 0,
	y: 0, 
	radius: 10,
	v: 20,
				// vx: 0,
				// vy: 20,
	color: 'rgba(100, 100, 255, 1)',
	draw: function(){
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
					// console.log("Blue ball is drawn");
	}
}
var ballPink = {
	x: 0,
	y: 0, 
	radius: 10,
	v: 20,
	color: 'rgba(255, 100, 100, 1)',
	draw: function(){
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
					// console.log("Pink ball is drawn");
	}
}
var brick = {
	x: 200,
	y: 5,
	width: 80,
	height: 40,
	vy: 3,
	color: 'rgb(0, 0, 0)',
	draw: function(){
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}
function start(){
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	// console.log("Reached inside start()");
	// var background = new Image();
	// draw();
	raf = window.requestAnimationFrame(draw);
	window.onkeydown = function (e) {
		var code = e.keyCode ? e.keyCode : e.which;
		if (code === 37) { //left key
	   	// console.log("Left key pressed");
			theta += Math.PI/10;
			clock = false;
		}
		else if (code === 39) {
			// console.log("Right key pressed");
			theta -= Math.PI/10; //right key
			clock = true;
		}
	};
}
function restart(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	restoreBrick();
	attacking = false;
	gameOver = false;
	raf = window.requestAnimationFrame(draw);
}
function restoreBrick(){
	brick.x = 200;
	brick.y = 5;
	width =  80;
	height = 40;
}
function draw(){
    var backgroundGray = 'rgba(240, 240, 240, 0.9)';	
    var backgroundBalls = 'rgba(240, 240, 240, 0.4)';		
				
	ctx.fillStyle = backgroundGray;
	ctx.fillRect(0, 0, canvas.width, 340);

	ctx.fillRect(0, 460, canvas.width, 40);

	ctx.fillRect(0, 340, 90, 120);

	ctx.fillRect(210, 340, 90, 160);

	ctx.fillStyle = backgroundBalls;
	ctx.fillRect(90, 340, 120, 120);

	ctx.save();
	ctx.translate(150, 400);
				
	ctx.rotate(theta);
	ctx.save();
	ctx.translate(50, 0);
	ctx.beginPath();
			  
	ballBlue.draw();
	ctx.restore();
				 
	ctx.translate(-50, 0);
	ctx.beginPath();
				 
	ballPink.draw();	
				
	ctx.restore();	
	ctx.save();
	if(!attacking){
		rand = Math.random();
			if(rand < 0.50){
				brick.width = 60;
				brick.height = 40;
			}
			else{
				brick.width = 40;
				brick.height = 60;
			}
		brick.x = Math.random()*200 + 50 - brick.width/2;
		brick.color = 'rgb(' + Math.floor(Math.random()*255) + ',' + Math.floor(Math.random()*255) + ',' + Math.floor(Math.random()*255) + ')';
		// console.log("New brick created with color " + brick.color);
		attacking = true;
								
			
	}
	else if(brick.y + brick.vy + brick.height/2 >= 500){
		brick.y = 5;
		attacking = false;
					
	}
	if(ballBlueCollidesRectangle() || ballPinkCollidesRectangle()){
		gameOver = true;
		console.log("Game Over!");
	}
	if(!gameOver){
		brick.draw();
		brick.y += brick.vy;
			
		// console.log("Ball Blue collides brick? : " + ballBlueCollidesRectangle());
		// console.log("Ball Pink collides brick? : " + ballPinkCollidesRectangle());
		raf = window.requestAnimationFrame(draw);
	}
	else{
		window.cancelAnimationFrame(raf);
		// gameOver = false;
		ctx.fillStyle = 'rgba(200, 200, 200, 1)';
		// ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		var text = 'Game Over!';
		ctx.font = '400 40px Kremlin Pro Web';
		var textWidth = ctx.measureText(text).width;
		var x = canvas.width/2 - textWidth/2;
		ctx.fillStyle = 'rgba(250, 250, 250, 0.6)';
		ctx.fillRect(x, 150, textWidth, 50);
		ctx.fillStyle = 'rgba(250, 50, 50, 1)';			    	
		ctx.fillText(text, x, 190);

		playAgain.draw();
				
		ctx.restore();
	}
				
}
function ballBlueCollidesRectangle(){
	var cx = 150 + 50 * Math.cos(theta);
	var cy = 400 - 50 * Math.sin(theta);
	var cr = 10;
	var rx = brick.x;
	var ry = brick.y;
	var rw = brick.width;
	var rh = brick.height;

	var distX = Math.abs(cx - rx - rw / 2);
	var distY = Math.abs(cy - ry - rh / 2);

	if (distX > (rw / 2 + cr)) {
	   return false;
	}
	if (distY > (rh / 2 + cr)) {
	   return false;
	}

	if (distX <= (rw / 2)) {
	   return true;
	}
	if (distY <= (rh / 2)) {
	   return true;
	}

	var dx = distX - rw / 2;
	var dy = distY - rh / 2;
	return (dx * dx + dy * dy <= (cr * cr));
}
function ballPinkCollidesRectangle(){
	var cx = 150 - 50 * Math.cos(theta);
	var cy = 400 + 50 * Math.sin(theta);
	var cr = 10;
	var rx = brick.x;
	var ry = brick.y;
	var rw = brick.width;
	var rh = brick.height;

	var distX = Math.abs(cx - rx - rw / 2);
	var distY = Math.abs(cy - ry - rh / 2);

	if (distX > (rw / 2 + cr)) {
	   return false;
	}
	if (distY > (rh / 2 + cr)) {
	   return false;
	}

   if (distX <= (rw / 2)) {
	   return true;
	}
	if (distY <= (rh / 2)) {
	   return true;
	}

	var dx = distX - rw / 2;
	var dy = distY - rh / 2;
	return (dx * dx + dy * dy <= (cr * cr));				
}
function getMousePos(canvas, event) {
	var rect = canvas.getBoundingClientRect();
	return {
      x: event.clientX - rect.left,
	   y: event.clientY - rect.top
	};
}
	
//Function to check whether a point is inside a rectangle
function isInside(pos, rect){
  return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y
}
document.addEventListener('click', function(evt) {
	var mousePos = getMousePos(canvas, evt);
	if(gameOver)
	if (isInside(mousePos,playAgain)) {
		   
      restart();
   }
	else{
	  console.log('clicked outside rect');
	}   
}, false);
