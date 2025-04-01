import { UITextButton, UIImageButton } from "./UIButton.js";
import { ToolTypes, EquipmentTypes } from "./newToolbar.js";


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

        // topButtonRow.push(new UIImageButton(this, 0, 0, 'notebook', () => {this.fieldScene.triggerNotebook()}))
        topButtonRow.push(new UIImageButton(this, 0, 0, 'watering_can', () => {this.fieldScene.toolbar.setToolEquipment('watering_can')}))  // TODO keybinds
        topButtonRow.push(new UIImageButton(this, 0, 0, 'sickle', () => {this.fieldScene.toolbar.setToolEquipment('sickle')}))  // TODO not hardcode tool index
        topButtonRow.push(new UIImageButton(this, 0, 0, 'fertilizer', () => {this.fieldScene.toolbar.setToolEquipment('fertilizer')}))  
        topButtonRow.push(new UITextButton(this, 0, 0, 'pause', () => {this.fieldScene.togglePause()})) 

		const cropData = this.cache.json.get('cropData')
        for (const crop of Object.keys(cropData)) {
			rightButtonColumn.push(new UIImageButton(this, 0, 0, crop + '_seed', () => { this.fieldScene.toolbar.setToolSeed(crop)}))  
		}
    
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


        // Info boxes on the top left corner
        this.roundTextBox = this.add.text(100, 100, '')

        this.timeTextBox = this.add.text(100, 120, '')

        this.moneyTextBox = this.add.text(100, 140, '')

        // Display goal and current food units
        this.goalTextBox = this.add.text(100, 160, '')

        this.roundFoodUnitsTextBox = this.add.text(100, 180, '')
    }

    update() {

        // Update our info boxes
        let round = this.registry.get('round')
        this.roundTextBox.setText(`Round: ${round}`)

        // Add a little clock to the left?
        let timeRemaining = this.formatTime(this.fieldScene.timeRemaining);
        this.timeTextBox.setText(`Time: ${timeRemaining}`);

        let money = this.registry.get('money')
        this.moneyTextBox.setText(`Money: $${money}`)

        let goal = this.registry.get('goal')
        this.goalTextBox.setText(`Goal: ${goal}`)

        this.roundFoodUnitsTextBox.setText(`Round Food Units: ${this.registry.get('roundFoodUnits')}`)
    }


    // ChatGPT wrote this
    formatTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        let secs = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

}
