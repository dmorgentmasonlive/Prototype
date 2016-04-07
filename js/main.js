
var game = new Phaser.Game(600, 400, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('woods', 'assets/Desert.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/desert.png');
    game.load.image('player', 'assets/p.png');
    game.load.spritesheet('guard', 'assets/guard3.png', 64, 64);
    game.load.image('alarm', 'assets/alarm.png');
    game.load.image('c', 'assets/c.png');
    game.load.image('goal', 'assets/goal.png');
}

var map;
var tileset;
var layer;
var p;
var cursors;
var numbers;
var guard1;
var oneSleep = 0;
var twoSleep = 0;
var threeSleep = 0;
var playerState = 0;
var guard2;
var guard3;

var guard3Move;
var guard2Move;

var alarm;
var target = p;
var help;
var mindText1 = "If that alarm breaks one more time, I'm outta' here!";
var mindText2 = "I have to check on the alarm.";
var mindText3 = "The target can use mind reading, telekinesis, and hypnosis. Got it.";

var timer;
var timer2;
var timer3;

//collision markers
var c1;
var c2;
var c3;
var c4;
var c5;
var c6;

function create() {


    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#787878';

    map = game.add.tilemap('woods');

    map.addTilesetImage('desert', 'tiles');

    //  14 = ? block
    //map.setCollisionBetween(14, 15);
    
    layer = map.createLayer('Tile Layer 1');

    //map.setCollisionBetween(15, 16);
    //map.setCollisionBetween(20, 25);
    //map.setCollisionBetween(27, 29);
    map.setCollision(10);
    
    

    //  Un-comment this on to see the collision tiles
    //layer.debug = true;

    layer.resizeWorld();

    p = game.add.sprite(0, 1000, 'player');
    guard1 = game.add.sprite(384, 480, 'guard');
    guard2 = game.add.sprite(960, 768, 'guard');
    guard3 = game.add.sprite(736, 448, 'guard');
    alarm = game.add.sprite(640, 96, 'alarm');
    
    c1 = game.add.sprite(992, 800, 'c');
    c2 = game.add.sprite(992, 96, 'c');
    c3 = game.add.sprite(779, 509, 'c');
    c4 = game.add.sprite(779, 160, 'c');
    
    goal = game.add.sprite(768, 288, 'goal');

    game.physics.enable(p);
    game.physics.enable(guard1);
    game.physics.enable(guard2);
    game.physics.enable(guard3);
    
    guard1.animations.add('sleep', [1]);
    guard2.animations.add('sleep', [1]);
    guard3.animations.add('sleep', [1]);
    
    guard1.animations.add('wake', [0]);
    guard2.animations.add('wake', [0]);
    guard3.animations.add('wake', [0]);
    
    guard1.inputEnabled = true;
    guard1.events.onInputDown.add(listener, this);
    
    guard2.inputEnabled = true;
    guard2.events.onInputDown.add(listener, this);
    
    guard3.inputEnabled = true;
    guard3.events.onInputDown.add(listener, this);
    
    alarm.inputEnabled = true;
    alarm.events.onInputDown.add(listener, this);
    
    timer = game.time.create(false);
    timer.loop(Phaser.Timer.SECOND*3, timerLoop, this);
    timer.start();
    timer.pause();
    
    timer2 = game.time.create(false);
    timer2.loop(Phaser.Timer.SECOND*3,timerLoop2,this);
    timer2.start();
    timer2.pause();
    
    timer3 = game.time.create(false);
    timer3.loop(Phaser.Timer.SECOND*3,timerLoop3,this);
    timer3.start();
    timer3.pause();


    //game.physics.arcade.gravity.y = 250;

    p.body.bounce.y = 0.2;
    p.body.linearDamping = 1;
    p.body.collideWorldBounds = true;
    
    help = game.add.text(16, 16, 'a', { font: '14px Arial', fill: '#ffffff' });
    help.fixedToCamera = true;

    game.camera.follow(p);

    cursors = game.input.keyboard.createCursorKeys();
    numbers = {one: game.input.keyboard.addKey(Phaser.Keyboard.ONE), two: game.input.keyboard.addKey(Phaser.Keyboard.TWO), three: game.input.keyboard.addKey(Phaser.Keyboard.THREE), four: game.input.keyboard.addKey(Phaser.Keyboard.FOUR), five: game.input.keyboard.addKey(Phaser.Keyboard.FIVE), six: game.input.keyboard.addKey(Phaser.Keyboard.SIX), seven: game.input.keyboard.addKey(Phaser.Keyboard.SEVEN), eight: game.input.keyboard.addKey(Phaser.Keyboard.EIGHT), nine: game.input.keyboard.addKey(Phaser.Keyboard.NINE), zero: game.input.keyboard.addKey(Phaser.Keyboard.ZERO)};

}

function update() {

    game.physics.arcade.collide(p, layer);
    
    if(checkOverlap(p, goal))
    {           
           playerState = 4;
           help.text = "Misson Complete!";
           guard3Move = 0;
    }
    
    if(game.physics.arcade.collide(p,guard1))
    {
        if(oneSleep == 1)
        {
            oneSleep = 0;
            guard1.animations.play('wake', 10, false, false);
        }
        guard1.body.velocity.set(0);
        playerState = 4;
        help.text = "GAME OVER";
    }
    
      if(game.physics.arcade.collide(p,guard2))
      {
        if(twoSleep == 1)
        {
            twoSleep = 0;
            guard2.animations.play('wake', 10, false, false);
        }
        playerState = 4;
        help.text = "GAME OVER";
      }

    p.body.velocity.set(0);
    if(playerState == 0)
    {
        help.text = "Press 1 to Read Minds, 2 to activate alarms, 3 to hypnotize guards.";
        if (cursors.left.isDown)
        {
            p.body.velocity.x = -150;   
        }
        else if (cursors.right.isDown)
        {
            p.body.velocity.x = 150;
        }
        else if (cursors.up.isDown)
        {
            p.body.velocity.y = -150;
        }
        else if (cursors.down.isDown)
        {
            p.body.velocity.y = 150;
        }
        else if (numbers.one.isDown)
        {
            playerState = 1;
            target = p;
        }
        else if (numbers.two.isDown)
        {
            playerState = 2;
            target = p;
        }
        else if (numbers.three.isDown)
        {
            playerState = 3;
            target = p;
        }
    }
    
    if(playerState == 1)
    {
        if (cursors.left.isDown)
        {
            playerState = 0;  
            target = p;
        }
        else if (cursors.right.isDown)
        {
            playerState = 0;
            target = p;
        }
        else if (cursors.up.isDown)
        {
            playerState = 0; 
            target = p;
        }
        else if (cursors.down.isDown)
        {
            playerState = 0;
            target = p;
        }
        game.camera.follow(target);
    }
    
     if(playerState == 2)
    {
        if (cursors.left.isDown)
        {
            playerState = 0;  
        }
        else if (cursors.right.isDown)
        {
            playerState = 0;
        }
        else if (cursors.up.isDown)
        {
            playerState = 0; 
        }
        else if (cursors.down.isDown)
        {
            playerState = 0;
        }
    }
    
      if(playerState == 3)
      {
        if (cursors.left.isDown)
        {
            playerState = 0;  
        }
        else if (cursors.right.isDown)
        {
            playerState = 0;
        }
        else if (cursors.up.isDown)
        {
            playerState = 0; 
        }
        else if (cursors.down.isDown)
        {
            playerState = 0;
        }
    }
    
    if (playerState == 4)
    {
        guard2.body.velocity.set(0);
    }
    else if(twoSleep == 0)
    {
        guard2.body.velocity.y = guard2Move;
        if(checkOverlap(guard2, c1))
        {
            guard2Move = -250;
        }
        if(checkOverlap(guard2, c2))
        {
            guard2Move = 250;
        }
    }
    else if(twoSleep == 1)
    {
        guard2.body.velocity.y = 0;
    }
    
    if(playerState == 4)
    {
        guard3.body.velocity.set(0);
    }
    else if (threeSleep == 0)
    {
        guard3.body.velocity.y = (guard3Move);
        if(checkOverlap(guard3, c3))
        {
            guard3Move = -250;
        }
        if(checkOverlap(guard3, c4))
        {
            guard3Move = 250;
        }
    }
    else if(threeSleep == 1)
    {
        guard3.body.velocity.set(0);
    }

}

function render() {

    //game.debug.body(guard3);
    //game.debug.bodyInfo(p, 32, 320);

}

function checkOverlap(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);
}

function listener(sprite, pointer)
{
        if(playerState == 1 && target == p && sprite != alarm)
        {
         target = sprite;
         if(target == guard1)
         {
             help.text = mindText1;
         }
         else if(target == guard2)
         {
             help.text = mindText2;
         }
         else
        {
            help.text = mindText3;        
        }
        }
    
        else if(playerState == 2 && target == p && sprite == alarm)
        {
            guard1.kill();
            playerState = 0;
        }
    
        else if(playerState == 3 && target == p && sprite != alarm)
        {
            target = sprite;
            if(target == guard1)
            {
                guard1.animations.play('sleep', 10, false, false);
                mindText1 = "zzz";
                timer.resume();
            }
            else if(target == guard2)
            {
                twoSleep = 1;
                guard2.animations.play('sleep', 10, false, false);
                guard2.body.velocity.y = 0;
                mindText2 = "zzz";
                timer2.resume();
            } 
            else if(target == guard3)
            {
                threeSleep = 1;
                guard3.animations.play('sleep', 10, false, false);
                mindText3 = "zzz";
                timer3.resume();
            }
            playerState = 0;
        }
}

function timerLoop()
{
    oneSleep = 0;
    guard1.animations.play('wake', 10, false, false);
    timer.pause();
    mindText1 = "If that alarm breaks one more time, I'm outta' here!";
    help.text = mindText1;
}

function timerLoop2()
{
    twoSleep = 0;
    guard2.animations.play('wake', 10, false, false);
    timer2.pause();
    mindText2 = "I have to check on the alarm.";
    help.text = mindText2;
}

function timerLoop3()
{
    threeSleep = 0;
    guard3.animations.play('wake', 10, false, false);
    timer3.pause();
    mindText3 = "The target can use mind reading, telekinesis, and hypnosis. Got it.";
    help.text = mindText3;
}

