"use strict";

window.onload = function() {

	//	Create your Phaser game and inject it into the 'game' div.
	//	We did it in a window.onload event, but you can do it anywhere (requireJS load, anonymous function, jQuery dom ready, - whatever floats your boat)
	var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game' );

	//	Add the States your game has.
	//	You don't have to do this in the html, it could be done in your Boot state too, but for simplicity I'll keep it here.
	game.state.add('Boot', BasicGame.Boot);
	game.state.add('Preloader', BasicGame.Preloader);
	game.state.add('MainMenu', BasicGame.MainMenu);
	game.state.add('Game', BasicGame.Game);
	game.state.add('Intro', BasicGame.Intro);
	game.state.add('Roles', BasicGame.Roles);
	game.state.add('P1Riddle', BasicGame.P1Riddle);
	game.state.add('P2Riddle', BasicGame.P2Riddle);
	game.state.add('P3Riddle', BasicGame.P3Riddle);
	game.state.add('DilemmaIntro', BasicGame.DilemmaIntro);
	game.state.add('Dilemma', BasicGame.Dilemma);
	game.state.add('DecisionIntro', BasicGame.DecisionIntro);
	game.state.add('Decision', BasicGame.Decision);
	game.state.add('TraitorWin', BasicGame.TraitorWin);
	game.state.add('ConvictsWin', BasicGame.ConvictsWin);
	//Will happen if a convict leaves alone.
	game.state.add('AllLose', BasicGame.AllLose);
	//	Now start the Boot state.
	game.state.start('Boot');

};
