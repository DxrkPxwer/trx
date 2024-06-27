var playState = 1;
var endState = 0;
var curState = playState;

var trex, trex_run, trex_collide;
var ground, invisibleGround, groundTexture;

var cloudsGroup, cloudTexture;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backTexture;
var score;
var jumpSfx, collideSfx;
var sunAnimation;
var sun;

var gameOverTexture;
var restartTexture;

var gameOverSubstate, restart;


function preload()
    {
        jumpSfx = loadSound("assets/sounds/jump.wav");
        collideSfx = loadSound("assets/sounds/collided.wav");

        backTexture = loadImage('assets/images/sky.png');
        sunAnimation = loadImage('assets/images/sun.png');

        trex_run = loadAnimation('assets/images/Dino-neutral.gif');
        trex_collide = loadAnimation('assets/images/dead.gif',);

        groundTexture = loadImage('assets/images/ground.png');

        cloudTexture =  loadImage('assets/images/cloud.png');

        obstacle1 = loadImage('assets/images/caactus1.png');
        obstacle2 = loadImage('assets/images/caactus2.png');
        obstacle3 = loadImage('assets/images/caactus3.png');
        obstacle4 = loadImage('assets/images/caactus4.png');

        gameOverTexture = loadImage('assets/images/gaemaver.png');
        restartTexture = loadImage('assets/images/reset.png');


        
    }
function setup()
    {
        createCanvas(1280, 720);
        sun = createSprite(width - 50, 100, 10, 10);
        sun.addAnimation('sun', sunAnimation);
        sun.scale = 0.1;

        trex = createSprite(50, height - 70, 20, 50);

        trex.addAnimation('running', trex_run);
        trex.addAnimation('collided', trex_collide);
        trex.setCollider('circle', 0, 0, 350);
        trex.scale = 0.8;
        trex.debug = true;

        invisibleGround = createSprite(width / 2, height - 10, width, 125);
        invisibleGround.shapeColor = '#f4cbaa';

        ground = createSprite(width / 2, height / 2 - 50);
        ground.addImage('ground', groundTexture);
        ground.x = width / 2;
        ground.velocityX = -(6 +3 * score / 100);

        gameOverSubstate = createSprite(width / 2, height / 2 - 50);
        gameOverSubstate.addImage('gameOverSubstate',gameOverTexture);

        restart = createSprite(width / 2, height / 2);
        restart.addImage('restart',restartTexture);

        gameOverSubstate.scale = 0.5;
        restart.scale = 0.5;

        gameOverSubstate.visible = false;
        restart.visible = false;

        cloudsGroup = new Group();
        obstaclesGroup = new Group();

        score = 0

    }
function draw()
    {
        background(backTexture);
        textSize(20);
        fill('black');
        text('Score: ' + score, 30, 50);

        if (curState == playState) 
            {
                score = score + Math.round(getFrameRate() / 60);
                ground.velocityX = -(6 + 3 * score / 100);

                if (keyDown('UP') && trex.y >= height - 120)
                    {
                        jumpSfx.play();
                        trex.velocityY = -10;
                    }
                trex.velocityY = trex.velocityY + 0.8;

                if (ground.x < 0)
                {
                    ground.x = ground.width / 2;
                }
                
                trex.collide(invisibleGround);
                spawnClouds();
                spawnObstacles();

                if (obstaclesGroup.isTouching(trex))
                    {
                        collideSfx.play()
                        curState = endState;
                    }
            }
        else if (curState == endState)
        {
                gameOverSubstate.visible = true;
                restart.visible = true;

                ground.velocityX = 0;
                trex.velocityX = 0;
                obstaclesGroup.setVelocityXEach(0);
                cloudsGroup.setVelocityXEach(0);

                trex.changeAnimation("collided", trex_collide);

                obstaclesGroup.setLifetimeEach(-1);
                cloudsGroup.setLifetimeEach(-1);

                if (keyDown("SPACE"))
                    {
                        reset();
                    }
        }
        drawSprites();
                
    }
function spawnClouds()
{
    if (frameCount % 60 === 0){
        var cloud =createSprite(width + 20, height - 300, 40, 10);
        cloud.y = Math.round(random(100, 220));
        cloud.scale = 0.5;
        cloud.velocityX = -3;

        cloud.lifetime = 300;

        cloud.depth = trex.depth;
        trex.depth = trex.depth = 1;

        cloudsGroup.add(cloud);
    }
}

function spawnObstacles() {
    if(frameCount % 60 === 0){
        var obstacle = createSprite(600, height - 95, 20, 30);
        obstacle.setCollider('circle', 0, 0, 45);

        obstacle.velocityX = -(6 + 3 * score /100);

        var rand = Math.round(random(1,2));
        switch (rand) {
            case 1:
                obstacle.addImage(obstacle1);
                break;
            case 2:
                obstacle.addImage(obstacle2);
        
            default:
                break;
        }


        obstacle.scale = 0.3;
        obstacle.lifetime = 300;
        obstacle.depth = trex.depth;
        trex.depth += 1;

        obstaclesGroup.add(obstacle);
    }
}

function reset () {
    curState = playState;
    gameOverSubstate.visible = false;
    restart.visible = false;

    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();

    trex.changeAnimation('running', trex_run);

    score = 0;
}