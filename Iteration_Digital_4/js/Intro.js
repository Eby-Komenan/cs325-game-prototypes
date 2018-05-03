"use strict";

BasicGame.Intro = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:
    /*
    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)
    
    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
    */
    
    // For optional clarity, you can initialize
    // member variables here. Otherwise, you will do it in create().
    this.lines = [
        "Greetings, agent.\n(ENTER to continue)",
        "We've taken you away from the front for a special mission.\n(ENTER to continue)",
        "Your new job is to infiltrate an enemy base to collect intelligence.\n(ENTER to continue)",
        "You are outfitted with a state-of-the-art camera.\n(ENTER to continue)",
        "The moment you run into a Blu general, a picture of them will be taken.\n(ENTER to continue)",
        "Don't worry if the generals dissapear, we might have set the flash too strong.\n(ENTER to continue)",
        "It's gotten to the point where it may vaporize them.\n(ENTER to continue)",
        "Unfortunately, this will not work with the green guards for some reason, so you might want to avoid them.\n(ENTER to continue)",
        "Once you have collected all intelligence, you will need to move in the lower-right corner to exfiltrate.\n(ENTER to continue)",
        "Oh, and one last thing, another agent will be controlling your movement remotely.\n(ENTER to continue)",
        "They will use the arrow keys to do so.\n(ENTER to continue)"
    ];
    
    this.text = null;
    
    this.sentenceIndex = 0;
    this.lineIndex = -1;
    
    this.enterKey = null;
};

BasicGame.Intro.prototype = {

    create: function () {

        
        this.background= this.add.sprite(0, 0, 'titlePage');
		this.background.height = 600;
    	this.background.width = 800;
        
        var style = { font: "25px Courier", fill: "#ffffff", align: "center"};
        this.text = this.add.text( this.world.centerX, this.world.centerY-100, "", style );
        this.text.anchor.setTo( 0.5, 0.5 );
        //This bounds the text box to a width of 600px
        this.text.wordWrap=true;
        this.text.wordWrapWidth= 600;
        //Register the enter key and bind it to the nextLine function
        this.enterKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.enterKey.onDown.add(function() { this.nextLine(); }, this);
        		
        this.nextLine();
    },

    addLetter: function () {
        
        if(this.lineIndex >= this.lines.length){
            this.text.setText("");
            return;
        }
        
        this.text.setText(this.lines[this.lineIndex].substring(0, this.sentenceIndex));
        this.sentenceIndex++;
    },
    
    nextLine: function () {

        this.time.events.removeAll();
        this.lineIndex++;
        
        this.text.setText("");
        
        if(this.lineIndex >= this.lines.length){
            this.enterKey.reset(true);
            this.revealRoles();
            return;
        }
        
        this.sentenceIndex = 0;        
        this.time.events.repeat(.05, this.lines[this.lineIndex].length + 1, this.addLetter, this);
    },

    revealRoles: function(){
        this.state.start('Game');
    }

};