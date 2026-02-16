const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 450,
  backgroundColor: "#eb0000",
  pixelArt:true,
  physics:{
    default: "arcade",
    arcade: {debug : false}
  },
  scene: {
    preload,
    create,
    update,
  },
};
const game = new Phaser.Game(config);

let player;
let cursors;
let SPEED = 200;

//new variables
let coins;
let score = 0;
let scoreText;
let wall;


function preload() {
    this.load.image("Player", "./assets/Player.png");
    this.load.image("coin", "./assets/coin.png")
}

function create() {
    player = this.physics.add.sprite(400, 250, "Player");
    player.setScale(0.15);
    player.body.setSize(player.width * 0.6, player.height * 0.8, true);
    player.setCollideWorldBounds(true);
    cursors = this.input.keyboard.createCursorKeys();

    const wallRect = this.add.rectangle(330,225,100,100, 0x111111);
    wall = this.physics.add.existing(wallRect,true);
    this.physics.add.collider(player,wall);

    coins = this.physics.add.group();
    
    createCoin(470,170);
    createCoin(300,110);
    createCoin(670,110);

    this.physics.add.overlap(player,coins,collectCoin,null,this);

    scoreText = this.add.text(20,20,"Score:0");
}


function createCoin(x, y){
    const c = coins.create(x, y, "coin");
    c.setScale(0.10);
    c.body.setSize(c.width * 0.7, c.height*0.7, true);
    c.body.allowGravity= false;
}

function collectCoin(playerObj, coinObj){
    coinObj.destroy();
    score += 1;
    scoreText.setText("Score: "+ score);
}

function update() {
    player.setVelocity(0);

    if(cursors.left.isDown){
        player.setVelocityX(-SPEED); 
    }
    else if(cursors.right.isDown){
        player.setVelocityX(SPEED);
    }

    if(cursors.up.isDown){
        player.setVelocityY(-SPEED);
    }
    else if(cursors.down.isDown){
        player.setVelocityY(SPEED);
    }
    if (player.body.velocity.length()>0){
        player.body.velocity.normalize().scale(SPEED);
    }
}
