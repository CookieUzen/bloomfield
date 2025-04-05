import { UITextButton, UIImageButton } from "./UIButton.js";
import { ToolTypes } from "./newToolbar.js";


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

        this.load.image('pause', "./public/assets/pause.png")
    }

    create() {

        // Get scene to place things in the middle
        let { width, height } = this.sys.game.canvas;

        const topButtonRow = []
        const rightButtonColumn = []

        // topButtonRow.push(new UIImageButton(this, 0, 0, 'notebook', () => {this.fieldScene.triggerNotebook()}))
        topButtonRow.push(new UIImageButton(this, 0, 0, 'watering_can', () => {this.fieldScene.toolbar.setToolEquipment('watering_can')}))
        topButtonRow.push(new UIImageButton(this, 0, 0, 'sickle', () => {this.fieldScene.toolbar.setToolEquipment('sickle')}))
        topButtonRow.push(new UIImageButton(this, 0, 0, 'fertilizer', () => {this.fieldScene.toolbar.setToolEquipment('fertilizer')}))  
		topButtonRow.push(new UITextButton(this, 0, 0, '', () => {}))  // Empty button to leave empty spot in toolbar (TODO: move the pause button to a real spot lol)
        topButtonRow.push(new UIImageButton(this, 0, 0, 'pause', () => {this.fieldScene.togglePause()})) 
		
		// load round config

        const config = this.registry.get('config').round
        const roundNum = this.registry.get('round')     // Get the config for the current round
        const roundConfig = (roundNum > config.roundInfinite) ? config['infinite'] : config[roundNum.toString()]

		console.log(roundConfig)

        for (const crop of roundConfig.cropsUnlocked) {
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

        //------------------------------------

        // Pause overlay
        this.pauseOverlay = this.add.rectangle(width/2, height/2, width, height, '0x000000', 0.5)
        this.pauseOverlay.setInteractive()  // Eat the input before it gets to the rest of the game
        this.pauseOverlay.setVisible(false)

        this.unpauseButton = new UIImageButton(this, width/2, height/2, 'pause', () => {this.fieldScene.togglePause()})
        this.add.existing(this.unpauseButton)
        this.unpauseButton.setAbove(this.pauseOverlay)
        this.unpauseButton.setVisible(false)
    

		// Keybinder
        this.input.keyboard.on('keydown-ESC', () => {         // Triggers once when P is pressed
            this.fieldScene.togglePause();                        // Toggle pause
        });

		// TODO remove this when we move the pause button
		this.input.keyboard.on('keydown-T', () => {         // Triggers once when P is pressed
            this.fieldScene.togglePause();                        // Toggle pause
        });

		// Bind keys 1-9 for selecting tools
		const keys = ['Q', 'W', 'E', 'ONE', 'TWO', 'THREE', 'FOUR'];
		const tools = [{type: ToolTypes.EQUIPMENT, toolName: 'watering_can'}, {type: ToolTypes.EQUIPMENT, toolName: 'sickle'}, {type: ToolTypes.EQUIPMENT, toolName: 'fertilizer'}, 
			{type: ToolTypes.SEED, toolName: 'corn'}, {type: ToolTypes.SEED, toolName: 'soybean'}, {type: ToolTypes.SEED, toolName: 'potato'}, {type: ToolTypes.SEED, toolName: 'wheat'}
		]
		keys.forEach((key, index) => {

		if (tools[index].type === ToolTypes.SEED && !roundConfig.cropsUnlocked.includes(tools[index].toolName)) return  // Skip keybinds for seeds not in the config

			this.input.keyboard.on(`keydown-${key}`, () => {
				
				if (tools[index].type === ToolTypes.EQUIPMENT) {
					this.fieldScene.toolbar.setToolEquipment(tools[index].toolName)
				} else {
					this.fieldScene.toolbar.setToolSeed(tools[index].toolName)
				}
			});
		});

		// Dialogue setup
		const dialogueData = this.registry.get('dialogue').round
        this.roundDialogue = (roundNum > config.roundInfinite) ? dialogueData['infinite'] : dialogueData[roundNum.toString()]

		this.dialogueIndex = 0

		const dialogueBackgroundTopLeft = [50, 550]
		const dialogueBackgroundDimensions = [1050, 75]
		const dialogueBackgroundBorderThickness = 10
		this.dialogueBackground = this.add.graphics()
		this.dialogueBackground.fillStyle(0x974B22, 1);
        this.dialogueBackground.fillRoundedRect(dialogueBackgroundTopLeft[0], dialogueBackgroundTopLeft[1], dialogueBackgroundTopLeft[0] + dialogueBackgroundDimensions[0], dialogueBackgroundTopLeft[1] + dialogueBackgroundDimensions[1], 10);
		this.dialogueBackground.fillStyle(0xB95C2C, 1);
        this.dialogueBackground.fillRoundedRect(dialogueBackgroundTopLeft[0] + dialogueBackgroundBorderThickness, dialogueBackgroundTopLeft[1] + dialogueBackgroundBorderThickness, dialogueBackgroundTopLeft[0] + dialogueBackgroundDimensions[0] - 2 * dialogueBackgroundBorderThickness, dialogueBackgroundTopLeft[1] + dialogueBackgroundDimensions[1] - 2 * dialogueBackgroundBorderThickness, 10);
		this.dialogueBackground.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains)  // Make the whole screen interactive for this
		this.dialogueBackground.on('pointerdown', () => {
			this.dialogueIndex += 1  // Increment dialogue
			console.log(this.dialogueIndex)

            // Unpause if we are paused
            if (this.dialogueIndex >= this.roundDialogue.start.speech.length && !this.fieldScene.scene.isActive()) {
                this.fieldScene.togglePause()
            }

		})  // Handle mouse down
        this.dialogueBackground.setVisible(false)

        this.dialogueText = this.add.text(75, 575, '', textStyle)
        this.dialogueText.setAbove(this.dialogueBackground)
        this.dialogueText.setVisible(false)

        // Toolbar
        // Make current tool follow the mouse around
        this.toolSprite = this.add.sprite(0, 0, 'watering_can')
    }

    update() {

        if (!this.fieldScene.scene.isActive()) {
            this.pauseOverlay.setVisible(true)
            this.unpauseButton.setVisible(true)
        } else {
            this.pauseOverlay.setVisible(false)
            this.unpauseButton.setVisible(false)
        }

        if (this.roundDialogue.start && this.dialogueIndex < this.roundDialogue.start.speech.length) {
            // Keep game paused while we are in the dialogue
            if (this.fieldScene.scene.isActive()) {
                this.fieldScene.togglePause()
            }

            this.dialogueBackground.setVisible(true)
            this.dialogueText.setVisible(true)
            this.unpauseButton.setVisible(false)  // Hide the button if the game is paused due to dialogue

            this.dialogueText.setText(this.roundDialogue.start.speech[this.dialogueIndex])

        } else {
            this.dialogueBackground.setVisible(false)
            this.dialogueText.setVisible(false)
        }
		

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
        this.toolSprite.setTexture(this.fieldScene.toolbar.getCurrentToolName())
        this.toolSprite.setPosition(this.game.input.mousePointer.x, this.game.input.mousePointer.y)
    }


    // ChatGPT wrote this
    formatTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        let secs = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

}
