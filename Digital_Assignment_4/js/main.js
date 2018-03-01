"use strict";

window.onload = function() {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    var phrases= ["Taste egg, human scum!", "Humans will feel my wrath.", "Cluck Cluck, motherclucker!", "I shall sacrifice my eggs for the avian cause.", "This egg is the egg that will pierce the heavens!"];
    var word;
    var correct = [];
    var bmd;
    var nextChar=0;
    //Will count the number of erroneous keystrokes, will serve as a penalty.
    var errors = 0;
    var spaceKey;
    var background;
    function preload() {
        game.load.spritesheet('chicken', 'assets/chicken_large.png', 48, 48);
        game.load.image('egg', 'assets/egg.png');
        game.load.image('background', 'assets/starfield.jpg');
        game.load.audio('victory','assets/249524__limetoe__badass-victory.wav');
        game.load.audio('error', 'assets/159367__huminaatio__7-error.wav');
        game.load.audio('failure', 'assets/253174__suntemple__retro-you-lose-sfx.wav');
        game.load.image('floorLeft', 'assets/grassLeft.png');
        game.load.image('floorMid', 'assets/grassMid.png');
        game.load.image('floorRight', 'assets/grassRight.png');
        game.load.image('bg','assets/bg.png');
        game.load.spritesheet('enemy','assets/Green-Cap-Character-16x18.png', 16, 18);
        game.load.tilemap('tilemap','assets/gameMap.json', null, Phaser.Tilemap.TILED_JSON);
        
    }
    
    var map;    //The tilemap
    var floor;  //The floor layer of the tilemap
    var bg;     //The background layer of the tilemap
    var enemy;  //The enemy sprite.
    var chicken; //The chicken sprite.
    var egg;    //The egg projectile object.
    var speed;  //The speed of the launched egg.
    var scoreText;  //Will show the score gained by the player.
    var lastKeyRight=true;   //True if the last key stroke is the right one.
    var score;
    var base=100;       //Base score.
    var mult= 1;        //Score gain multiplier.
    var baseGain= 5;   //Base score gain.
    var baseLoss= 5;    //Base score loss rate. 
    var lmult=1;        //Score loss multiplier.
    var keepCounting=true;   //True if the player still has characters to type.
    var floorHit= false;    //Will determine if the egg has hit the floor before hitting the enemy.


    function create() {
        game.stage.backgroundColor = '#6688ee';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        map = game.add.tilemap('tilemap');
        map.addTilesetImage('grassMid','floorMid');
        map.addTilesetImage('bg','bg');
        floor= map.createLayer('floor');
        bg= map.createLayer('background');
        bg.visible=false;
        map.setCollisionBetween(0, 500, true, 'floor');
        floor.resizeWorld();
        //Initialize the chicken sprite.
        chicken= game.add.sprite(30, 515,'chicken',12);
        game.physics.arcade.enable(chicken);
        word= phrases[game.rnd.integerInRange(0,4)];
        //Initialize the enemy sprite.
        enemy= game.add.sprite(700, 475, 'enemy', 6);
        enemy.anchor.set(0.5, 0.5);
        enemy.scale.set(10,10);       //Make the enemy a daunting foe to throw an egg at.
        game.physics.arcade.enable(enemy);
        enemy.body.collideWorldBounds = true;   //Want the enemy to bounce around the game screen after being hit with an egg.
        enemy.body.bounce.setTo(0.9, 0.9);
        enemy.body.gravity.y= 980;
        //Initialize the egg group.
        egg= game.add.physicsGroup();
        //  Here we'll create a simple array where each letter of the word to enter represents one element:
        for (var i = 0; i < word.length; i++)
        {
            correct[i] = false;
        }
        var style = { font: "25px Verdana", fill: "#000000", align: "center" };
        var text = game.add.text(game.world.centerX, 15, "Type the following:", style);
        text.anchor.setTo(0.5, 0.0);
        //Initialize the score text.
        var style = { font: "50px Verdana", fill: "#000000", align: "center" };
        scoreText = game.add.text(0, 200, "Score: "+score, style);
        scoreText.anchor.setTo(0.0, 0.0);
        //  This is our BitmapData onto which we'll draw the word being entered
        bmd = game.make.bitmapData(800, 200);
        bmd.context.font = '25px Arial';
        bmd.context.fillStyle = '#000000';
        bmd.context.fillText(word, 64, 64);
        bmd.addToWorld();
        score= base;
        updateScore();
        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        //  Capture all key presses
        game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
        game.input.keyboard.addCallbacks(this, null, null, keyPress);
        game.time.events.loop(Phaser.Timer.SECOND, decrementScore, this);
    }
    
    function update() {
        game.physics.arcade.collide(enemy,floor);
        game.physics.arcade.collide(chicken, floor);
        game.physics.arcade.collide(egg, floor, hitFloor, null, this);
        game.physics.arcade.overlap(egg, enemy, enemyHit, enemyProcess, this);
        updateScore();
        if (this.spaceKey.justPressed())
        {
            spacePressed();
        }
    }
    //Called from update when the space key is pressed since using addKeyCapture prevents the space input from being caught by addCallBacks
    function spacePressed()
    {
        if(word.charAt(nextChar)===" ")
            {
                correct[nextChar]=true;
                if(nextChar<word.length)
                    nextChar++;
                if(lastKeyRight){
                    score+=(baseGain*mult);
                    if(mult<3)
                        mult++; 
                }
                lastKeyRight=true;
                lmult=1;
            }
        else
        {
            lastKeyRight=false;
            mult=1;
            lmult++;
            errors++;
            var sounds = game.add.audio('error');
            sounds.play(); 
        }
    }
    
    function keyPress(char) 
    {

        //  Clear the BMD
        bmd.cls();

        //  Set the x value we'll start drawing the text from
        var x = 64;
        //If the key pressed is equal to the next character in the word, update the associated correct value accordingly.
        if(char===word.charAt(nextChar))
        {
             correct[nextChar]=true;
            if(nextChar<word.length)
                nextChar++;
            if(lastKeyRight){
                    score+=(baseGain*mult);
                    mult++; 
                }
                lastKeyRight=true;
                lmult=1;
            
        }
        else
        {
            lastKeyRight=false;
            mult=1;
            lmult++;
            errors++;
            var sounds = game.add.audio('error');
            sounds.play(); 
        }
        //  Loop through each letter of the word being entered and check them against the key that was pressed
        for (var i = 0; i < word.length; i++)
        {
            var letter = word.charAt(i);

            //  Now draw the word, letter by letter, changing colour as required
            if (correct[i])
            {
                bmd.context.fillStyle = '#0ff000';
            }
            else
            {
                bmd.context.fillStyle = '#000000';
            }

            bmd.context.fillText(letter, x, 64);

            x += bmd.context.measureText(letter).width;
        }
        
        if(nextChar===word.length)
        {
             fire();   
        }

    }
    //Called when the player has successfully entered all of the characters in the requested phrase. 
    function fire()
    {
        var c= egg.create(chicken.body.x+ 24, chicken.body.y- 35, 'egg');
        if(score< 500)
            c.body.gravity.y= 2000;
        c.body.collideWorldBounds=true;
        var launchVel= score;
        c.body.velocity.setToPolar(350, launchVel, true);
        keepCounting= false;
    }
    
    //Called if the egg collides with its target.
    function gameWin()
    {
        var sounds = game.add.audio('victory');
        sounds.play();   
    }
    
    //Called if a few seconds pass after launching the egg with no collision.
    function gameLose()
    {
        var sounds = game.add.audio('failure');
        sounds.play();   
    }
    //Update the score text.
    function updateScore(){
        scoreText.setText("Score: "+score);
    }
    //Remove a certain amount of points, depending on the loss factor.
    function decrementScore(){
        if(keepCounting)
            score-=(baseLoss*lmult);
    }
    function enemyHit(projectile, target){
        projectile.kill();
        game.camera.shake(0.05, 500);
        target.body.velocity.setToPolar(330, score, true);
        gameWin();
    }
    function enemyProcess(projectile, target){
        return !floorHit;
    }

    function hitFloor(projectile, target){
        if(!floorHit){
            floorHit= true;
            projectile.body.velocity.setMagnitude(0);
            gameLose();
        }
        
    }
    
};
