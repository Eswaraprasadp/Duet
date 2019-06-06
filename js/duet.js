var canvas, raf, ctx, clock, theta, bricks = [], gameOver = false, flags, attatched, canAttatch, canSeperate, attatchedX, attatchedY, timeAttatched, affection;
var centerRadius;
var noOfBricksPassed, score, maxBricks, landmarkScoreForBricks, landmarkScoreForSpeed, landmarkScoreForAttatchment, landmarkBricks, savedLandmarkScore, savedLandmarkBricks, speed;
var blue = 'rgba(100, 100, 255, 1)', pink = 'rgba(255, 100, 100, 1)', red = 'rgba(250, 50, 50, 0.9)', green = 'rgba(50, 250, 50, 0.9)';
var gray = 'rgba(200, 200, 200, 0.9)', white = 'rgba(250, 250, 250, 0.9)', black = 'rgba(10, 10, 10, 0.8)', magenta = 'rgba(127, 0, 127, 0.9)';
var scoreText;
var noOfBricksAlive;
var singlePlayer = true;
var name, playerAName, playerBName, canStart = false;
var playerNumber = 2, playerRank = 2, scoreHistory = [[1, 1, 'noobmaster69', Infinity]];
var pauseButton, resumeButton, paused = false, started = false, ended = false, turnA;
var Start, Restart, PlayAgain, Play, GameOver, Name, PlayerA, PlayerB, Duet;

function load(){
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	scoreText = document.getElementById("score-text");
	affectionMeter = document.getElementById("affection-meter");
	singlePlayerDiv = document.getElementById("single-player-div");
	multiPlayerDiv = document.getElementById("multi-player-div");
	scoreboard = document.getElementById("scoreboard");	
	pauseButton = document.getElementById("pause-button");
	resumeButton = document.getElementById("resume-button");

	ctx.save();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = gray;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.restore();

	Start = new Button('Start!', 'start');
	Start.draw(green);
	// raf = window.requestAnimationFrame(draw);
	
}
function submit(){
	canStart = false;
	if(!started || ended){
		if(ended){
			if(PlayAgain)
				if(PlayAgain.drew)
					PlayAgain.clear();
			if(Play)
				if(Play.drew)
					Play.clear();
			if(GameOver)
				if(GameOver.drew)
					GameOver.clear();

			Restart = new Button("Start", 'restart');
			Restart.draw(green);
		}
		if(singlePlayer){
			if(PlayerA)
				if(PlayerA.drew)
					PlayerA.clear();

			if(PlayerB)
				if(PlayerB.drew)
					PlayerB.clear();

			name = document.getElementById("name").value;
			if(name != "" && name != null){
				canStart = true;
				Name = new Button(name);
				Duet = new Button("Duet");
				Name.draw(black, 3, 1);
				Duet.draw(black, 3, 3);
			}
		}
		else{
			turnA = true;
			playerAName = document.getElementById("player-A-name").value;
			playerBName = document.getElementById("player-B-name").value;

			if(playerAName != "" && playerBName != "" && playerAName != null && playerBName != null){
				canStart = true;
				if(Name)
					if(Name.drew)
						Name.clear();
				if(Duet)
					if(Duet.drew)
						Duet.clear();		

				PlayerA = new Button("► " + playerAName);
				PlayerB = new Button(playerBName);
				PlayerA.draw(black, 3, 1);
				PlayerB.draw(black, 3, 3);
			}
		}
	}
}
function start(){

	console.log("In start");
	init();
	raf = window.requestAnimationFrame(draw);
}
function restart(){
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	var prevName = scoreboard.rows[playerRank].cells[1].innerHTML;
	console.log("Previous name in scoreboard is : " + prevName);
	scoreboard.rows[playerRank].cells[1].innerHTML = prevName.slice(0, -1);
	++playerNumber;
	playerRank = playerNumber;
	
	init();
	raf = window.requestAnimationFrame(draw);
}
function pause(){
	if(started){
		window.cancelAnimationFrame(raf);
		paused = true;
		pauseButton.disabled = true;
		resumeButton.disabled = false;
		console.log("Paused");
	}
}
function resume(){
	if(started && paused){
		paused = false;
		pauseButton.disabled = false;
		resumeButton.disabled = true;
		console.log("Resumed");
		raf = window.requestAnimationFrame(draw);
	}
}
function init(){
	started = true;

	theta = 0;
	centerRadius = 58;
	attatched = false;
	canAttatch = false;
	canSeperate = false;
	maxBricks = 1;
	affection = 0;
	attatchedY = 400;
	attatchedX = 150;
	timeAttatched = 0;
	affectionMeter.setAttribute("value", 0);

	noOfBricksAlive = 0;
	noOfBricksPassed = 0;

	bricks = [];
	noOfBricksAlive = 0;

	gameOver = false;
	score = 0;
	landmarkScoreForBricks = 4;
	landmarkScoreForSpeed = 2;
	landmarkScoreForAttatchment = 3;
	landmarkBricks = 3;
	savedLandmarkScore = 0;
	savedLandmarkBricks = 0;
	speed = 3;

	clock = true;
	flags = [true, true];

	var newRow = document.createElement("tr");

	var newRank = document.createElement("td");
	var newName = document.createElement("td");
	var newScore = document.createElement("td");

	newRank.innerHTML = playerRank;	
	newScore.innerHTML = score;

	if(singlePlayer){
		newName.innerHTML =  name + '*';
		scoreHistory.push([playerNumber, playerRank, name, score]);
	}
	else{
		if(turnA){
			newName.innerHTML = playerAName + '*';
			scoreHistory.push([playerNumber, playerRank, playerAName, score]);			
		}
		else{
			newName.innerHTML = playerBName + '*';
			scoreHistory.push([playerNumber, playerRank, playerBName, score]);					
		}
	}

	newRow.appendChild(newRank);
	newRow.appendChild(newName);
	newRow.appendChild(newScore);	

	scoreboard.appendChild(newRow);

	document.addEventListener("keydown", arrowControl);
}
function toggleButton(id){
	switch(id){
		case 1: singlePlayer = true;
			singlePlayerDiv.style.display = "block";
			multiPlayerDiv.style.display = "none";
			break;
		case 2: singlePlayer = false;
			singlePlayerDiv.style.display = "none";
			multiPlayerDiv.style.display = "block";
			break;
		default: console.log("id is not either 1 or 2 in toggleButton"); break;
	}
}
class Ball{
	constructor(color, positive){
		this.color = color;
		this.x = 0;
		this.y = 0;
		this.radius = 10;
		this.positive = positive;
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
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.restore();
	}
	hide(text){
		console.log("Inside hide for " + text);
		ctx.clearRect(this.x - this.radius, this.y -  this.radius, 2 * this.radius, 2 * this.radius);
		ctx.save();
		ctx.fillStyle = gray;
		ctx.fillRect(this.x - this.radius, this.y -  this.radius, 2 * this.radius, 2 * this.radius);
		ctx.restore();
	}
}
class AttachedBall extends Ball{
	constructor(color, color1, color2){
		super(color, true);
		this.color1 = color1;
		this.color2 = color2;
	}
	draw(x, y){
		ctx.save();
		this.x = x;
		this.y = y;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, Math.PI/2, 3*Math.PI/2, true);
		ctx.closePath();
		ctx.fillStyle = this.color1;
		ctx.fill();
		ctx.save();
		ctx.restore();
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, Math.PI/2, 3*Math.PI/2, false);
		ctx.closePath();
		ctx.fillStyle = this.color2;
		ctx.fill();
		console.log("AttachedBall was drawn!");
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

		ctx.save();
		this.text = text;

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
	
		// ctx.clearRect(this.x, this.y, this.width, this.height);
		// ctx.clearRect(0, this.y, canvas.width, this.height);
		ctx.fillStyle = gray;
		ctx.fillRect(0, this.y, canvas.width, this.height);
		if(noOfButtons == 1)
			this.y = canvas.height/2 - this.height/2;
		else
			this.y = canvas.height/2 - this.height/2 + (2*number - (noOfButtons + 1)) * this.height * 3 / 2;
		if(this.start || this.restart)
			ctx.fillStyle = white;
		else
			ctx.fillStyle = gray;
		ctx.clearRect(this.x, this.y, this.width, this.height);		
		ctx.fillRect(this.x, this.y, this.width, this.height);

		ctx.fillStyle = color;

		ctx.fillText(this.text, this.x, this.y + this.height - 10);
		ctx.restore();

		this.drew = true;

		if(this.restart || this.start){
			this.clickEventListenerBind = this.click.bind(this);
			document.addEventListener('click', this.clickEventListenerBind, true);
		}		
	}
	clear(){
		ctx.clearRect(this.x, this.y, this.width, this.height);
		ctx.save();
		ctx.fillStyle = gray;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.restore();
	}
	click(e){
		
		if(isInside(getMousePos(canvas, e), this)){
			
			if(gameOver && this.restart){
				if(canStart){
					document.removeEventListener('click', this.clickEventListenerBind, true);
					restart();
				}
				else{
					alert("Please enter your name before starting game");
				}
			}
			else if(this.start){
				if(canStart){
					document.removeEventListener('click', this.clickEventListenerBind, true);
					start();
				}
				else{
					alert("Please enter your name before starting game");
				}
			}
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

function arrowControl(e) {
	var code = e.keyCode ? e.keyCode : e.which;
	if (code === 37) { //left key
		console.log("Left key pressed");
		if(!attatched){
			theta += Math.PI/10;
			clock = false;
		}
		else{
			console.log("attatched = true in left key press");
			if(attatchedX > 0){
				attatchedX -= 10;
				console.log("attatchedX : " + attatchedX);
			}
		}
	}
	else if (code === 39) {
		console.log("Right key pressed");
		if(!attatched){
			theta -= Math.PI/10; //right key
			clock = true;
		}
		else{
			console.log("attatched = true in right key press");
			if(attatchedX < canvas.width){
				attatchedX += 10;
				console.log("attatchedX : " + attatchedX);
			}
		}
	}
};

function draw(){

	
	drawBackground();

	rishav = new Ball(blue, true);
	phoebe = new Ball(pink, false);

	if(!attatched){
		rishav.draw(150, 400, centerRadius);
		phoebe.draw(150, 400, centerRadius);
	}
	else{
		Attatched.draw(attatchedX, attatchedY);
	}

	score += 1/100;
	scoreText.innerHTML = "Score : " + Math.floor(score);
	if(flags[1]){
		console.log("scoreHistory is : " + scoreHistory);
		flags[1] = false;		
	}

	affection = (score - savedLandmarkScore) / landmarkScoreForAttatchment * 50 + (noOfBricksPassed - savedLandmarkBricks) / landmarkBricks * 50;
	affectionMeter.setAttribute("value", affection);

	scoreHistory[playerRank - 1][3] = Math.floor(score);

	// console.log("Score is greater in scoreHistory ?: " + (score >= scoreHistory[playerNumber - 1][2]));
	if(score >= scoreHistory[playerRank - 2][3]){
		console.log("Current score was greater than previous score");
		swapScoreHistory(playerRank - 1, playerRank - 2);	
		swapTableTexts(playerRank, playerRank - 1);
		--playerRank;
	}
	scoreboard.rows[playerRank].cells[2].innerHTML = Math.floor(score);

	// console.log('Score : ' + Math.floor(score));
	if(flags[0]){
		// console.log('Bricks Passed : ' + noOfBricksPassed);
		flags[0] = false;
	}
	
	var deletedBrick;

	if(score >= landmarkScoreForBricks){
		landmarkScoreForBricks += 5;
		++maxBricks;
	}
	if(score >= landmarkScoreForSpeed){
		// console.log("landmarkScoreForSpeed : " + landmarkScoreForSpeed + " Reached");
		// flags[1] = false;
		speed += 0.1;
		landmarkScoreForSpeed += 1;
	}
	// console.log("affection = " + affection);
	if(affection >= 100){
		console.log("affection = 100 reached");
		Attatched = new AttachedBall(magenta, blue, pink);
		canAttatch = true;
		timeAttatched = 0;
		savedLandmarkScore = landmarkScoreForAttatchment;
		savedLandmarkBricks = landmarkBricks;
		landmarkScoreForAttatchment += 10;
		landmarkBricks += 10;
	}
	if(canAttatch){
		if(centerRadius > 0 && !attatched){
			--centerRadius;
		}
		else if(!attatched){
		rishav.hide("rishav");
		phoebe.hide("phoebe");
		Attatched.draw(attatchedX, attatchedY);
		attatched = true;
		}
		else if(timeAttatched < 200 && attatched){
			++timeAttatched;
			console.log("Time attatched : " + timeAttatched);
		}
		else if(attatched){
			console.log("Time attatched >= 200");
			attatched = false;
			canSeperate = true;
			canAttatch = false;
			timeAttatched = 0;
			Attatched.hide("Attatched");
			console.log("Attatchment ended");
		}
	}
	if(canSeperate){
		if(centerRadius < 58){
			++centerRadius;
		}
		else if(centerRadius == 58){
			canSeperate = false;
		}
	}

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
		// console.log("One brick deleted");
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
		if(!attatched){
			if((circleCollidesRectangle(rishav, brick) || circleCollidesRectangle(phoebe, brick))){
				window.cancelAnimationFrame(raf);
				gameOver = true;
				console.log("Game is Over!");
				ending();
			}
		}
		else{
			if(circleCollidesRectangle(Attatched, brick)){
				window.cancelAnimationFrame(raf);
				gameOver = true;
				console.log("Game is Over!");
				ending();				
			}
		}
		});
	
}
function ending(){
	
	ctx.save();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = gray;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.restore();

	started = false;
	ended =  true;

	console.log("noOfBricksPassed = " + noOfBricksPassed);

	// console.log("scoreHistory is : " + scoreHistory);

	if(singlePlayer){
		GameOver = new Button('Game Over!');
		PlayAgain = new Button('Play Again', 'restart');

		GameOver.draw(red, 2, 1);
		PlayAgain.draw(green, 2, 2);
	}
	else{

		GameOver = new Button('Game Over!');
		Play = new Button('Play', 'restart');
		
		if(turnA){
			console.log("A's turn is over");
			PlayerA = new Button(playerAName);
			PlayerB = new Button("► " + playerBName);
			turnA = false;
		}
		else{
			console.log("B's turn is over");
			PlayerA = new Button("► " + playerAName);
			PlayerB = new Button(playerBName);
			turnA = true;
		}

		GameOver.draw(red, 4, 1);
		PlayerA.draw(black, 4, 2);
		Play.draw(green, 4, 3);
		PlayerB.draw(black, 4, 4);
	}
				
}
			

function drawBackground(){
	
	var backgroundBalls = 'rgba(200, 200, 200, 0.4)';		
				
	ctx.save();
	ctx.fillStyle = gray;
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
function swapScoreHistory(i, j){
	var arr = [0, 2, 3];
	arr.forEach(function(value){
		[scoreHistory[i][value], scoreHistory [j][value]] = [scoreHistory[j][value], scoreHistory [i][value]];
	});
}
function swapTableTexts(i, j){
	var arr = [1, 2];
	arr.forEach(function(value){
		[scoreboard.rows[i].cells[value].innerHTML, scoreboard.rows[j].cells[value].innerHTML] = [scoreboard.rows[j].cells[value].innerHTML, scoreboard.rows[i].cells[value].innerHTML]	
	});
}


