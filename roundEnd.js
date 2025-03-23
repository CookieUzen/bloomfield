

export default class RoundEndScene extends Phaser.Scene {

    constructor() {
        super({
            key : 'RoundEndScene'
        })
    }

    preload() {

    }

    create(data) {

        console.log(data)

        // Get scene to place things in the middle
        let { width, height } = this.sys.game.canvas;

        const startButton = this.add.text(0, 0, "Start game!")
        startButton.setStyle({fontSize: 100})
        // Position in center of the screen by offsetting center coords by half the text size
        startButton.setPosition(width/2 - startButton.width/2, height/2 - startButton.height/2)
        startButton.setInteractive()
        .on('pointerdown', () => {this.scene.start('FieldScene')})
        .on('pointerover', () => {startButton.setStyle({fill: '#ff0'})})
        .on('pointerout', () => {startButton.setStyle({fill: '#fff'})})

    }

    update() {

    }

}