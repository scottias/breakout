BreakoutGame.update = (function(render){

	let keyState = {};

	function initialize(data) {
		window.addEventListener('keydown',function(e){
		    keyState[e.keyCode || e.which] = true;
		},true);
		window.addEventListener('keyup',function(e){
		    keyState[e.keyCode || e.which] = false;
		},true);
	}

	function run(data) {
		BreakoutGame.score = data.score;
		if(data.countdown > 0){
			data.countdown -= data.elapsedTime;
		}
		else{
			processInput(data);
			for(let i = 0; i < data.balls.length; i++){
				checkCollisions(data, data.balls[i]);
				moveBall(data.balls[i], data);
				isItDead(data, data.balls[i]);
			}
		}
	}

	function isItDead(data, ball){
		if((ball.y - ball.radius > data.canvasHeight + 50 || 
			ball.x - ball.radius > data.canvasWidth + 50 || 
			ball.x + ball.radius < 0)  && !data.dead){
			ball.dead = true;
			let allDead = true;
			for(let i = 0; i < data.balls.length; i++){
				if(!data.balls[i].dead){
					allDead = false;
					break;
				}
			}
			if(allDead){
				data.dead = true;
				data.lives += -1;
				if(data.lives <= 0){
					data.over = true;
					document.getElementById("score-input").style.display = "inline-block";
				}
			}
		}

	}

	function processInput(data) {
		movePaddle(keyState, data, data.paddle);
	}

	function movePaddle(keyCode, data, paddle) {
		if (keyCode[KeyEvent.DOM_VK_RIGHT] && (paddle.x + paddle.width) < data.canvasWidth - 5) {
			paddle.x += (paddle.speed /** (data.elapsedTime / 1000)*/);
		}
		if (keyCode[KeyEvent.DOM_VK_LEFT] && paddle.x > 5) {
			paddle.x -= (paddle.speed /** (data.elapsedTime / 1000)*/);
		}
	}

	function moveBall(ball, data){
		ball.x += ball.dx * ball.speed;
		ball.y += ball.dy * ball.speed;
	}

	function checkCollisions(data, ball){
		for(let i = 0; i < data.walls.length; i++){
			collision(ball, data.walls[i]);
		}
		for(let i = 0; i < data.bricks.length; i++){
			for(let j = 0; j < data.bricks[i].length; j++){
				if(data.bricks[i][j].status && collision(ball, data.bricks[i][j])){
					data.bricks[i][j].status = false;
					changeBallSpeed(data);
					halvePaddle(i, data);
					updateScore(data, data.bricks[i][j].color, i);
					createParticleSystem(data, data.bricks[i][j]);
				}
			}
		}
		if(collision(ball, data.paddle)){
			paddleBounce(ball, data.paddle);
		}
	}

	function createParticleSystem(data, brick){
		data.systems.push(ParticleSystem( {
			image : "textures/" + brick.color + ".png",
			center: {x: brick.x + brick.width / 2, 
					 y: brick.y + brick.height / 2},
			speed: {mean: 35, stdev: 5},
			lifetime: {mean: 1, stdev: 0.1},
			maxParticles : 15
		}, 
		render));
	}

	function halvePaddle(row, data){
		if(row === 0 && !data.paddleHalved){
			data.paddleHalved = true;
			data.paddle.width = data.paddle.width / 2;
			data.paddle.x = data.paddle.x + data.paddle.width / 2;
		}
	}

	function changeBallSpeed(data){
		data.bricksDestroyed += 1;
		for(let i = 0; i < data.balls.length; i++){
			switch(data.bricksDestroyed){
				case 4:
					data.balls[i].speed += 1;
					break;
				case 12:
					data.balls[i].speed += 1;
					break;
				case 36:
					data.balls[i].speed += 1;
					break;
				case 62:
					data.balls[i].speed += 1;
					break;	
			}
		}
	}

	function updateScore(data, color, rowNum){
		switch(color){
			case "yellow":
				data.score += 1;
				data.hundred += 1;
				break;
			case "orange":
				data.score += 2;
				data.hundred += 2;
				break;
			case "blue":
				data.score += 3;
				data.hundred += 3;
				break;
			case "green":
				data.score += 5;
				data.hundred += 5;
				break;	
		}
		let rowGone = true;
		for(let i = 0; i < data.bricks[0].length; i++){
			if(data.bricks[rowNum][i].status){
				rowGone = false;
				break;
			}
		}
		if(rowGone){
			data.score += 25;
			data.hundred += 25;
		}
		if(data.hundred >= 100){
			data.hundred = data.hundred - 100;
			newBall(data);
		}
		if(data.score >= 552){
			data.over = true;
			document.getElementById("score-input").style.display = "inline-block";
		}
	}

	function newBall(data){
		data.balls.push({
			x: data.paddle.x + data.paddle.width / 2, 
			y: 530,
			radius : 12,
			dx : (Math.random() < 0.5 ? -1 : 1) * 0.393919,
			dy : -0.919145,
			speed : data.balls[0].speed,
			dead : false
		})
	}

	function paddleBounce(ball, paddle){
		ball.dx = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
		let normal = normalize(ball.dx, ball.dy);
		ball.dx = normal.dx;
		ball.dy = normal.dy;
	}

	function normalize(dx, dy){
		let newDx = dx / (Math.sqrt(dx * dx + dy * dy));
		let newDy = dy / (Math.sqrt(dx * dx + dy * dy));
		return {dx : newDx, dy : newDy};
	}

	function collision(ball, box){
		let botBox = {
			x : ball.x - ball.radius * (1/3),
			y : ball.y + ball.radius * (1/3),
			width : ball.radius * (2/3),
			height : ball.radius * (2/3)
		}
		let topBox = {
			x : ball.x - ball.radius * (1/3),
			y : ball.y - ball.radius,
			width : ball.radius * (2/3),
			height : ball.radius * (2/3)
		}
		let rightBox = {
			x : ball.x + ball.radius * (1/3),
			y : ball.y - ball.radius * (1/3),
			width : ball.radius * (2/3),
			height : ball.radius * (2/3)
		}
		let leftBox = {
			x : ball.x - ball.radius,
			y : ball.y - ball.radius * (1/3),
			width : ball.radius * (2/3),
			height : ball.radius * (2/3)
		}

		if(boxCollision(box, botBox)){
			ball.y = box.y - ball.radius;
			ball.dy = -ball.dy; 
			return true;
		}
		if(boxCollision(box, topBox)){
			ball.y = box.y + box.height + ball.radius;
			ball.dy = -ball.dy;
			return true;
		}
		if(boxCollision(box, rightBox)){
			ball.x = box.x - ball.radius;
			ball.dx = -ball.dx;
			return true;
		}
		if(boxCollision(box, leftBox)){
			ball.x = box.x + box.width + ball.radius;
			ball.dx = -ball.dx;
			return true;
		}
		return false;
	}

	function boxCollision(box1, box2) {
		if (box1.x < box2.x + box2.width &&
			box1.x + box1.width > box2.x &&
			box1.y < box2.y + box2.height &&
			box1.height + box1.y > box2.y) {
				return true;
		}
		return false;
	}

	return {
		initialize : initialize,
		run : run
	};

}(BreakoutGame.render));


//------------------------------------------------------------------
//
// Source: http://stackoverflow.com/questions/1465374/javascript-event-keycode-constants
//
//------------------------------------------------------------------
if (typeof KeyEvent === 'undefined') {
	var KeyEvent = {
		DOM_VK_CANCEL: 3,
		DOM_VK_HELP: 6,
		DOM_VK_BACK_SPACE: 8,
		DOM_VK_TAB: 9,
		DOM_VK_CLEAR: 12,
		DOM_VK_RETURN: 13,
		DOM_VK_ENTER: 14,
		DOM_VK_SHIFT: 16,
		DOM_VK_CONTROL: 17,
		DOM_VK_ALT: 18,
		DOM_VK_PAUSE: 19,
		DOM_VK_CAPS_LOCK: 20,
		DOM_VK_ESCAPE: 27,
		DOM_VK_SPACE: 32,
		DOM_VK_PAGE_UP: 33,
		DOM_VK_PAGE_DOWN: 34,
		DOM_VK_END: 35,
		DOM_VK_HOME: 36,
		DOM_VK_LEFT: 37,
		DOM_VK_UP: 38,
		DOM_VK_RIGHT: 39,
		DOM_VK_DOWN: 40,
		DOM_VK_PRINTSCREEN: 44,
		DOM_VK_INSERT: 45,
		DOM_VK_DELETE: 46,
		DOM_VK_0: 48,
		DOM_VK_1: 49,
		DOM_VK_2: 50,
		DOM_VK_3: 51,
		DOM_VK_4: 52,
		DOM_VK_5: 53,
		DOM_VK_6: 54,
		DOM_VK_7: 55,
		DOM_VK_8: 56,
		DOM_VK_9: 57,
		DOM_VK_SEMICOLON: 59,
		DOM_VK_EQUALS: 61,
		DOM_VK_A: 65,
		DOM_VK_B: 66,
		DOM_VK_C: 67,
		DOM_VK_D: 68,
		DOM_VK_E: 69,
		DOM_VK_F: 70,
		DOM_VK_G: 71,
		DOM_VK_H: 72,
		DOM_VK_I: 73,
		DOM_VK_J: 74,
		DOM_VK_K: 75,
		DOM_VK_L: 76,
		DOM_VK_M: 77,
		DOM_VK_N: 78,
		DOM_VK_O: 79,
		DOM_VK_P: 80,
		DOM_VK_Q: 81,
		DOM_VK_R: 82,
		DOM_VK_S: 83,
		DOM_VK_T: 84,
		DOM_VK_U: 85,
		DOM_VK_V: 86,
		DOM_VK_W: 87,
		DOM_VK_X: 88,
		DOM_VK_Y: 89,
		DOM_VK_Z: 90,
		DOM_VK_CONTEXT_MENU: 93,
		DOM_VK_NUMPAD0: 96,
		DOM_VK_NUMPAD1: 97,
		DOM_VK_NUMPAD2: 98,
		DOM_VK_NUMPAD3: 99,
		DOM_VK_NUMPAD4: 100,
		DOM_VK_NUMPAD5: 101,
		DOM_VK_NUMPAD6: 102,
		DOM_VK_NUMPAD7: 103,
		DOM_VK_NUMPAD8: 104,
		DOM_VK_NUMPAD9: 105,
		DOM_VK_MULTIPLY: 106,
		DOM_VK_ADD: 107,
		DOM_VK_SEPARATOR: 108,
		DOM_VK_SUBTRACT: 109,
		DOM_VK_DECIMAL: 110,
		DOM_VK_DIVIDE: 111,
		DOM_VK_F1: 112,
		DOM_VK_F2: 113,
		DOM_VK_F3: 114,
		DOM_VK_F4: 115,
		DOM_VK_F5: 116,
		DOM_VK_F6: 117,
		DOM_VK_F7: 118,
		DOM_VK_F8: 119,
		DOM_VK_F9: 120,
		DOM_VK_F10: 121,
		DOM_VK_F11: 122,
		DOM_VK_F12: 123,
		DOM_VK_F13: 124,
		DOM_VK_F14: 125,
		DOM_VK_F15: 126,
		DOM_VK_F16: 127,
		DOM_VK_F17: 128,
		DOM_VK_F18: 129,
		DOM_VK_F19: 130,
		DOM_VK_F20: 131,
		DOM_VK_F21: 132,
		DOM_VK_F22: 133,
		DOM_VK_F23: 134,
		DOM_VK_F24: 135,
		DOM_VK_NUM_LOCK: 144,
		DOM_VK_SCROLL_LOCK: 145,
		DOM_VK_COMMA: 188,
		DOM_VK_PERIOD: 190,
		DOM_VK_SLASH: 191,
		DOM_VK_BACK_QUOTE: 192,
		DOM_VK_OPEN_BRACKET: 219,
		DOM_VK_BACK_SLASH: 220,
		DOM_VK_CLOSE_BRACKET: 221,
		DOM_VK_QUOTE: 222,
		DOM_VK_META: 224
	};
}
