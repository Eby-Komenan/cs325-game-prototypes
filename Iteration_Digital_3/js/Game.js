"use strict";

BasicGame.Game = function (game) {

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
    //this.bouncy = null;
};

BasicGame.Game.prototype = {

    create: function () {
        
        // Turn on the arcade physics engine for this sprite.
        //this.game.physics.enable( this.bouncy, Phaser.Physics.ARCADE );
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        this.floor= this.add.sprite(0, 0, 'floor');
		this.floor.height = 600;
    	this.floor.width = 800;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        // When you click on the sprite, you go back to the MainMenu.
        //this.bouncy.inputEnabled = true;
        //this.bouncy.events.onInputDown.add( function() { this.quitGame(); }, this );
        this.frames = this.add.group(undefined, 'player', true);
        this.player = this.game.add.sprite(this.game.world.centerX, 475, 'player', 22);
        this.player.animations.add('right', [9,10,11], 10, true);
        this.player.animations.add('left', [27, 28, 29], 10, true);
        this.player.animations.add('idle', [22], 10, true);
        this.player.animations.add('up', [0, 1, 2], 10,true);
        this.player.animations.add('down', [18, 19, 20], 10, true);
        this.player.anchor.setTo(0.5, 0.5);
        this.player.scale.setTo(3,3);
        this.game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;
        this.player.body.gravity.y = 0;
        this.cursors = this.game.input.keyboard.createCursorKeys();
        //Extending the sprite class for patroling enemies
        this.Patrol= function (game, x, y, xDirection, yDirection, speed){
            Phaser.Sprite.call(this, game, x, y, 'patrol');
            this.anchor.setTo(0.5);
            game.physics.enable(this, Phaser.Physics.ARCADE);
            this.xSpeed= xDirection*speed;
            this.ySpeed= yDirection*speed;
            this.body.collideWorldBounds=true;
            if(xDirection===-1){
                this.angle+=180;
            }
            if(yDirection===-1){
                this.angle-=90;
            }
            if(yDirection===1){
                this.angle+=90;
            }
            
        };
    
        this.Patrol.prototype=Object.create(Phaser.Sprite.prototype);
        this.Patrol.prototype.constructor=this.Patrol;

        this.Patrol.prototype.update= function(){
            
            //movePatrol(this);
            this.body.velocity.x= this.xSpeed;
            this.body.velocity.y= this.ySpeed;
        }
        //Change direction when colliding with the world bounds
        function movePatrol(patrol){
            if(patrol.xSpeed>0){
                patrol.xSpeed*=-1;
                patrol.angle+=180;
            }
            else if(patrol.xSpeed<0){
                patrol.xSpeed*=-1;
                patrol.angle+=180;
            }
            if(patrol.ySpeed>0){
                patrol.ySpeed*=-1;
                patrol.angle+=180;
            }
            else if(patrol.ySpeed<0){
                patrol.ySpeed*=-1;
                patrol.angle+=180;
            }
        }
        this.patrol= new this.Patrol(this.game, 100, 124, 0, 1, 400);
        this.patrol.body.onWorldBounds= new Phaser.Signal();
        this.patrol.body.onWorldBounds.add(movePatrol, this);
        this.game.add.existing(this.patrol);
    },

    update: function () {
        //player movement
        this.player.body.velocity.y = 0;
        this.player.body.velocity.x = 0;
 
        if(this.cursors.left.isDown) {
            this.player.body.velocity.x = -400;
            this.player.animations.play('left');
        }
        else if(this.cursors.right.isDown) {
            this.player.body.velocity.x = 400;
            this.player.animations.play('right');
        }
        else if(this.cursors.up.isDown){
            this.player.body.velocity.y = -400;
            this.player.animations.play('up');
        }
        else if(this.cursors.down.isDown){
            this.player.body.velocity.y = 400;
            this.player.animations.play('down');
        }
        else{
            this.player.body.velocity.x = 0;
            this.player.animations.play('idle');
        }
        if(this.cursors.right.isDown&&this.cursors.left.isDown){
            this.player.body.velocity.x = 0;
            this.player.animations.play('idle');
        }
        if(this.cursors.down.isDown&&this.cursors.up.isDown){
            this.player.body.velocity.y = 0;
            this.player.animations.play('idle');
        }
        
        
    },

    quitGame: function () {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    }


};
