const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 450,
  backgroundColor: "#020202",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
  scene: [window.MenuScene, window.GameScene],
};

new Phaser.Game(config);

