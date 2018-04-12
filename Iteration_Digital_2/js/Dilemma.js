"use strict";

BasicGame.Dilemma = function (game) {

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
    //Integer determining which of the players is excluded from the prisonner's dilemma
    this.excluded=0;
    this.lines=[];
    this.trustKey1=null;
    this.trustKey2=null;
    this.betrayKey1=null;
    this.betrayKey2=null;
    this.player1=0;
    this.player1Points=0;
    this.player2=0;
    this.player2Points=0;
    //Choice is true if trust, false if betray.
    this.player1Choice= false;
    this.player2Choice= false;
    //Voted is true if player trusts or betrays.
    this.player1Voted=false;
    this.player2Voted=false;
    this.outcomeText= null;
};

BasicGame.Dilemma.prototype = {

    init: function(saveState, repeatArray){
        this.save= saveState;
        this.noRepeats= repeatArray;
    },
    create: function () {

        this.background= this.add.sprite(0, 0, 'titlePage');
		this.background.height = 600;
        this.background.width = 800;
        this.trustKey1= this.input.keyboard.addKey(Phaser.Keyboard.Q);
        this.betrayKey1= this.input.keyboard.addKey(Phaser.Keyboard.W);
        this.trustKey2= this.input.keyboard.addKey(Phaser.Keyboard.O);
        this.betrayKey2= this.input.keyboard.addKey(Phaser.Keyboard.P);
        this.excluded= this.rnd.integerInRange(1,3);
        switch(this.excluded){
            case 1:
                this.player1=2;
                this.player1Points=this.save.P2Points;
                this.player2=3;
                this.player2Points=this.save.P3Points;
                break;
            
            case 2:
                this.player1=1;
                this.player1Points=this.save.P1Points;
                this.player2=3;
                this.player2Points=this.save.P3Points;
                break;
            
            case 3:
                this.player1=1;
                this.player1Points=this.save.P1Points;
                this.player2=2;
                this.player2Points=this.save.P2Points;
                break;
        }

        var style1 = { font: "20px Courier", fill: "#ffffff", align: "left"};
        var style2 = { font: "20px Courier", fill: "#ffffff", align: "right"};
        this.player1Text= this.add.text( 0, 0, "Player "+this.player1+": "+this.player1Points+"\nPress q to trust, w to betray.", style1 );
        this.player2Text= this.add.text( 800, 0, "Player "+this.player2+": "+this.player2Points+"\nPress o to trust, p to betray.", style2);
        this.player2Text.anchor.setTo(1,0);
        this.trustKey1.onDown.add(function() { this.player1Vote(true); }, this);
        this.betrayKey1.onDown.add(function() { this.player1Vote(false); }, this);
        this.trustKey2.onDown.add(function() { this.player2Vote(true); }, this);
        this.betrayKey2.onDown.add(function() { this.player2Vote(false); }, this);
        var style = { font: "25px Courier", fill: "#ffffff", align: "center"};
        this.outcomeText = this.add.text( this.world.centerX, this.world.centerY+50, "", style );
        this.outcomeText.anchor.setTo( 0.5, 0.5 );
    },

    outcome: function(){
        //The first player trusted.
        if(this.player1Choice){
            //The second player trusted.
            if(this.player2Choice){
                this.outcomeText.setText("You both gain 2 points");
                this.player1Points+=2;
                this.player2Points+=2;
                this.player1Text.setText("Player "+this.player1+": "+this.player1Points+"\nTrust.");
                this.player2Text.setText("Player "+this.player2+": "+this.player2Points+"\nTrust.");
                switch(this.excluded){
                    case 1:
                        this.save.P2Points+=2;
                        this.save.P3Points+=2;
                        break;
            
                    case 2:
                        this.save.P1Points+=2;
                        this.save.P3Points+=2;
                        break;
            
                    case 3:
                        this.save.P1Points+=2;
                        this.save.P2Points+=2;
                        break;
                }
            //The second player betrayed.
            }else{
                this.outcomeText.setText("Player "+this.player1+" lost 1 points and Player "+this.player2+" gained 3 points.");
                this.player1Points-=1;
                this.player2Points+=3;
                this.player1Text.setText("Player "+this.player1+": "+this.player1Points+"\nTrust.");
                this.player2Text.setText("Player "+this.player2+": "+this.player2Points+"\nBetray.");
                switch(this.excluded){
                    case 1:
                        this.save.P2Points-=1;
                        this.save.P3Points+=3;
                        break;
            
                    case 2:
                        this.save.P1Points-=1;
                        this.save.P3Points+=3;
                        break;
            
                    case 3:
                        this.save.P1Points-=1;
                        this.save.P2Points+=3;
                        break;
                }
            }
        //The first player betrayed.
        }else{
            //The second player trusted.
            if(this.player2Choice){
                this.outcomeText.setText("Player "+this.player1+" gained 3 points and Player "+this.player2+" lost 1 point.");
                this.player1Points+=3;
                this.player2Points-=1;
                this.player1Text.setText("Player "+this.player1+": "+this.player1Points+"\nBetray.");
                this.player2Text.setText("Player "+this.player2+": "+this.player2Points+"\nTrust.");
                switch(this.excluded){
                    case 1:
                        this.save.P2Points+=3;
                        this.save.P3Points-=1;
                        break;
            
                    case 2:
                        this.save.P1Points+=3;
                        this.save.P3Points-=1;
                        break;
            
                    case 3:
                        this.save.P1Points+=3;
                        this.save.P2Points-=1;
                        break;
                }
        //The second player betrays
            }else{
                this.outcomeText.setText("You both gain nothing");
                this.player1Points+=3;
                this.player2Points-=1;
                this.player1Text.setText("Player "+this.player1+": "+this.player1Points+"\nBetray.");
                this.player2Text.setText("Player "+this.player2+": "+this.player2Points+"\nBetray.");
                switch(this.excluded){
                    case 1:
                        this.save.P2Points+=0;
                        this.save.P3Points+=0;
                        break;
            
                    case 2:
                        this.save.P1Points+=0;
                        this.save.P3Points+=0;
                        break;
            
                    case 3:
                        this.save.P1Points+=0;
                        this.save.P2Points+=0;
                        break;
                }
            }
        }
        this.time.events.add(Phaser.Timer.SECOND * 3, this.quitGame, this);
    },

    player1Vote(bool){
        if(!this.player1Voted){
            this.player1Voted=true;
            this.player1Choice=bool;
            this.player1Text.setText("Player "+this.player1+": "+this.player1Points+"\nChoice made.");
            if(this.player1Voted&&this.player2Voted){
                this.outcomeText.setText("The votes have been cast.");
                this.time.events.add(Phaser.Timer.SECOND * 3, this.outcome, this);
            }
        }
        
    },

    player2Vote(bool){
        if(!this.player2Voted){
            this.player2Voted=true;
            this.player2Choice=bool;
            this.player2Text.setText("Player "+this.player2+": "+this.player2Points+"\nChoice made.");
            if(this.player1Voted&&this.player2Voted){
                this.outcomeText.setText("The votes have been cast.");
                this.time.events.add(Phaser.Timer.SECOND * 3, this.outcome, this);
            }
        }
    },

    quitGame: function () {
        this.state.start('DecisionIntro',true, false, this.save, this.noRepeats);
    }

};

//TODO: Exposition text, register keys, randomize excluded, implement trust-betrayal relationships.