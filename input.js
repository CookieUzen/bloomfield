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
        this.input.keyboard.on('keydown-P', () => {         // Triggers once when P is pressed
            var mainScene = this.scene.get('MainScene');    // Get the main scene
            mainScene.togglePause();                        // Toggle pause
        });
	}

	create() {

	}

	update() {

	}
}
