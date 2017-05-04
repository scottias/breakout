BreakoutGame.screens['high-scores-screen'] = (function(play) {
	'use strict';
	
	function initialize() {}
	
	function run() {
		BreakoutGame.persistence.report();
		//play.initialize(true);
	}
	
	return {
		initialize : initialize,
		run : run
	};
}(BreakoutGame.play));


BreakoutGame.screens['credits-screen'] = (function(play) {
	'use strict';
	
	function initialize() {}
	
	function run() {
		play.initialize(true);
	}
	
	return {
		initialize : initialize,
		run : run
	};
}(BreakoutGame.play));

BreakoutGame.screens['menu-screen'] = (function(play) {
	'use strict';
	
	function initialize() {}
	
	function run() {
		play.initialize(true);
	}
	
	return {
		initialize : initialize,
		run : run
	};
}(BreakoutGame.play));

BreakoutGame.screens['game-screen'] = (function(play) {
	'use strict';
	
	function initialize() {}
	
	function run() {
		play.initialize(false);
	}
	
	return {
		initialize : initialize,
		run : run
	};
}(BreakoutGame.play));
