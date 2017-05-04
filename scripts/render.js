BreakoutGame.render = (function(){
	
	let canvas = null;
	let context = null;

	function initialize(data) {
		canvas = document.getElementById('game-canvas');
		context = canvas.getContext('2d');

		CanvasRenderingContext2D.prototype.clear = function() {
			this.save();
			this.setTransform(1, 0, 0, 1, 0, 0);
			this.clearRect(0, 0, canvas.width, canvas.height);
			this.restore();
		};
	}
	
	function run(data){
		context.clear();
		for(let i = 0; i < data.walls.length; i++){
			drawRectangle(data.walls[i], "gray");
		}
		for(let i = 0; i < data.bricks.length; i++){
			for(let j = 0; j < data.bricks[i].length; j++){
				if(data.bricks[i][j].status){
					drawRectangle(data.bricks[i][j], data.bricks[i][j].color);
				}
			}
		}

		drawParticles(data.elapsedTime, data.systems)

		drawRectangle(data.paddle, "blue");
		for(let i = 0; i < data.balls.length; i++){
			drawBall(data.balls[i]);
		}
		displayScore(data.score);
		if(data.countdown > 0 && data.countdown < 3000){
			drawCountdown(data.countdown);
		}
		if(data.over){
			if(data.score >= 552){
				greatJob();
			}
			else{
				gameOver();
			}
		}
		else{
			drawLives(data.lives);
		}
	}

	function drawImage(spec) {
		context.save();
		
		context.translate(spec.center.x, spec.center.y);
		context.rotate(spec.rotation);
		context.translate(-spec.center.x, -spec.center.y);
		
		context.drawImage(
			spec.image, 
			spec.center.x - spec.size/2, 
			spec.center.y - spec.size/2,
			spec.size, spec.size);
		
		context.restore();
	}

	function displayScore(score){
		context.beginPath();
		context.font = "bold 50px Arial";
		context.fillStyle = "white";
		context.fillText(score, 20, 620);
		context.closePath();		
	}

	function drawLives(lives){
		for(let i = 0; i < lives - 1; i++){
			drawRectangle({x : 10 + i * 100, y : 10, width : 80, height : 10}, "blue")
		}
	}

	function drawCountdown(countdown){
		let number = Math.trunc((countdown / 1000) + 1);
		context.beginPath();
		context.font = "bold 100px Arial";
		context.fillStyle = "white";
		context.fillText(number, canvas.width / 2 - 20, canvas.height / 2 + 40);
		context.closePath();
	}

	function gameOver(){
		context.beginPath();
		context.font = "bold 100px Arial";
		context.fillStyle = "white";
		context.fillText("GAME OVER", canvas.width / 2 - 300, canvas.height / 2 + 40);
		context.closePath();
	}

	function greatJob(){
		context.beginPath();
		context.font = "bold 100px Arial";
		context.fillStyle = "white";
		context.fillText("GREAT JOB!", canvas.width / 2 - 300, canvas.height / 2 + 40);
		context.closePath();
	}

	function drawRectangle(rect, color){
		context.beginPath();
		context.rect(rect.x, rect.y, rect.width, rect.height);
		context.fillStyle = color;
		context.fill();
		context.closePath();
	}

	function drawBall(ball){
		context.beginPath();
		context.arc(ball.x, ball.y, ball.radius, 0, 2*Math.PI);
		context.fillStyle = "red";
		context.fill();
		context.closePath();
	}

	function drawParticles(elapsedTime, systems){
		for(var i = 0; i < systems.length; i++){
			systems[i].update(elapsedTime);
			systems[i].render();
			systems[i].create();
		}
	}  

	return {	
		initialize : initialize,
		run : run,
		drawImage : drawImage
	};

}());