import { UITextButton, UIImageButton } from "./UIButton.js";

// This scene handles all the global keyboard input and mouse input
// This is done so that we can disable/pause other scenes but still retain input
export default class InputScene extends Phaser.Scene {

    fieldScene;

    constructor() {
        super({
            key: 'InputScene',
            // transparent: true    // hide this scene
        });
    }

    preload() {
        
        this.fieldScene = this.scene.get('FieldScene'); 

        // Load seeds
        this.load.image('corn_seed', "./public/assets/corn/Corn_seeds.png");
        this.load.image('soybean_seed', "./public/assets/soybean/Soybean_seeds.png");

        // Load tools
        this.load.image('sickle', "./public/assets/Sickle.png")
        this.load.image('watering_can', "./public/assets/Watering_can.png")
        this.load.image('notebook', "./public/assets/Notebook.png")
    }

    create() {

        // Keybinder
        this.input.keyboard.on('keydown-P', () => {         // Triggers once when P is pressed
            this.fieldScene.togglePause();                        // Toggle pause
        });

        // Get scene to place things in the middle
        let { width, height } = this.sys.game.canvas;

        const topButtonRow = []
        const rightButtonColumn = []

        topButtonRow.push(new UIImageButton(this, 0, 0, 'notebook', () => {this.fieldScene.triggerNotebook()}))
        topButtonRow.push(new UIImageButton(this, 0, 0, 'watering_can', () => {this.fieldScene.toolbar.selectTool(3)}))  // TODO not hardcode tool index
        topButtonRow.push(new UIImageButton(this, 0, 0, 'sickle', () => {this.fieldScene.toolbar.selectTool(4)}))  // TODO not hardcode tool index
        topButtonRow.push(new UITextButton(this, 0, 0, 'fertilizer', () => { }))  
        topButtonRow.push(new UITextButton(this, 0, 0, 'soil tester', () => { })) 

        rightButtonColumn.push(new UIImageButton(this, 0, 0, 'notebook', () => {this.fieldScene.triggerNotebook()}))
        rightButtonColumn.push(new UIImageButton(this, 0, 0, 'watering_can', () => {this.fieldScene.toolbar.selectTool(3)}))  // TODO not hardcode tool index
        rightButtonColumn.push(new UIImageButton(this, 0, 0, 'sickle', () => {this.fieldScene.toolbar.selectTool(4)}))  // TODO not hardcode tool index
        rightButtonColumn.push(new UITextButton(this, 0, 0, 'fertilizer', () => { }))  
        rightButtonColumn.push(new UITextButton(this, 0, 0, 'soil tester', () => { })) 
    
        // Define position and length for row. Basically a horizontal line above the playfield
        const topRowStartPos = [350, 50]
        const topRowLen = 500

        for (const buttonIndex in topButtonRow) {
            const button = topButtonRow[buttonIndex]

            const buttonX = topRowStartPos[0] + (topRowLen * (buttonIndex / (topButtonRow.length - 1)) )
            const buttonY = topRowStartPos[1]

            button.setPosition(buttonX, buttonY)

            this.add.existing(button)
        }

        const rightColStartPos = [950, 150]
        const rightColLen = 500

        for (const buttonIndex in rightButtonColumn) {
            const button = rightButtonColumn[buttonIndex]

            const buttonX = rightColStartPos[0]
            const buttonY = rightColStartPos[1] + (rightColLen * (buttonIndex / (rightButtonColumn.length - 1)) )
            

            button.setPosition(buttonX, buttonY)

            this.add.existing(button)
        }

        this.timeTextBox = this.add.text(100, 100, '')

    }

    update() {

        this.timeTextBox.setText(this.formatTime(this.fieldScene.timeRemaining))

    }


    // ChatGPT wrote this
    formatTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        let secs = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

}
