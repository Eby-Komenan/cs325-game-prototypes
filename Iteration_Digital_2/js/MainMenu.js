"use strict";

BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)

		this.music = this.add.audio('titleMusic',1, true);
		this.music.play();

		this.background= this.add.sprite(0, 0, 'titlePage');
		this.background.height = 600;
    	this.background.width = 800;
		var style = { font: "50px Courier", fill: "#ffffff", align: "center" };
		var text = this.game.add.text( this.game.world.centerX-250, 30, "Escape From Prison", style );
		var buttonStyle= {font: "40px Courier", fill: "#ffffff", align: "center" };
		this.playButton = this.add.button( 280, 400, 'button', this.startGame, this, 0, 0, 1);
		var buttonText= this.game.add.text(290, 410, "Start Game", buttonStyle);

	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		//this.music.stop();

		//	And start the actual game
		this.state.start('Intro');

	}

};
