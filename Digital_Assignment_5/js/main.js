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
    var lines = [
        "You thought you were prepared.\n(ENTER to continue)",
        "You wanted to show your talent to the world.\n(ENTER to continue)",
        "You did terribly, the audience hates you...\n(ENTER to continue)",
        "Bacchus, god of wine and theater is enraged \nand is smiting you with a shower of falling stars!!!\n(ENTER to continue)",
        "You need to dodge them unitl he gets tired.\n(ENTER to continue)"
    ];

    var secondLines =["Bacchus is tired...\n(ENTER to continue)",
                        "But from the audience comes a full crew of pirates!\n(ENTER to continue)",
                        "<<Yarr!>>, screamed the captain.\n(ENTER to continue)",
                        "<<An awful performance this be!>>\n(ENTER to continue)",
                        "<<Man the cannons, we will show her what happens to awful performers.>>\n(ENTER to continue)",
                        "As you look, a swarm of cannonballs rain from the skies!\n(ENTER to continue)"];
    var lineIndex = -1;
    var wordIndex=0;
    var gameReady=false;
    var text;
    var timerText;
    var timer = 30;
    var meteorGravity=1000;
    var meteors;
    var wordDelay = 100;
    var enterKey;
    var line = [];
    var playerHit= false;
    var victorySound;
    var failureSound;
    var boo1;
    var boo2;
    var isLevel2=false;
    var meteorLoop;
    var uiCounter;
    
    function preload() {
        game.load.image('tiles', 'assets/simples_pimples.png');
        game.load.tilemap('tilemap','assets/stage.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.spritesheet('player','assets/sara 16x18 source.png', 16, 18);
        game.load.image('star', 'assets/energy_blast-20.png');
        game.load.audio('victory', 'assets/249524__limetoe__badass-victory.wav');
        game.load.audio('failure', 'assets/239586__ryanconway__short-evil-laugh-3.wav');
        game.load.audio('boo1','assets/324893__adam-n__crowd-boo.wav');
        game.load.audio('boo2','assets/233579__roivasugo__boo-you-suck.wav');
        game.load.image('cannonball','assets/space-mine.png');
    }
    
    //var bouncy;
    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.frames = this.add.group(undefined, 'player', true);
        this.map = this.game.add.tilemap('tilemap');
        this.map.addTilesetImage('simples_pimples', 'tiles');
        this.backgroundLayer = this.map.createLayer('BackgroundLayer');
        this.groundLayer = this.map.createLayer('GroundLayer');
        this.map.setCollisionBetween(0, 500, true, 'GroundLayer');
        this.player = this.game.add.sprite(this.game.world.centerX, 475, 'player', 22);
        this.player.animations.add('right', [9,10,11], 10, true);
        this.player.animations.add('left', [27, 28, 29], 10, true);
        this.player.animations.add('idle', [22], 10, true);
        this.player.anchor.setTo(0.5, 0.5);
        this.player.scale.setTo(3,3);
        this.game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;
        this.groundLayer.resizeWorld();
        this.player.body.gravity.y = 2000;
        meteors= game.add.physicsGroup();
        victorySound= game.add.audio('victory');
        failureSound= game.add.audio('failure');
        boo1= game.add.audio('boo1', 0.8, true);
        boo2=game.add.audio('boo2', 0.4, true);
        text = this.game.add.text(this.game.world.centerX-100, 32, '', { font: "15px Arial", fill: "#d99fff" , align: "center"});
        timerText= this.game.add.text(0, 32, '',{font: "15px Arial", fill: "#d99fff"})
        this.cursors = this.game.input.keyboard.createCursorKeys();
        enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enterKey.onDown.add(nextLine, this);
        nextLine();
    }
    
     function nextWord() {
         
        if(wordIndex >= line.length){
            return;
        }
        //  Add the next word onto the text string, followed by a space
        text.text = text.text.concat(line[wordIndex] + " ");

        //  Advance the word index to the next word in the line
         wordIndex++;
     }
    function updateCounter()
    {
        timer--;
        timerText.setText('Time remaining:'+ timer);
        if(timer===0)
            gameWin();
    }
    function nextLine() {

        lineIndex++;
        
        if(lineIndex >= lines.length){
            gameReady=true;
            text.setText("");
            uiCounter= game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);
            meteorLoop= game.time.events.loop(250, spawnMeteor, this);
            boo1.play();
            boo2.play();
            return;
        }
        line = lines[lineIndex].split(' ');

        //  Reset the word index to zero (the first word in the line)
        wordIndex = 0;
        wordIndex = 0;
        text.setText("");
        
        //following line of code taken from: https://phaser.io/examples/v2/text/display-text-word-by-word
        game.time.events.repeat(wordDelay, lines[lineIndex].length + 1, nextWord, this);
    }
    
    function update() {
        this.game.physics.arcade.collide(this.player, this.groundLayer);
        this.game.physics.arcade.collide(meteors, this.groundLayer, meteorFloor, floorProcessHandler, this);
        this.game.physics.arcade.collide(meteors, this.player, hurtPlayer, playerProcessHandler, this);
        if(gameReady){
            if(this.cursors.left.isDown) {
                this.player.body.velocity.x = -400;
                this.player.animations.play('left');
            }
            else if(this.cursors.right.isDown) {
                this.player.body.velocity.x = 400;
                this.player.animations.play('right');
            }
            else{
                this.player.body.velocity.x = 0;
                this.player.animations.play('idle');
            }
            if(this.cursors.right.isDown&&this.cursors.left.isDown){
                this.player.body.velocity.x = 0;
                this.player.animations.play('idle');
            }
            
        }
        else
            return;
    }
    
    function spawnMeteor()
    {
        if(!isLevel2){
            var c = meteors.create(game.rnd.integerInRange(0, 750), 60, 'star');
        }
        else{
            var c = meteors.create(game.rnd.integerInRange(0, 750), 60, 'cannonball');
        }
        c.body.gravity.y= meteorGravity+game.rnd.integerInRange(0, 500);
        
    }
    function meteorFloor(meteor, floor)
    {
        meteor.kill();
        
    }
    function hurtPlayer(meteor, player)
    {
        meteor.kill();
        player.kill();
        gameLose();
    }
    function gameLose()
    {
        //Stop all game events
        game.time.events.removeAll();
        text.setText("You were smitten/n(Press F5 to reload)");
        boo1.stop();
        boo2.stop();
        failureSound.play();
    }
    function gameWin()
    {
        if(isLevel2){
            game.time.events.removeAll();
            text.setText("The pirates are all tired... You win!/n(Press F5 to reload)");
            boo1.stop();
            boo2.stop();
        }
        else{
            game.time.events.remove(uiCounter);
            game.time.events.remove(meteorLoop);
            meteors.killAll();
            isLevel2=true;
            lineIndex=-1;
            lines= secondLines;
            timer= 30;
            player.velocity=0;
            player.animations.stop();
            gameReady=false;
            nextLine();

        }   
        victorySound.play();
    }
    function floorProcessHandler(meteor, floor)
    {
        return true;
    }
    function playerProcessHandler(meteor, player)
    {
        return true;
    }
};
