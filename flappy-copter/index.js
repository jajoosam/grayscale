    var innerWidth = window.innerWidth;
	var innerHeight = window.innerHeight;
	var gameRatio = innerWidth/innerHeight*2.7;	
	var game = new Phaser.Game(Math.ceil(200*gameRatio), 200, Phaser.CANVAS);	


var mainState = {
    preload: function(){
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.setScreenSize(true);
        game.load.image("bird", "https://res.cloudinary.com/jajoosam/image/upload/v1493549938/copter_fimubx.png");
        game.load.image("pipe", "https://res.cloudinary.com/jajoosam/image/upload/v1493549937/pipe_eu3mgl.png");
        game.load.audio('jump', 'https://res.cloudinary.com/jajoosam/video/upload/v1493550231/jump_kuyusj.wav', "http://res.cloudinary.com/jajoosam/video/upload/v1493620286/jump_bolljl.ogg"); 
    },
    create: function(){
        game.stage.backgroundColor = "#EEE";
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.bird = game.add.sprite(100,100, "bird");
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 500;
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        game.input.onDown.add(this.jump, this);
        this.pipes = game.add.group(); 
        this.timer = game.time.events.loop(2000, this.addRowOfPipes, this); 
        this.score = 0;
        this.labelScore = game.add.text(game.width-20, 20, "0", { font: "30px VT323", fill: "#3D3D3D" }); 
        this.jumpSound = game.add.audio('jump'); 
        this.bird.anchor.setTo(0,0); 

    },
    update: function(){
    if (this.bird.y > 200 || this.bird.y<0)
        this.restartGame();
    game.physics.arcade.overlap(
    this.bird, this.pipes, this.hitPipe, null, this);
    if (this.bird.angle < 20)
        this.bird.angle += 1; 
    },
    jump: function() {
        if (this.bird.alive == false)
            return;
    // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -175;
        this.jumpSound.play();
        // Create an animation on the bird
        var animation = game.add.tween(this.bird);

        // Change the angle of the bird to -20° in 100 milliseconds
        animation.to({angle: -20}, 100);

        // And start the animation
        animation.start(); 
},
    hitPipe: function() {
        // If the bird has already hit a pipe, do nothing
        // It means the bird is already falling off the screen
        if (this.bird.alive == false)
            return;

        // Set the alive property of the bird to false
        this.bird.alive = false;

        // Prevent new pipes from appearing
        game.time.events.remove(this.timer);

        // Go through all the pipes, and stop their movement
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);
    }, 
// Restart the game
    restartGame: function() {
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    },
    addOnePipe: function(x, y) {
        // Create a pipe at the position x and y
        var pipe = game.add.sprite(x, y, 'pipe');

        // Add the pipe to our previously created group
        this.pipes.add(pipe);

        // Enable physics on the pipe 
        game.physics.arcade.enable(pipe);

        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200; 

        // Automatically kill the pipe when it's no longer visible 
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    
    addRowOfPipes: function() {
        // Randomly pick a number between 1 and 5
        // This will be the hole position
        var hole = Math.floor(Math.random() * 4) + 1;

        // Add the 6 pipes 
        // With one big hole at position 'hole' and 'hole + 1'
        for (var i = 0; i < 7; i++){
            if (i != hole && i != hole+1){
              if(game.width<600){
                this.addOnePipe(game.width, i * 33);   
            }
              else{
                this.addOnePipe(400, i * 33); 
              }
            }
        }
        this.score+=1;
        this.labelScore.text = this.score-1;
    }
    
};

    game.state.add("main", mainState);
    game.state.start("main");

