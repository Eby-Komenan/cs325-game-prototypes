"use strict";

window.onload = function () {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });
    
    function preload() {
        //Load a background image.
        game.load.image('background','assets/starfield.jpg');
        //Load a button spritesheet.
        game.load.spritesheet('button', 'assets/button_sprite_sheet.png', 193, 71);
        // Load the success audio track and call it 'successTone'.
        game.load.audio('successTone','assets/109662__grunz__success.wav');
        // Load the failure audio track and call it 'failureTone'.
        game.load.audio('failureTone','assets/342756__rhodesmas__failure-01.wav');
    }
    
    var leftButton;
    var middleButton;
    var rightButton;
    var background;
    var bouncy;
    var commandText;
    var winOrFailText;
    //Time before the game issues a command.
    var timer= game.rnd.realInRange(3,6);
    //Time after the command is issued that the player must execute an action.
    var timeLimit=1.0;
    var commandIssued=false;
    var buttonPressed=false;
    
    function create() {
        // Create a sprite at the center of the screen using the 'logo' image.
        bouncy = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        bouncy.anchor.setTo(0.5, 0.5);
        
        // Turn on the arcade physics engine for this sprite.
        game.physics.enable(bouncy, Phaser.Physics.ARCADE);
        // Make it bounce off of the world bounds.
        bouncy.body.collideWorldBounds = true;
        
        //Add a background to the game.
        background = game.add.tileSprite(0, 0, 800, 600, 'background');
        //Add the buttons and give them appropriate names.
        leftButton = game.add.button(game.world.centerX - 200, 400, 'leftButton', leftActionOnClick, this, 2, 1, 0);
        middleButton= game.add.button(game.world.centerX - 95, 400, 'middleButton', middleActionOnClick, this, 2, 1, 0);
        rightButton= game.add.button(game.world.centerX +100, 400, 'rightButton', rightActionOnClick, this, 2, 1, 0);
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        var text = game.add.text(game.world.centerX, 15, "Simon says:", style);
        text.anchor.setTo(0.5, 0.0);
        commandText=game.add.text(game.world.centerX, 10, "", style);
        winOrFailText=game.add.text(game.world.centerX, 0, "",style);
    }
    
    function gameWin(){
        winOrFailText.setText("You win! Press F5 to reload.");
        var sounds = game.add.audio('successTone');
        sounds.play();
    }
    
    function gameLose(){
        winOrFailText.setText("You lost... Press F5 to reload.");
        var sounds = game.add.audio('failureTone');
        sounds.play();
    }
    //Returns a random integer.
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    function issueCommand(){
        var stringArray=["Left","Middle","Right","Not left","Not middle","Not right"];
        commandIssued=true;
        return stringArray[getRandomInt(6)];
    }
    
    function leftActionOnClick(){
        buttonPressed=true;
        if(commandIssued){
            if(((commandText.text==="Left")||commandText.text==="Not middle")||commandText.text==="Not right"){
                gameWin();
            }
            else{
                gameLose();
            }
        }
    }
    
    function rightActionOnClick(){
        buttonPressed=true;
        if(commandIssued){
            if(((commandText.text==="Right")||commandText.text==="Not middle")||commandText.text==="Not left"){
                gameWin();
            }
            else{
                gameLose();
            }
        }
    }
    
    function middleActionOnClick(){
        buttonPressed=true;
        if(commandIssued){
            if(((commandText.text==="Middle")||commandText.text==="Not right")||commandText.text==="Not Left"){
                gameWin();
            }
            else{
                gameLose();
            }
        }
    }
    
    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //bouncy.rotation = game.physics.arcade.accelerateToPointer(bouncy, game.input.activePointer, 500, 500, 500);
        
        //After a random amount of time, issue a command.
        if(Math.abs(game.time.totalElapsedSeconds()- timer) < Number.EPSILON){
            commandText.setText(issueCommand());
        }
        //Lose the game if the player doesn't press a button after the time limit.
        if((Math.abs(game.time.totalElapsedSeconds()- (timer+timeLimit)) < Number.EPSILON)&&!buttonPressed){
             
             gameLose();
         }
    }
};
