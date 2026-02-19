class MenuScene extends Phaser.Scene{
    constructor(){
        super("MenuScene");
    }

    preload(){
        this.load.image("start","./assets/start.png")
    }

    create(){
        const bg = this.add.image(500, 300,"start");
        bg.setDisplaySize(1000,700);

        this.add.text("Da clic para inciar");

        bg.setInteractive();
        bg.on("pointerdown",()=>{
            this.scene.start("GameScene");
        });

        this.input.keyboard.on("keydown-ENTER",()=>{
            this.scene.start("GameScene");
        })

        const lastScore = this.registry.get("score")??0;
        this.add.text(20,45,"Last Score: "+ lastScore);
    }
}

window.MenuScene = MenuScene;