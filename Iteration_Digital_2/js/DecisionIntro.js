"use strict";

BasicGame.DecisionIntro = function (game) {

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
        "Your are now done with the prisonner's dilemma.\n(ENTER to continue)",
        "At least one of you has at least 7 points.\n(ENTER to continue)",
        "You can now vote to get out of jail.\n(ENTER to continue)",
        "If just one of you has at least 7 points and decides to get out of jail, all players with at least seven points will be forced to leave.\n(ENTER to continue)",
        "All three of you will take turns voting.\n(ENTER to continue)",
        "Players with less than 7 points can still vote, but their vote will not matter.\n(ENTER to continue)"
    ];
    this.save= {};
    //Used to avoid asking the same question twice.
    this.noRepeats=[];
    this.text = null;
    this.sentenceIndex = 0;
    this.lineIndex = -1;
    
    this.enterKey = null;
};

BasicGame.DecisionIntro.prototype = {

    init: function(saveState, repeatArray){
        this.save= saveState;
        this.noRepeats= repeatArray;
    },

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
        
        if((this.save.P1Points<7&&this.save.P2Points<7)&&this.save.P3Points<7){
            this.text.setText("None of you has at least 7 points. You will go back to answering questions.");
            this.time.events.add(Phaser.Timer.SECOND * 3, this.backToRiddles, this);
        }
        else{
            //Register the enter key and bind it to the nextLine function
            this.enterKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            this.enterKey.onDown.add(function() { this.nextLine(); }, this);
            this.nextLine();
        }
        
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
            this.startVoting();
            return;
        }
        
        this.sentenceIndex = 0;        
        this.time.events.repeat(.05, this.lines[this.lineIndex].length + 1, this.addLetter, this);
    },

    startVoting: function(){
        this.state.start('Decision',true, false, this.save, this.noRepeats);
    },

    backToRiddles: function(){
        this.state.start('P1Riddle',true, false, this.save, this.noRepeats);
    }

};