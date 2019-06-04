var canvas, raf, ctx, clock, theta, bricks = [], gameOver, flags;
var noOfBricksPassed, score, maxBricks, scoreInteger, landmarkScoreForBricks, landmarkScoreForSpeed, speed;
var blue = 'rgba(100, 100, 255, 1)', pink = 'rgba(255, 100, 100, 1)', red = 'rgba(250, 50, 50, 0.9)', green = 'rgba(50, 250, 50, 0.9)';
var gray = 'rgba(200, 200, 200, 0.9)', white = 'rgba(250, 250, 250, 0.9)', black = 'rgba(10, 10, 10, 0.8)';
var scoreText;
var noOfBricksAlive;

function load(){
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	scoreText = document.getElementById("score-text");

	ctx.save();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = black;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.restore();
	// console.log("Reached inside start()");
	// draw();
	Start = new Button('Start', 'start');
	Start.draw(green);
	// raf = window.requestAnimationFrame(draw);
	
}
function start(){

	init();
	raf = window.requestAnimationFrame(draw);
}
function restart(){
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	init();	
	raf = window.requestAnimationFrame(draw);
}
function init(){
	theta = 0;
	maxBricks = 1;
	noOfBricksAlive = 0;
	noOfBricksPassed = 0;

	bricks = [];
	noOfBricksAlive = 0;

	gameOver = false;
	score = 0;
	scoreInteger = 0;
	landmarkScoreForBricks = 4;
	landmarkScoreForSpeed = 2;
	speed = 3;

	clock = true;
	flags = [true, true];

	scoreText.innerHTML = "Score : " + Math.floor(score);

	document.removeEventListener("keydown", arrowControl);
	document.addEventListener("keydown", arrowControl);
}

class Ball{
	constructor(color, positive){
		this.color = color;
		this.x = 0;
		this.y = 0;
		this.radius = 10;
		this.positive = positive;
		// draw();
	}
	draw(centerX, centerY, centerRadius){
		ctx.save();
		if(this.positive){
			this.x = centerX + centerRadius * Math.cos(theta);
			this.y = centerY - centerRadius * Math.sin(theta);
		}
		else{
			this.x = centerX - centerRadius * Math.cos(theta);
			this.y = centerY + centerRadius * Math.sin(theta);			
		}
		// ctx.translate(150, 400);				
		// ctx.rotate(theta);
		// if(this.pos)
		// 	ctx.translate(50, 0);
		// else
		// 	ctx.translate(-50, 0);
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.restore();
	}
}
class Obstacle{
	constructor(shape, color){
		this.shape = shape;
		this.color = color;

	}
}
class Brick extends Obstacle{
	constructor(){
		var rand1 = Math.random();
		var rand2 = Math.random();
		var rand3 = Math.random();
		var color;
		if((rand1*255 <= 20 && rand2*255 <= 20 && rand3*255 <= 20) || (Math.abs(rand1 - rand2)*255 <= 5 && Math.abs(rand2 - rand3)*255 <= 5 && Math.abs(rand3 - rand1)*255 <= 5)){
			color = 'rgb(250, 50, 50)';
		}
		else{
			color = 'rgb(' + Math.floor(rand1*255) + ',' + Math.floor(rand2*255) + ',' + Math.floor(rand3*255) + ')';
		}
		
		super('rectangle', color);
		this.color = color;
		if(Math.random() < 0.50){
			this.width = 48;
			this.height = 40;

		}
		else{
			this.width = 40;
			this.height = 48;
		}
		
		this.x = Math.random()*200 + 50 - this.width/2;
		
		this.y = 5;
		this.vy = 3;
		this.alive = true;

	}
	
	draw(){
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.restore();
		
	}
	// setAlive(alive){
	// 	this.alive = alive;
	// }
	// isAlive(){
	// 	return this.alive;
	// }
	isAlive(){
		
		if(this.y + this.vy + this.height/2 >= canvas.height){
			// console.log("Brick not alive in isAlive");
			// ++noOfBricksPassed;
			// canAttack = true;
			return false;
		}
		else{
			return true;
		}
	}
	updateSpeed(dv){
		this.vy += dv;
	}
	update(){
		this.y += this.vy;
	}
	updateToSpeed(vy){
		this.vy = vy;
	}

}
class Button{
	constructor(text, action = 'none'){
		this.text = text;
		ctx.save();
		ctx.font = '400 40px Kremlin Pro Web';
		this.width = ctx.measureText(this.text).width;
		this.x = canvas.width/2 - this.width/2;
		this.height = 50;
		this.start = false;
		this.restart = false;

		switch(action){
			case 'start' : this.start = true; break;
			case 'restart' : this.restart = true; break;
		}
		
	}
	draw(color, noOfButtons = 1, number = 1){
		if(noOfButtons == 1)
			this.y = canvas.height/2 - this.height/2;
		else
			this.y = canvas.height/2 - this.height/2 + (2*number - (noOfButtons + 1)) * this.height * 3 / 2;
		ctx.fillStyle = white;
		ctx.fillRect(this.x, this.y, this.width, this.height);

		ctx.fillStyle = color;

		ctx.fillText(this.text, this.x, this.y + this.height - 10);
		ctx.restore();

		if(this.restart || this.start){
			document.addEventListener('click', this.click.bind(this));
		}		
	}

	click(e){
		
		if(isInside(getMousePos(canvas, e), this)){
			
			if(gameOver && this.restart){
				document.removeEventListener('click', this.click);
				restart();
			}
			else if(this.start){
				document.removeEventListener('click', this.click);
				start();
			}
			// else if(Start.start){
			// 	console.log("Inside click start action");
			// }
			// else{
			// 	console.log("Not reached inside restart");
			// }
		}
	}

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
	
	// console.log((pos.x > x && pos.x < x+width && pos.y < y+height && pos.y > y) + " Returned in isInside");
    return (pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y);
}

// document.addEventListener('click', function(evt) {
// 	var mousePos = getMousePos(canvas, evt);
// 	if(gameOver)
// 	if (isInside(mousePos, playAgain)) {
		   
// 	  restart();
//    }
// 	else{
// 	  console.log('clicked outside rect');
// 	}   
// }, false);
// var playAgain = {
// 	text : 'Play Again',
// 	x: 0,
// 	y: 230,
// 	width: 350,
// 	height: 50,
// 	draw: function(){
// 		ctx.font = '400 40px Kremlin Pro Web';
// 		this.width = ctx.measureText(this.text).width;
// 		this.x = canvas.width/2 - this.width/2;
// 		ctx.fillStyle = 'rgba(250, 250, 250, 0.6)';
// 		ctx.fillRect(this.x, this.y, this.width, this.height);
// 		ctx.fillStyle = 'rgba(50, 250, 50, 1)';			    	
// 		ctx.fillText(this.text, this.x, this.y + this.height - 10);
// 	}
// }

function arrowControl(e) {
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

function draw(){

	
	drawBackground();

	rishav = new Ball(blue, true);
	phoebe = new Ball(pink, false);

	rishav.draw(150, 400, 58);
	phoebe.draw(150, 400, 58);


	score += 1/100;

	// console.log('Score : ' + Math.floor(score));
	if(flags[0]){
		console.log('Bricks Passed : ' + noOfBricksPassed);
		flags[0] = false;
	}
	if(score >= (scoreInteger + 1)){
		// console.log('Inside setting, Score : ' + score);
		scoreText.innerHTML = "Score : " + Math.floor(score);
		++scoreInteger;
	}
	

	var deletedBrick;

	if(score >= landmarkScoreForBricks){
		landmarkScoreForBricks += 5;
		++maxBricks;
	}
	if(score >= landmarkScoreForSpeed){
		console.log("landmarkScoreForSpeed : " + landmarkScoreForSpeed + " Reached");
		// flags[1] = false;
		speed += 0.1;
		landmarkScoreForSpeed += 1;
	}
	// bricks.forEach(function(brick, index){
	// 		// console.log("Entered for brick : " + (index + 1));
	// 		brick.updateToSpeed(speed);
			
	// 	});
	// if(flag){
	// 	console.log("noOfBricksAlive < maxBricks : " + noOfBricksAlive < maxBricks);
	// 	console.log("noOfBricksAlive >= 0 : "+ noOfBricksAlive >= 0);
	// 	console.log("!gameOver : " + !gameOver);
	// }

	//Generate the maxumimum no of bricks at a time.
	if(noOfBricksAlive < maxBricks && noOfBricksAlive >= 0 && !gameOver){
		// console.log("noOfBricksAlive : " + noOfBricksAlive);
		// if(noOfBricksAlive > 0){
		// 	console.log("bricks[noOfBricksAlive-1].y : " + bricks[noOfBricksAlive-1].y);
		// 	console.log("bricks[noOfBricksAlive-1].y >= canvas.height/2 : " + bricks[noOfBricksAlive-1].y >= canvas.height/2);
		// }
		if(noOfBricksAlive > 0 && bricks[noOfBricksAlive-1].y >= canvas.height/2){
			// console.log("bricks[noOfBricksAlive-1].y before Generate: " + bricks[noOfBricksAlive-1].y);
			
			bricks.push(new Brick());

			++noOfBricksAlive;
			bricks[noOfBricksAlive - 1].updateToSpeed(speed);
			console.log("Speed updated to : " + bricks[noOfBricksAlive - 1].vy.toFixed(2) + " for brick : " + noOfBricksAlive);
		}
		else if(noOfBricksAlive == 0){
			bricks.push(new Brick());
			++noOfBricksAlive;
			bricks[noOfBricksAlive - 1].updateToSpeed(speed);
			console.log("Speed updated to : " + bricks[noOfBricksAlive - 1].vy.toFixed(2) + " for brick : " + noOfBricksAlive);
			// console.log("Since noOfBricksAlive is 0, noOfBricksAlive was incremented to " + noOfBricksAlive);
		}			
		
	}
	// console.log("bricks[0].isAlive() : " + bricks[0].isAlive());
	if(!bricks[0].isAlive()){
		deletedBrick = bricks.splice(0, 1);
		--noOfBricksAlive;
		++noOfBricksPassed;
		flags[0] = true;
		console.log("One brick deleted");
	}
	
	if(!gameOver){
		// if(flag)
		// 	console.log("Inside !gameOver");
		bricks.forEach(function(brick, index){
			brick.update();
			brick.draw();
		// if(flag)	
			// console.log("requestAnimationFrame requested");	
		});
		raf = window.requestAnimationFrame(draw);
	}
	bricks.forEach(function(brick){
		if(circleCollidesRectangle(rishav, brick) || circleCollidesRectangle(phoebe, brick)){
			window.cancelAnimationFrame(raf);
			gameOver = true;
			console.log("Game is Over!");
			ending();
		}
	});
	
}
function ending(){
	
	ctx.save();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = black;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.restore();

	GameOver = new Button('Game Over!');
	PlayAgain = new Button('Play Again', 'restart');

	GameOver.draw(red, 2, 1);
	PlayAgain.draw(green, 2, 2);
	// else{
	// 	window.cancelAnimationFrame(raf);
	// 	// gameOver = false;
	// 	ctx.fillStyle = 'rgba(200, 200, 200, 1)';
	// 	// ctx.clearRect(0, 0, canvas.width, canvas.height);
	// 	ctx.fillRect(0, 0, canvas.width, canvas.height);
	// 	var text = 'Game Over!';
	// 	ctx.font = '400 40px Kremlin Pro Web';
	// 	var textWidth = ctx.measureText(text).width;
	// 	var x = canvas.width/2 - textWidth/2;
	// 	ctx.fillStyle = 'rgba(250, 250, 250, 0.6)';
	// 	ctx.fillRect(x, 150, textWidth, 50);
	// 	ctx.fillStyle = 'rgba(250, 50, 50, 1)';			    	
	// 	ctx.fillText(text, x, 190);

	// 	playAgain.draw();
				
	// 	ctx.restore();
	// }
				
}
			

function drawBackground(){
	
	var backgroundBalls = 'rgba(10, 10, 10, 0.4)';		
				
	ctx.save();
	ctx.fillStyle = black;
	ctx.fillRect(0, 0, canvas.width, 340);

	ctx.fillRect(0, 460, canvas.width, 40);

	ctx.fillRect(0, 340, 90, 120);

	ctx.fillRect(210, 340, 90, 160);

	ctx.fillStyle = backgroundBalls;
	ctx.fillRect(90, 340, 120, 120);

	ctx.restore();
}

function circleCollidesRectangle(Circle, Rectangle){
	var cx = Circle.x;
	var cy = Circle.y;
	var cr = Circle.radius;
	var rx = Rectangle.x;
	var ry = Rectangle.y;
	var rw = Rectangle.width;
	var rh = Rectangle.height;

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


