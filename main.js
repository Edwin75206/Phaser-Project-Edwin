const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 450,
  backgroundColor: "#eb0000",
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


function preload() {
    this.load.image("Player", "./assets/Player.png");
}

function create() {
    player = this.physics.add.sprite(400, 250, "Player");
    player.setScale(0.15);
    player.body.setSize(player.width * 0.6, player.height * 0.8, true);
    player.setCollideWorldBounds(true);
    cursors = this.input.keyboard.createCursorKeys();
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
