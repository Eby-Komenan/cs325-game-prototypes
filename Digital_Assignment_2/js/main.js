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
    
    var phrases= ["Taste egg, human scum!", "Humans will feel my wrath.", "Cluck Cluck, motherclucker!", "I shall sacrifice my eggs for the avian cause."];
    var word = "Phaserd phaser";
    var correct = [];
    var bmd;
    var nextChar=0;
    //Will count the number of erroneous keystrokes, will serve as a penalty.
    var errors=0;
    var spaceKey;
    function preload() {
        // Load an image and call it 'logo'.
        //game.load.image( 'logo', 'assets/phaser.png' );
        game.load.spritesheet('chicken', 'assets/chicken_large.png', 48, 48);
        game.load.sprite('egg', 'assets/egg.png');
        game.load.audio('victory','assets/249524__limetoe__badass-victory.wav');
        game.load.audio('error', 'assets/159367__huminaatio__7-error.wav');
        game.load.audio('failure', 'assets/253174__suntemple__retro-you-lose-sfx.wav');
    }
    
    //var bouncy;
    
    function create() {
        // Create a sprite at the center of the screen using the 'logo' image.
        //bouncy = game.add.sprite( game.world.centerX, game.world.centerY, 'logo' );
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        //bouncy.anchor.setTo( 0.5, 0.5 );
        
        // Turn on the arcade physics engine for this sprite.
        //game.physics.enable( bouncy, Phaser.Physics.ARCADE );
        // Make it bounce off of the world bounds.
        //bouncy.body.collideWorldBounds = true;
        
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        //var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        //var text = game.add.text( game.world.centerX, 15, "Build something amazing.", style );
        //text.anchor.setTo( 0.5, 0.0 );
        
        word= phrases[game.rnd.integerInRange(0,3)];
        //  Here we'll create a simple array where each letter of the word to enter represents one element:
        for (var i = 0; i < word.length; i++)
        {
            correct[i] = false;
        }
        var style = { font: "25px Verdana", fill: "#ffffff", align: "center" };
        var text = game.add.text(game.world.centerX, 15, "Type the following:", style);
        text.anchor.setTo(0.5, 0.0);
        //  This is our BitmapData onto which we'll draw the word being entered
        bmd = game.make.bitmapData(800, 200);
        bmd.context.font = '25px Arial';
        bmd.context.fillStyle = '#ffffff';
        bmd.context.fillText(word, game.world.centerX, 64);
        bmd.addToWorld();
        
        
        
        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        //  Capture all key presses
        game.input.keyboard.addCallbacks(this, null, null, keyPress);
        game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
    }
    
    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, game.input.activePointer, 500, 500, 500 );
        if (this.spaceKey.isDown)
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
            }
        else
        {
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
        }
        else
        {
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
                bmd.context.fillStyle = '#00ff00';
            }
            else
            {
                bmd.context.fillStyle = '#ffffff';
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
        var style = { font: "70px Verdana", fill: "#9999ff", align: "center" };
        var text = game.add.text(game.world.centerX, 300, "Fire!", style);
        text.anchor.setTo(0.5, 0.0);
        if(errors<7)
        {
             gameWin();
        }
        else
        {
            gameLose();
        }
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
    
};
