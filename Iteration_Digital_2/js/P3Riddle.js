"use strict";

BasicGame.P3Riddle = function (game) {

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
    this.questions=[
        "Ostriches hide their head in the sand when scared.",                                                   
        "Around a quarter of the human body's bones are contained in the feet.",                                
        "A Vomitorium is a special room where Romans would purge food during a meal.",                          
        "A person will shed around 10 pounds of skin during their lifetime.",                                   
        "A sneeze can exceed 100 mph.",                                                                         
        "A slug's blood is green.",                                                                             
        "The Great Wall of China is visible from the Moon.",                                                    
        "Most Las Vegas casinos have a clock visible for all guests.",                                          
        "The total surface area of two human lungs is approximately 70 square meters (~750 square feet).",      
        "Sir Paul McCartney's middle name is James.",                                                           
        "Jupiter is the fifth planet from the sun.",                                                            
        "Lithium's atomic number is 17.",                                                                       
        "The Statue of Liberty is 93 meters (~305 feet) tall.",                                                 
        "It is technically legal to kill a Scotsman in York with a bow and arrow.",                             
        "Seoul is the capital of North Korea",                                                                  
        "Marie Antoinette was married to Louis XIV of France.",                                                  
        "Array indexing starts at 0.",                                                                          
        "Dogs only see in black and white.",                                                                    
        "The national animal of Scotland is the Unicorn."                                                        
    ];
    this.answers=[
        false,
        true,
        false,
        false,
        true,
        true,
        false,
        false,
        true,
        false,
        true,
        false,
        true,
        true,
        false,
        false,
        true,
        false,
        true
    ];
    this.trueKey=null;
    this.falseKey= null;
    //question index
    this.question=-1;
    //the player's answer
    this.attempt= false;
    this.answered=false;
};

BasicGame.P3Riddle.prototype = {

    init: function(saveState, repeatArray){
        this.save= saveState;
        this.noRepeats= repeatArray;
    },

    create: function () {

        this.background= this.add.sprite(0, 0, 'titlePage');
		this.background.height = 600;
        this.background.width = 800;
        //Take question at random that hasn't been used so far
        do{
            this.question=this.rnd.integerInRange(0,this.questions.length-1);
        }while(this.noRepeats.includes(this.question));
        this.noRepeats.push(this.question);

        var style = { font: "25px Courier", fill: "#ffffff", align: "left"};
        this.text = this.add.text( 0, 0, "Player 3: "+this.save.P3Points+"\nIf the following statement is true, press q, w if false.", style );
        //this.text.anchor.setTo( 0.5, 0.5 );
        this.text.wordWrap=true;
        this.text.wordWrapWidth= 600;
        var questionStyle={ font: "25px Courier", fill: "#ffffff", align: "center"};
        this.questionText= this.add.text(this.world.centerX, this.world.centerY+50, this.questions[this.question], questionStyle);
        this.questionText.anchor.setTo( 0.5, 0.5 );
        this.questionText.wordWrap=true;
        this.questionText.wordWrapWidth= 600;
        this.trueKey = this.input.keyboard.addKey(Phaser.Keyboard.Q);
        this.falseKey= this.input.keyboard.addKey(Phaser.Keyboard.W);
        this.trueKey.onDown.add(function(){this.answer(true); }, this);
        this.falseKey.onDown.add(function(){this.answer(false); }, this);
    },
    answer: function(bool){
        if(!this.answered){
            //If both answer and attempt are of the same value (both true or both false)
            this.answered=true;
            if((this.answers[this.question]&&bool)||(!this.answers[this.question]&&!bool)){
                this.save.P3Points+=2;
                this.text.setText("Correct, you have gained two points.");
            }
            else{
                this.text.setText("Wrong");
            }
            //Comment out those two lines, used for debugging reasons.
            var str= JSON.stringify(this.save, null, 4);
            console.log(str);
            this.time.events.add(Phaser.Timer.SECOND * 3, this.quitGame, this);
        }
    },

    update: function () {

        
    },

    quitGame: function () {
        this.state.start('DilemmaIntro',true, false, this.save, this.noRepeats);
    }

};