class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");

    this.player = null;
    this.cursors = null;
    this.SPEED = 200;

    //new variables
    this.coins = null;
    this.score = 0;
    this.scoreText = null;
    this.wall = null;

    this.exitBtn = null;

    //Variables
    this.enemy=null;
    this.enemySpeed =120;
    this.enemyDir=1;
    this.enemyMinX = 220;
    this.enemyMaxX=740;
  }

  preload() {
    this.load.spritesheet("Player", "./assets/goku-walk.png", {
      frameWidth: 141,
      frameHeight: 177,
    });

    this.load.image("coin", "./assets/coin.png");

    this.load.image("pauseBtn", "./assets/pause.png");
  }

  create() {
    this.player = this.physics.add.sprite(120, 250, "Player", 0);

    this.player.body.setSize(141 * 0.6, 177 * 0.8, true);
    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: "player-walk",
      frames: this.anims.generateFrameNumbers("Player", { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.input.keyboard.on("keydown-E", () => {
      this.exitToMenu();
    });

    this.exitBtn = this.add.image(770, 30, "pauseBtn");
    this.exitBtn.setScale(0.3);
    this.exitBtn.setOrigin(1, 0);
    this.exitBtn.setScrollFactor(0);
    this.exitBtn.setInteractive({ useHandCursor: true });

    this.exitBtn.on("pointerover", () => this.exitBtn.setAlpha(0.85));
    this.exitBtn.on("pointerout", () => this.exitBtn.setAlpha(1));

    this.exitBtn.on("pointerdown", () => {
      this.exitToMenu();
    });

    const wallRect = this.add.rectangle(330, 225, 100, 100, 0x111111);
    this.wall = this.physics.add.existing(wallRect, true);
    this.physics.add.collider(this.player, this.wall);
    this.createEnemy();

    this.coins = this.physics.add.group();

    this.createCoin(470, 170);
    this.createCoin(300, 110);
    this.createCoin(670, 110);

    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);

    this.scoreText = this.add.text(20, 20, "Score:0");

    this.physics.add.overlap(this.player,this.enemy,this.hitEnemy,null,this);


  }

  exitToMenu() {
    this.registry.set("score", this.score);
    this.scene.start("MenuScene");
  }

  hitEnemy(){
    this.registry.set("score", this.score);
    this.scene.restart();
  }

  createEnemy(){
    const g = this.add.graphics();
    g.fillStyle(0xff3333,1);
    g.fillRect(0,0,50,50);
    g.generateTexture("enemy",50,50);
    g.destroy();

    this.enemy = this.physics.add.sprite(600,250,"enemy");
    this.enemy.setCollideWorldBounds(true);
    this.enemy.body.allowGravity=false;
    this.enemy.setImmovable(true);

    this.enemy.body.setSize(50,50,true);
  }

  createCoin(x, y) {
    const c = this.coins.create(x, y, "coin");
    c.setScale(0.1);
    c.body.setSize(c.width * 0.7, c.height * 0.7, true);
    c.body.allowGravity = false;
  }

  moveEnemy(){
    if(!this.enemy) return;
    this.enemy.setVelocityX(this.enemySpeed*this.enemyDir);
    if(this.enemy.x<=this.enemyMinX){
        this.enemyDir=1;
    }else if(this.enemy.x>= this.enemyMaxX){
        this.enemyDir=-1;
    }
  }

  collectCoin(playerObj, coinObj) {
    coinObj.destroy();
    this.score += 1;
    this.scoreText.setText("Score: " + this.score);
  }

  update() {
    this.moveEnemy();
    const p = this.player;
    const c = this.cursors;
    const SPEED = this.SPEED;
    p.setVelocity(0);

    if (c.left.isDown) {
      p.setVelocityX(-SPEED);
    } else if (c.right.isDown) {
      p.setVelocityX(SPEED);
    }

    if (c.up.isDown) {
      p.setVelocityY(-SPEED);
    } else if (c.down.isDown) {
      p.setVelocityY(SPEED);
    }
    if (p.body.velocity.length() > 0) {
      p.body.velocity.normalize().scale(SPEED);
    }

    const moving = p.body.velocity.length() > 0;

    if (moving) {
      if (p.body.velocity.x < 0) p.setFlipX(true);
      else if (p.body.velocity.x > 0) p.setFlipX(false);

      if (!p.anims.isPlaying) {
        p.anims.play("player-walk", true);
      }
    } else {
      p.anims.stop();
      p.setFrame(0);
    }
  }
}

window.GameScene = GameScene;