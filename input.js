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

        // Load tools for mouse cursor
        this.load.image('sickle', "./public/assets/Sickle.png")
        this.load.image('watering_can', "./public/assets/Watering_can.png")
        this.load.image('fertilizer', "./public/assets/Fertilizer.png")
    }

    create() {

        // Keybinder
        this.input.keyboard.on('keydown-ESC', () => {         // Triggers once when P is pressed
            this.fieldScene.togglePause();                        // Toggle pause
        });

		// TODO remove this when we move the pause button
		this.input.keyboard.on('keydown-T', () => {         // Triggers once when P is pressed
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
		topButtonRow.push(new UITextButton(this, 0, 0, '', () => {}))  
        topButtonRow.push(new UITextButton(this, 0, 0, 'pause', () => {this.fieldScene.togglePause()})) 

		const cropData = this.cache.json.get('cropData')
        for (const crop of Object.keys(cropData)) {
			rightButtonColumn.push(new UIImageButton(this, 0, 0, crop + '_seed', () => { this.fieldScene.toolbar.setToolSeed(crop)}))  
		}
    
        // Define position and length for row. Basically a horizontal line above the playfield
        const topRowStartPos = [425 - 1, 75]
        const topRowSpacing = 88

        for (const buttonIndex in topButtonRow) {
            const button = topButtonRow[buttonIndex]

            const buttonX = topRowStartPos[0] + (topRowSpacing * buttonIndex)
            const buttonY = topRowStartPos[1]

            button.setPosition(buttonX, buttonY)

            this.add.existing(button)
        }

        const rightColStartPos = [975, 275 - 1]
        const rightColSpacing = 88

        for (const buttonIndex in rightButtonColumn) {
            const button = rightButtonColumn[buttonIndex]

            const buttonX = rightColStartPos[0]
            const buttonY = rightColStartPos[1] + (rightColSpacing * buttonIndex)
            

            button.setPosition(buttonX, buttonY)

            this.add.existing(button)
        }

		const textBackgroundTopLeft = [50, 75]
		const textBackgroundDimensions = [175, 75]
		const textBackgroundBorderThickness = 10
		this.textBackground = this.add.graphics()
		this.textBackground.fillStyle(0x974B22, 1);
        this.textBackground.fillRoundedRect(textBackgroundTopLeft[0], textBackgroundTopLeft[1], textBackgroundTopLeft[0] + textBackgroundDimensions[0], textBackgroundTopLeft[1] + textBackgroundDimensions[1], 10);
		this.textBackground.fillStyle(0xB95C2C, 1);
        this.textBackground.fillRoundedRect(textBackgroundTopLeft[0] + textBackgroundBorderThickness, textBackgroundTopLeft[1] + textBackgroundBorderThickness, textBackgroundTopLeft[0] + textBackgroundDimensions[0] - 2 * textBackgroundBorderThickness, textBackgroundTopLeft[1] + textBackgroundDimensions[1] - 2 * textBackgroundBorderThickness, 10);

        // Info boxes on the top left corner
		const textStyle = { color: 'white', font: '20px Ariel' }

        this.roundTextBox = this.add.text(75, 100, '', textStyle)

        this.timeTextBox = this.add.text(75, 120, '', textStyle)

        this.moneyTextBox = this.add.text(75, 140, '', textStyle)

        // Display goal and current food units
        this.goalTextBox = this.add.text(75, 160, '', textStyle)

        this.roundFoodUnitsTextBox = this.add.text(75, 180, '', textStyle)

        // Toolbar
        // Make current tool follow the mouse around
        this.toolSprite = this.add.sprite(0, 0, 'watering_can')
        //------------------------------------
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

        // Toolbar
        let inputScene = this.scene.get("FieldScene")
        this.toolSprite.setTexture(inputScene.toolbar.getCurrentToolName())
        this.toolSprite.setPosition(this.game.input.mousePointer.x, this.game.input.mousePointer.y)
    }


    // ChatGPT wrote this
    formatTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        let secs = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

}
