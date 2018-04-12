"use strict";

BasicGame.TraitorWin = function (game) {

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
        "Feel free to celebrate...\n(ENTER to continue)",
        "You were able to make them trust you.\n(ENTER to continue)",
        "Now you are out and at least one of them will stay in this jail forever.\n(ENTER to continue)",
        "The traitor wins!\n(ENTER to continue)",
        "(ENTER to start a new game)"
    ];
    this.save= {};
    //Used to avoid asking the same question twice.
    this.noRepeats=[];
    this.text = null;
    this.skipKey=null;
    this.sentenceIndex = 0;
    this.lineIndex = -1;
    
    this.enterKey = null;
    this.isTraitor1=false;
    this.isTraitor2=false;
    this.isTraitor3=false;
    this.enough1=false;
    this.enough2=false;
    this.enough3=false;
};

BasicGame.TraitorWin.prototype = {

    init: function(saveState, repeatArray){
        this.save= saveState;
        this.noRepeats= repeatArray;
        this.isTraitor1=(saveState.P1Role==='the traitor');
        this.isTraitor2=(saveState.P2Role==='the traitor');
        this.isTraitor3=(saveState.P3Role==='the traitor');
        this.enough1=(saveState.P1Points>=7);
        this.enough2=(saveState.P2Points>=7);
        this.enough3=(saveState.P3Points>=7);
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
        //Register the enter key and bind it to the nextLine function
        this.enterKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.enterKey.onDown.add(function() { this.nextLine(); }, this);
        this.skipKey= this.input.keyboard.addKey(Phaser.Keyboard.S);
        this.skipKey.onDown.add(function(){ this.startDilemma(); }, this);
        
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
            this.startDilemma();
            return;
        }
        
        this.sentenceIndex = 0;        
        this.time.events.repeat(.05, this.lines[this.lineIndex].length + 1, this.addLetter, this);
    },

    startDilemma: function(){
        this.state.start('MainMenu');
    }

};