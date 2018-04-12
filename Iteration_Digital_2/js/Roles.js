"use strict";

BasicGame.Roles = function (game) {

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
    //Savestate object, will contain each players' points and roles. Will be passed to all gamestates that follow this one
    this.save={};
    this.enterKey = null;
    this.text=  null;
    this.sentenceIndex = 0;
    this.lineIndex = -1;
    
    
};

BasicGame.Roles.prototype = {

    create: function () {
        //Determine randomly which of the players is the traitor
        this.traitor= this.rnd.integerInRange(1,3);
        if(this.traitor===1){
            this.save.P1Role='the traitor';
            this.save.P2Role='not the traitor';
            this.save.P3Role='not the traitor';
        }
        if(this.traitor===2){
            this.save.P1Role='not the traitor';
            this.save.P2Role='the traitor';
            this.save.P3Role='not the traitor';
        }
        if(this.traitor===3){
            this.save.P1Role='not the traitor';
            this.save.P2Role='not the traitor';
            this.save.P3Role='the traitor';
        }
        this.save.P1Points=0;
        this.save.P2Points=0;
        this.save.P3Points=0;
        this.lines = [
            "Player 2 and Player 3, look away from the screen.\n(Player 1, press enter to reveal your role.)",
            "You are "+this.save.P1Role+".\n(Player 1, press enter to hide your role.)",
            "Player 1 and Player 3, look away from the screen.\n(Player 2, press enter to reveal your role.)",
            "You are "+this.save.P2Role+".\n(Player 2, press enter to hide your role.)",
            "Player 1 and Player 2, look away from the screen.\n(Player 3, press enter to reveal your role.)",
            "You are "+this.save.P3Role+".\n(Player 3, press enter to hide your role.)",
            "Now that your roles have been revealed...\n(ENTER to continue)",
            "We will proceed with the questions.\n(ENTER to continue)",
            "Good luck...\n(ENTER to continue)"
        ];
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
            this.StartRiddles();
            return;
        }
        
        this.sentenceIndex = 0;        
        this.time.events.repeat(.05, this.lines[this.lineIndex].length + 1, this.addLetter, this);
    },

    StartRiddles: function () {

        //Start the riddles, pass the save object to the next gamestate, it will referenced to in the next state's init function
        this.state.start('P1Riddle', true, false, this.save, []);

    }

};