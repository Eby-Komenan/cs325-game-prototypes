"use strict";

BasicGame.Decision = function (game) {

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
    this.save= {};
    //Used to avoid asking the same question twice.
    this.noRepeats=[];
    this.text = null;
    this.getOutKey= null;
    this.stayKey= null;
    //Is true if the player has at least 7 points AND decides to leave
    this.player1Choice=false;
    this.player2Choice=false;
    this.player3Choice=false;
    this.isTraitor1=false;
    this.isTraitor2=false;
    this.isTraitor3=false;
    this.enough1=false;
    this.enough2=false;
    this.enough3=false;
};

BasicGame.Decision.prototype = {

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
        this.text.setText("Player 1: "+this.save.P1Points+" \nPress q to vote to get out, w to stay.");
        this.getOutKey= this.input.keyboard.addKey(Phaser.Keyboard.Q);
        this.stayKey= this.input.keyboard.addKey(Phaser.Keyboard.W);
        this.getOutKey.onDown.add(function() { this.p1Vote(true); }, this);
        this.stayKey.onDown.add(function() { this.p1Vote(false); }, this);
    },

    p1Vote: function(bool){
        this.player1Choice= bool&&(this.save.P1Points>=7);
        this.getOutKey.onDown.removeAll();
        this.stayKey.onDown.removeAll();
        this.text.setText("Player 2: "+this.save.P2Points+" \nPress q to vote to get out, w to stay.");
        this.getOutKey.onDown.add(function() { this.p2Vote(true); }, this);
        this.stayKey.onDown.add(function() { this.p2Vote(false); }, this);
    },

    p2Vote: function(bool){
        this.player2Choice= bool&&(this.save.P2Points>=7);
        this.getOutKey.onDown.removeAll();
        this.stayKey.onDown.removeAll();
        this.text.setText("Player 3: "+this.save.P3Points+" \nPress q to vote to get out, w to stay.");
        this.getOutKey.onDown.add(function() { this.p3Vote(true); }, this);
        this.stayKey.onDown.add(function() { this.p3Vote(false); }, this);
    },

    p3Vote: function(bool){
        this.player3Choice= bool&&(this.save.P3Points>=7);
        this.getOutKey.onDown.removeAll();
        this.stayKey.onDown.removeAll();
        this.text.setText("One of you has deciced to get out.");
        //If at least one player decides to get out.
        if((this.player1Choice||this.player2Choice)||this.player3Choice){

            this.time.events.add(Phaser.Timer.SECOND * 3, this.getOut, this);
        }
        else{
            this.text.setText("You all will stay.");
            this.time.events.add(Phaser.Timer.SECOND * 3, this.allStay, this);
        }
    },

    allStay: function(){
        this.state.start('P1Riddles',true, false, this.save, this.noRepeats);
    },

    getOut: function(){
        //If all players get out
        if((this.enough1&&this.enough2)&&this.enough3){
            this.state.start('ConvictsWin',true, false, this.save, this.noRepeats);
        }
        //If only player1 and player 2 get out
        else if(this.enough1&&this.enough2){
            //If one of them is the traitor
            if(this.isTraitor1||this.isTraitor2){
                this.state.start('TraitorWin',true, false, this.save, this.noRepeats);
            }
            else{
                this.state.start('ConvictsWin',true, false, this.save, this.noRepeats);
            }
        }
        //If only player 1 and player 3 get out
        else if(this.enough1&&this.enough3){
            //If one of them is the traitor
            if(this.isTraitor1||this.isTraitor3){
                this.state.start('TraitorWin',true, false, this.save, this.noRepeats);
            }
            else{
                this.state.start('ConvictsWin',true, false, this.save, this.noRepeats);
            }
        }
        //If only player 2 and player 3 get out
        else if(this.enough2&&this.enough3){
            //If one of them is the traitor
            if(this.isTraitor2||this.isTraitor3){
                this.state.start('TraitorWin',true, false, this.save, this.noRepeats);
            }
            else{
                this.state.start('ConvictsWin',true, false, this.save, this.noRepeats);
            }
        }
        //If only player 1 gets out
        else if(this.enough1){
            if(this.isTraitor1){
                this.state.start('TraitorWin',true, false, this.save, this.noRepeats);
            }
            //If the player left their partner behind
            else{
                this.music.stop();
                this.state.start('AllLose',true, false, this.save, this.noRepeats);
            }
        }
        //If only player 2 gets out
        else if(this.enough2){
            if(this.isTraitor2){
                this.state.start('TraitorWin',true, false, this.save, this.noRepeats);
            }
            //If the player left their partner behind
            else{
                this.music.stop();
                this.state.start('AllLose',true, false, this.save, this.noRepeats);
            }
        }
        //If only player 3 gets out
        else if(this.enough3){
            if(this.isTraitor3){
                this.state.start('TraitorWin',true, false, this.save, this.noRepeats);
            }
            //If the player left their partner behind
            else{
                this.music.stop();
                this.state.start('AllLose',true, false, this.save, this.noRepeats);
            }
        }
    }
    

};