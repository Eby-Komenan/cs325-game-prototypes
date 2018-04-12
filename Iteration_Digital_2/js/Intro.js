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
        "Wake up, convicts!\n(ENTER to continue)",
        "Today is your lucky day.\n(ENTER to continue)",
        "You have a chance to get out of this jail.\n(ENTER to continue)",
        "But among you is a traitor.\n(ENTER to continue)",
        "They will try to get out of jail with at least one of you still locked in.\n(ENTER to continue)",
        "The rest of you must get out together.\n(ENTER to continue)",
        "You will all start with 0 points.\n(ENTER to continue)",
        "Each of you will need to answer a question.\n(ENTER to continue)",
        "Give the right answer and you gain two points.\n(ENTER to continue)",
        "Then, two of you will be forced to play in a Prisonner's Dilemma where the both of you can either win or lose points.\n(ENTER to continue)",
        "I will explain how it works later.\n(ENTER to continue)",
        "After the Prisonner's Dilemma, you will need to choose if you want to get out of prison.\n(ENTER to continue)",
        "To even be able to get out this jail, you will need to accumulate at least seven points.\n(ENTER to continue)",
        "Be aware that if even one of you decides to get out of jail, all players with at least seven points will be forced to leave.\n(ENTER to continue)",
        "If no one decides to leave, you will go back to answering questions, then playing another round of Prisonner's Dilemma.\n(ENTER to continue)",
        "This will keep going until one of you decides to leave.\n(ENTER to continue)",
        "Now, I shall reveal which one of you is the traitor.\n(ENTER to continue)",
        "Only the traitor will know if they are the traitor.\n(ENTER to continue)"
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
        this.text = this.add.text( this.world.centerX, this.world.centerY+50, "", style );
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
        this.state.start('Roles');
    }

};