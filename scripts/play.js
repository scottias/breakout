BreakoutGame.play = (function(update, render){

	let cancelNextRequest = false;
	let lastTimeStamp = performance.now();
	let previousTime = performance.now();
	let canvasWidth = document.getElementById('game-canvas').width;
	let canvasHeight = document.getElementById('game-canvas').height;
	let rows = 8;
	let cols = 16;
	let countdown = 3300;

	let data = {
		walls : [],
		bricks : [],
		paddle : {},
		balls : [],
		systems : []
	};

	function initialize(request) {	
		cancelNextRequest = request;
		newGameData();
		resetData();
		update.initialize(data);
		render.initialize(data);
		requestAnimationFrame(gameLoop);
	}

	function newGameData(){
		lastTimeStamp = performance.now();
		previousTime = performance.now();
		data.clock = 0;
		data.over = false;
		data.lives = 3;
		data.countdown = countdown;
		data.canvasWidth = canvasWidth;
		data.canvasHeight = canvasHeight;
		data.walls = [];
		data.bricks = [];
		data.balls = [];
		data.score = 0;
		makeBricks(data.bricks);
		data.hundred = 0;
	}

	function resetData(){
		data.countdown = countdown;
		data.dead = false;
		paddleWidth = 160;
		data.paddle = {
			x : data.canvasWidth / 2 - paddleWidth/2, 
			y : 550,
			width : paddleWidth,
			height : 10,
			speed : 12
		};
		data.balls = [];
		data.balls.push({
			x: data.paddle.x + data.paddle.width / 2, 
			y: 530,
			radius : 14,
			dx : (Math.random() < 0.5 ? -1 : 1) * 0.393919,
			dy : -0.919145,
			speed : 4.5,
			dead : false
		});
		data.walls = [];
		makeWalls(data.walls);
		data.bricksDestroyed = 0;
		data.paddleHalved = false;
		data.systems = [];
	}

	function makeWalls(walls){
		walls.push({x : 0, y : 30, width : canvasWidth, height : 5});
		walls.push({x : -45, y : 30, width : 50, height : canvasHeight});
		walls.push({x : canvasWidth - 5, y : 30, width : 50, height : canvasHeight});			
	}

	function makeBricks(bricks){
		let yPos = 0;
		let xPos = 0;
		for(let i = 0; i < rows; i++) {
			bricks[i] = [];
			yPos = 130 + i * 18;
			if (i < 2){
				color = "green";
			}
			else if (i < 4){
				color = "blue";
			}
			else if (i < 6){
				color = "orange";
			}
			else if (i < 8){
				color = "yellow";
			}
			for(let j = 0; j < cols; j++) {
				xPos = ((canvasWidth-10) / cols) * j + 8;
				bricks[i].push({x : xPos, y : yPos, width : ((canvasWidth-10) / cols) - 5, height : 14, status : true, color : color, image : "textures/" + color + ".png"});
			}	
		}
	}

	function gameLoop(time) {
		data.elapsedTime = time - previousTime;
		previousTime = time;
		data.clock = time - lastTimeStamp;

		if (!cancelNextRequest && !data.over) {
			update.run(data);
			render.run(data);
			if(data.dead){
				resetData();
			}
			requestAnimationFrame(gameLoop);
		}
	}

	return{
		initialize : initialize,
		gameLoop : gameLoop,
		scores : data.scores
	}

}(BreakoutGame.update, BreakoutGame.render));