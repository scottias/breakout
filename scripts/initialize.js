var BreakoutGame = {
	screens : {},
	persistence : (function () {
		'use strict';
		var highScores = {},
			previousScores = localStorage.getItem('BreakoutGame.highScores');
		if (previousScores !== null) {
			highScores = JSON.parse(previousScores);
		}

		function add(key, value) {
			highScores[key] = value;
			let keysSorted = Object.keys(highScores).sort(function(a,b){return highScores[b]-highScores[a]});
			keysSorted.splice(5);
			let sortedScores = {};
			for(let i = 0; i < keysSorted.length; i++){
				sortedScores[keysSorted[i]] = highScores[keysSorted[i]];
			}
			highScores = sortedScores;
			localStorage['BreakoutGame.highScores'] = JSON.stringify(highScores);
		}

		function remove(key) {
			delete highScores[key];
			localStorage['MyGame.highScores'] = JSON.stringify(highScores);
		}

		function removeAll() {
			var key;
			for (key in highScores) {
				delete highScores[key];
			}
			localStorage['BreakoutGame.highScores'] = JSON.stringify(highScores);
		}

		function report() {
			var highScoresNode = document.getElementById('high-scores-list'),
				namesNode = document.getElementById('names-list'),
				key;
			highScoresNode.innerHTML = "";
			namesNode.innerHTML = "";
			let keysSorted = Object.keys(highScores).sort(function(a,b){return highScores[b]-highScores[a]});
			keysSorted.splice(5);
			for (let i = 0; i < keysSorted.length; i++) {
				highScoresNode.innerHTML += ('<li>' + highScores[keysSorted[i]] + '</li>');
				namesNode.innerHTML += ('<li>' + keysSorted[i] + '</li>');
			}
		}

		return {
			add : add,
			removeAll : removeAll,
			report : report
		};
	}()),
	score : 0
};

BreakoutGame.game = (function(screens){

	function showScreen(id) {
		var screen = 0,
			active = null;

		active = document.getElementsByClassName('active');
		for (screen = 0; screen < active.length; screen++) {
			active[screen].classList.remove('active');
		}

		screens[id].run();

		document.getElementById(id).classList.add('active');
	}

	function initializeButtons() {
		document.getElementById('game-back-button').addEventListener(
			'click',
			function() {
				showScreen('menu-screen');
			}
		);

		document.getElementById('game-save-button').addEventListener(
			'click',
			function() {
				BreakoutGame.persistence.add(document.getElementById('name').value, BreakoutGame.score);
			}
		);	

		document.getElementById('high-scores-back-button').addEventListener(
			'click',
			function() {showScreen('menu-screen'); }
		);

		document.getElementById('high-scores-clear-button').addEventListener(
			'click',
			function() {
				BreakoutGame.persistence.removeAll();
				showScreen('high-scores-screen');
			}
		);

		document.getElementById('credits-back-button').addEventListener(
			'click',
			function() {showScreen('menu-screen'); }
		);
		
		document.getElementById('new-game-button').addEventListener(
			'click',
			function() {
				showScreen('game-screen'); 
				document.getElementById("score-input").style.display = "none";}
		);

		document.getElementById('high-scores-button').addEventListener(
			'click',
			function() {showScreen('high-scores-screen'); }
		);
		
		document.getElementById('credits-button').addEventListener(
			'click',
			function() { showScreen('credits-screen'); }
		);
	}	

	function initialize() {
		var screen = null;

		initializeButtons();

		for (screen in screens) {
			if (screens.hasOwnProperty(screen)) {
				screens[screen].initialize();
			}
		}
		
		showScreen('menu-screen');
	}

	return {
		initialize : initialize,
		showScreen : showScreen
	};

}(BreakoutGame.screens));