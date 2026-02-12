const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 450,
  backgroundColor: "#eb0000",
  scene: {
    preload,
    create,
    update,
  },
};
const game = new Phaser.Game(config);

let movingText;

function preload() {
  this.load.image("logo", "./atardecer.jpeg");
}

function create() {
  movingText = this.add.text(40, 40, "Hola Coders", {
    fontSize: "32px",
    color: "#ffffff",
  });

  const img = this.add.image(400, 250, "logo");

  img.setScale(0.3);
}

function update() {
  movingText.x += 0.5;

  if (movingText.x > config.width) {
    movingText.x = -movingText.width;
  }
}
