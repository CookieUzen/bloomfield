// This scene handles all the global keyboard input and mouse input
// This is done so that we can disable/pause other scenes but still retain input
export default class InputScene extends Phaser.Scene {
    constructor() {
        super({
			key: 'InputScene',
			transparent: true	// hide this scene
		});
    }

	preload() {
        // Keybinder
		this.keyObjects = this.input.keyboard.addKeys({
            pause: "p",
        });
	}

	create() {

	}

	update() {
        // Pause the game
        if (this.input.keyboard.checkDown(this.keyObjects.pause, 100)) { // if "p" is pressed for 100ms
			var mainScene = this.scene.get('MainScene');
			mainScene.togglePause();
        }
	}
}
