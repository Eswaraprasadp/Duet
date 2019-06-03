var canvas, raf, ctx, clock = true, theta = 0, bricks = [], gameOver = false, flag = false;
var noOfBricksPassed = 0, score = 0, maxBricks = 1, scoreInteger = 0, landmarkBricks = 5, landmarkScoreForSpeed = 1, speed = 3;
var blue = 'rgba(100, 100, 255, 1)', pink = 'rgba(255, 100, 100, 1)', red = 'rgba(250, 50, 50, 0.9)', green = 'rgba(50, 250, 50, 0.9)';
var backgroundGray = 'rgba(200, 200, 200, 0.9)';
var scoreText;
var noOfBricksAlive = 0;

function init(){
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	scoreText = document.getElementById("score-text");

	document.addEventListener("keydown", arrowControl);

	// console.log("Reached inside start()");
	// draw();
	raf = window.requestAnimationFrame(draw);
	
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

		var color = 'rgb(' + Math.floor(Math.random()*255) + ',' + Math.floor(Math.random()*255) + ',' + Math.floor(Math.random()*255) + ')';
		super('rectangle', color);
		this.color = color;
		if(Math.random() < 0.50){
			this.width = 60;
			this.height = 40;

		}
		else{
			this.width = 40;
			this.height = 60;
		}
		this.x = Math.random()*200 + 50 - this.width/2;
		this.y = 5;
		this.vy = 3;
		this.alive = true;
		// draw();

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
	draw(backGroundColor, noOfButtons = 1, number = 1){
		if(noOfButtons == 1)
			this.y = canvas.height/2 - this.height/2;
		else
			this.y = canvas.height/2 - this.height/2 + (2*number - (noOfButtons + 1)) * this.height * 3 / 2;
		ctx.fillStyle = 'rgba(250, 250, 250, 0.6)';
		ctx.fillRect(this.x, this.y, this.width, this.height);

		ctx.fillStyle = backGroundColor;

		ctx.fillText(this.text, this.x, this.y + this.height - 10);
		ctx.restore();

		if(this.restart){
			document.addEventListener('click', this.click.bind(this));
		}
		// else{
			
		// }

	}

	click(e){
		
		if(isInside(getMousePos(canvas, e), this)){
			
			if(gameOver && this.restart){
				document.removeEventListener('click', this.click);
				restart();
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

function restart(){
	
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// bricks.length = 0;
	theta = 0;
	landMark = 5;
	maxBricks = 1;
	noOfBricksAlive = 0;

	gameOver = false;
	score = 0;
	scoreInteger = 0;
	landmarkBricks = 5;
	landmarkScoreForSpeed = 1;
	speed = 3;

	document.addEventListener("keydown", arrowControl);

	raf = window.requestAnimationFrame(draw);
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
// var ballBlue = {
// 	x: 0,
// 	y: 0, 
// 	radius: 10,
// 	v: 20,
				
// 	color: 'rgba(100, 100, 255, 1)',
// 	draw: function(){
// 		ctx.beginPath();
		// ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
		// ctx.closePath();
		// ctx.fillStyle = this.color;
		// ctx.fill();
// 					// console.log("Blue ball is drawn");
// 	}
// }
// var ballPink = {
// 	x: 0,
// 	y: 0, 
// 	radius: 10,
// 	v: 20,
// 	color: 'rgba(255, 100, 100, 1)',
// 	draw: function(){
// 		ctx.beginPath();
// 		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
// 		ctx.closePath();
// 		ctx.fillStyle = this.color;
// 		ctx.fill();
// 		// console.log("Pink ball is drawn");
// 	}
// }
// var brick = {
// 	x: 200,
// 	y: 5,
// 	width: 80,
// 	height: 40,
// 	vy: 3,
// 	color: 'rgb(0, 0, 0)',
// 	draw: function(){
// 		ctx.fillStyle = this.color;
// 		ctx.fillRect(this.x, this.y, this.width, this.height);
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

	rishav.draw(150, 400, 50);
	phoebe.draw(150, 400, 50);

	score += 1/100;

	console.log('Score : ' + Math.floor(score));
	if(score >= (scoreInteger + 1)){
		// console.log('Inside setting, Score : ' + score);
		scoreText.innerHTML = "Score : " + Math.floor(score);
		++scoreInteger;
	}
	var deletedBrick;

	if(score >= landmarkBricks){
		landmarkBricks += 5;
		++maxBricks;
	}
	if(score >= landmarkScoreForSpeed){
		console.log("landmarkScoreForSpeed : " + landmarkScoreForSpeed + " Reached");
		speed += 0.1;
		bricks.forEach(function(brick, index){
			console.log("Entered for brick : " + (index + 1));
			brick.updateToSpeed(speed);
			console.log("Speed updated to : " + brick.vy.toFixed(2) + " for brick : " + (index + 1));
		});
		landmarkScoreForSpeed += 1;
	}
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
		}
		else if(noOfBricksAlive == 0){
			bricks.push(new Brick());
			++noOfBricksAlive;
			// console.log("Since noOfBricksAlive is 0, noOfBricksAlive was incremented to " + noOfBricksAlive);
		}			
		
	}
	// console.log("bricks[0].isAlive() : " + bricks[0].isAlive());
	if(!bricks[0].isAlive()){
		deletedBrick = bricks.splice(0, 1);
		--noOfBricksAlive;
		console.log("One brick deleted");
		flag = true;
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
	// if(!gameOver){
	// 		// gameOver = false;
			
	// 		bricks.forEach(function(brick, index){
	// 			console.log("Brick number : " + index);
			
	// 			// bricks[i].draw();
	// 			if(brick.isAlive()){
	// 				brick.update();
	// 				brick.draw();
	// 			}
	// 			else{
	// 				var dummyBrick = bricks.pop(brick);
	// 				console.log("Bricks length : " + bricks.length / Object.keys(bricks).length);
	// 				--noOfBricksAlive;
	// 			}
			
	// 			if(circleCollidesRectangle(rishav, brick) || circleCollidesRectangle(phoebe, brick)){
	// 				gameOver = true;
	// 				ending();
	// 			}
	// 			else{
	
	// 				raf = window.requestAnimationFrame(draw);
	// 			}
	// 		})
			
	// }
	
}
function ending(){
	bricks = [];
	noOfBricksAlive = 0;
	document.removeEventListener("keydown", arrowControl);
	console.log("Inside ending and animation canceled");
	ctx.save();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = backgroundGray;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	GameOver = new Button('Game Over!');
	PlayAgain = new Button('Play Again', 'restart');

	GameOver.draw(red, 2, 1);
	PlayAgain.draw(green, 2, 2);
}

	
	// if(!attacking){
	// 	rand = Math.random();
	// 		if(rand < 0.50){
	// 			brick.width = 60;
	// 			brick.height = 40;
	// 		}
	// 		else{
	// 			brick.width = 40;
	// 			brick.height = 60;
	// 		}
	// 	brick.x = Math.random()*200 + 50 - brick.width/2;
	// 	brick.color = 'rgb(' + Math.floor(Math.random()*255) + ',' + Math.floor(Math.random()*255) + ',' + Math.floor(Math.random()*255) + ')';
	// 	// console.log("New brick created with color " + brick.color);
	// 	attacking = true;
								
			
	// }
	// else if(brick.y + brick.vy + brick.height/2 >= 500){
	// 	brick.y = 5;
	// 	attacking = false;
					
	// }
	// if(ballBlueCollidesRectangle() || ballPinkCollidesRectangle()){
	// 	gameOver = true;
	// 	console.log("Game Over!");
	// }
	// if(!gameOver){
		// brick.draw();
		// brick.y += brick.vy;
			
		// console.log("Ball Blue collides brick? : " + ballBlueCollidesRectangle());
		// console.log("Ball Pink collides brick? : " + ballPinkCollidesRectangle());
		// raf = window.requestAnimationFrame(draw);
	// }
	// else{
	// 	window.cancelAnimationFrame(raf);
	// 	// gameOver = false;
	// 	ctx.fillStyle = 'rgba(75, 75, 75, 1)';
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
				

function drawBackground(){
	
	var backgroundBalls = 'rgba(200, 200, 200, 0.4)';		
				
	ctx.save();
	ctx.fillStyle = backgroundGray;
	ctx.fillRect(0, 0, canvas.width, 340);

	ctx.fillRect(0, 460, canvas.width, 40);

	ctx.fillRect(0, 340, 90, 120);

	ctx.fillRect(210, 340, 90, 160);

	ctx.fillStyle = backgroundBalls;
	ctx.fillRect(90, 340, 120, 120);

	ctx.restore();
}
// function ballBlueCollidesRectangle(){
// 	var cx = 150 + 50 * Math.cos(theta);
// 	var cy = 400 - 50 * Math.sin(theta);
// 	var cr = 10;
// 	var rx = brick.x;
// 	var ry = brick.y;
// 	var rw = brick.width;
// 	var rh = brick.height;

// 	var distX = Math.abs(cx - rx - rw / 2);
// 	var distY = Math.abs(cy - ry - rh / 2);

// 	if (distX > (rw / 2 + cr)) {
// 	   return false;
// 	}
// 	if (distY > (rh / 2 + cr)) {
// 	   return false;
// 	}

// 	if (distX <= (rw / 2)) {
// 	   return true;
// 	}
// 	if (distY <= (rh / 2)) {
// 	   return true;
// 	}

// 	var dx = distX - rw / 2;
// 	var dy = distY - rh / 2;
// 	return (dx * dx + dy * dy <= (cr * cr));
// }
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
// function ballPinkCollidesRectangle(){
// 	var cx = 150 - 50 * Math.cos(theta);
// 	var cy = 400 + 50 * Math.sin(theta);
// 	var cr = 10;
// 	var rx = brick.x;
// 	var ry = brick.y;
// 	var rw = brick.width;
// 	var rh = brick.height;

// 	var distX = Math.abs(cx - rx - rw / 2);
// 	var distY = Math.abs(cy - ry - rh / 2);

// 	if (distX > (rw / 2 + cr)) {
// 	   return false;
// 	}
// 	if (distY > (rh / 2 + cr)) {
// 	   return false;
// 	}

//    if (distX <= (rw / 2)) {
// 	   return true;
// 	}
// 	if (distY <= (rh / 2)) {
// 	   return true;
// 	}

// 	var dx = distX - rw / 2;
// 	var dy = distY - rh / 2;
// 	return (dx * dx + dy * dy <= (cr * cr));				
// }

