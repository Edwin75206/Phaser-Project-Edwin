class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");

    this.player = null;
    this.cursors = null;
    this.SPEED = 200;
    this.coins = null;
    this.score = 0;
    this.scoreText = null;
    this.wall = null;
    this.exitBtn = null;
    //enemy1
    this.enemy=null;
    this.enemySpeed =120;
    this.enemyDir=1;
    this.enemyMinX = 220;
    this.enemyMaxX=740;

    //new variables 
    this.lives = 3;
    this.livesText = null;

    //enemy 2
    this.enemyPink=null;
    this.enemyPinkSpeed =120;
    this.enemyPinkDir=1;
    this.enemyPinkMinY = 110;
    this.enemyPinkMaxY=380;

    //enemy spritesheet
    this.enemy2=null;
    this.enemy2Speed =120;
    this.enemy2Dir=1;
    this.enemy2MinX = 220;
    this.enemy2MaxX=740;

    this.isInvulnerable = false;

    //fin
    this.gameEnded = false;
    this.endUI = null;

    this.restartKey = null;
    this.menuKey = null;

  }

  preload() {
    this.load.spritesheet("Player", "./assets/goku-walk.png", {
      frameWidth: 141,
      frameHeight: 177,
    });

    this.load.image("coin", "./assets/coin.png");

    this.load.image("pauseBtn", "./assets/pause.png");
    this.load.spritesheet("Enemy2","./assets/enemy.png",{
        frameWidth:135,
        frameHeight:120
    });
  }


  init(data){
    if(data && typeof data.score == "number") this.score = data.score;
    if(data && typeof data.lives == "number") this.lives = data.lives;

    this.isInvulnerable = false;
    this.gameEnded = false;

    if(this.physics&&this.physics.world){
        this.physics.resume();
    }
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
    //enemy
    this.createEnemy();
    this.createEnemyPink();
    this.createEnemy2();
    
    //colliders
    this.physics.add.collider(this.player, this.wall);
    this.physics.add.collider(this.enemy,this.wall);
    this.physics.add.collider(this.enemyPink,this.wall);
    this.physics.add.collider(this.enemy2,this.wall);

    this.coins = this.physics.add.group();

    this.createCoin(470, 170);
    this.createCoin(300, 110);
    this.createCoin(670, 110);

    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);

    //this.scoreText = this.add.text(20, 20, "Score:0");

    //HUD
    this.createHUD();
    this.updateHUD();

    //overlap
    this.physics.add.overlap(this.player,this.enemy,this.hitEnemy,null,this);
    this.physics.add.overlap(this.player,this.enemyPink,this.hitEnemy,null,this);
    this.physics.add.overlap(this.player,this.enemy2,this.hitEnemy,null,this);
    

  }

  createHUD(){
    this.scoreText = this.add.text(20, 20, `Score: ${this.score}`);
    this.livesText = this.add.text(20, 45, `Lives: ${this.lives}`);
  }

  updateHUD(){
    if(this.scoreText) this.scoreText.setText(`Score: ${this.score}`);
    if(this.livesText) this.livesText.setText(`Lives: ${this.lives}`);
  }

  exitToMenu() {
    this.registry.set("score", this.score);
    this.scene.start("MenuScene");
  }

  hitEnemy(){

    if(this.gameEnded) return;
    if(this.isInvulnerable) return;

    this.lives -= 1;
    this.updateHUD();

    this.isInvulnerable = true;

    if(this.lives<=0){
        this.showEndScreen("GAME_OVER");
        return;
    }

    this.time.delayedCall(250,()=>{
        this.scene.restart({score:this.score, lives:this.lives});
    })
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

    createEnemyPink(){
    const g = this.add.graphics();
    g.fillStyle(0xff66cc,1);
    g.fillRect(0,0,45,45);
    g.generateTexture("enemyPink",45,45);
    g.destroy();

    this.enemyPink = this.physics.add.sprite(600,250,"enemyPink");
    this.enemyPink.setCollideWorldBounds(true);
    this.enemyPink.body.allowGravity=false;
    this.enemyPink.setImmovable(true);
    this.enemyPink.body.setSize(45,45,true);
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

    moveEnemyPink(){
    if(!this.enemyPink) return;
    this.enemyPink.setVelocityY(this.enemyPinkSpeed*this.enemyPinkDir);
    if(this.enemyPink.y<=this.enemyPinkMinY){
        this.enemyPinkDir=1;
    }else if(this.enemyPink.y>= this.enemyPinkMaxY){
        this.enemyPinkDir=-1;
    }
  }

  collectCoin(playerObj, coinObj) {
    if(this.gameEnded) return;

    coinObj.destroy();
    this.score += 1;
    this.updateHUD();
    if(this.score>=3){
        this.showEndScreen("WIN")
    }
  }
  createEnemy2(){
    this.enemy2 = this.physics.add.sprite(680,200,"Enemy2",0);

    this.enemy2.setCollideWorldBounds(true);
    this.enemy2.body.allowGravity=false;
    this.enemy2.setImmovable(true);
    this.enemy2.body.setSize(135,120,true);
    this.anims.create({
        key:"enemy2-walk",
        frames: this.anims.generateFrameNumbers("Enemy2",{start:0,end:9}),
        frameRate:12,
        repeat:-1,
    });
    this.enemy2.play("enemy2-walk")
  }

  moveEnemy2(){
    if(!this.enemy2||this.gameEnded) return;

    this.enemy2.setVelocityX(this.enemy2Speed* this.enemy2Dir);
    if(this.enemy2.x <=this.enemy2MinX) this.enemy2Dir = 1;
    else if(this.enemy2.x>=this.enemy2MaxX)this.enemy2Dir=-1;

    this.enemy2.setFlipX(this.enemy2Dir < 0);
  }


  showEndScreen(type){
    this.gameEnded=true;
    this.registry.set("score",this.score);
    this.registry.set("last resultado",type);

    this.physics.pause();
    this.player.setVelocity(0,0);
    if(this.enemy)this.enemy.setVelocity(0,0);
    if(this.enemyPink)this.enemyPink.setVelocity(0,0);
    if(this.enemy2)this.enemy2.setVelocity(0,0);

    const w = this.scale.width;
    const h = this.scale.height;

    const bg = this.add.rectangle(w/2,h/2,w,h,0x000000,0.65);

    const title = type === "WIN" ? "¡GANASTE!" :"GAME OVER";

    const msg =
        type ==="WIN"
            ? `Conseguiste ${this.score} monedas`
            :`te quedaste sin vidas. score: ${this.score}`;
    const t1 =this.add
        .text(w/2,h/2-40,title,{fontSize: "56px",fontStyle:"bold"})
        .setOrigin(0.5);
    const t2 = this.add
        .text(w/2,h/2+15,msg,{fontSize:"22px"})
        .setOrigin(0.5)
    const t3 = this.add 
        .text(w/2, h/2 + 60, "presiona R para reinciar | M para menu",{
            fontSize:"18px"
        })
        .setOrigin(0.5);;

    this.endUI = this.add.container(0,0,[bg,t1,t2,t3]);

    if(this.restartKey) this.restartKey.destroy();
    if(this.menuKey) this.menuKey.destroy();

    this.restartKey = this.input.keyboard.addKey("R");
    this.menuKey = this.input.keyboard.addKey("M");

    this.restartKey.once("down",()=>{
        this.physics.resume();
        this.scene.restart({score:0, lives:3});
    })

    this.menuKey.once("down",()=>{
        this.physics.resume();
        this.scene.start("MenuScene");
    })
  }
  update() {
    if (this.gameEnded) return;
    this.moveEnemy();
    this.moveEnemy2();
    this.moveEnemyPink();

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