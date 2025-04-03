
export default class AlertIcon extends Phaser.GameObjects.Sprite {

    constructor(scene, imageKey ) {
        super(scene, 0, 0, imageKey)
        // Add this object to the scene
        scene.add.sprite(this)
    }

    update(time) {
        // Use a really simple sin function to control opacity. Has a discontinuity when game is 
        // paused and unpaused but who cares
        const functionInput = time / 1000 * Math.PI
        this.alpha = (Math.sin(functionInput) + 1) / 2
    }


}
