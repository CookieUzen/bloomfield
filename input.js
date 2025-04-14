import { UITextButton, UIImageButton, UIImageButtonWithText } from "./UIButton.js";
import { ToolTypes } from "./newToolbar.js";


// This scene handles all the global keyboard input and mouse input
// This is done so that we can disable/pause other scenes but still retain input
export default class InputScene extends Phaser.Scene {

    fieldScene;
    topButtonRow;

    constructor() {
        super({
            key: 'InputScene',
            // transparent: true    // hide this scene
        });
    }

    preload() {
        
        this.fieldScene = this.scene.get('FieldScene'); 

        this.load.image('pause', "./public/assets/Pause.png")

        this.load.image('mayor_text', "./public/assets/Mayor_text.png")
        this.load.image('biologist_text', "./public/assets/Biologist_text.png")
        this.load.image('villager_text', "./public/assets/Villager_text.png")

        this.load.image('mayor_more_text', "./public/assets/More_text_orange.png")
        this.load.image('biologist_more_text', "./public/assets/More_text_blue.png")
        this.load.image('villager_more_text', "./public/assets/More_text_green.png")
    }

    create() {

        // Get scene to place things in the middle
        let { width, height } = this.sys.game.canvas;

        // Top buttons
        this.topButtonRow = []
        const rightButtonColumn = []

        // topButtonRow.push(new UIImageButton(this, 0, 0, 'notebook', () => {this.fieldScene.triggerNotebook()}))
        this.topButtonRow.push(new UIImageButton(this, 0, 0, 'watering_can', () => {this.fieldScene.toolbar.setToolEquipment('watering_can')}))
        this.topButtonRow.push(new UIImageButton(this, 0, 0, 'sickle', () => {this.fieldScene.toolbar.setToolEquipment('sickle')}))
        this.topButtonRow.push(new UIImageButtonWithText(this, 0, 0, 'fertilizer', 0, () => {this.fieldScene.toolbar.setToolEquipment('fertilizer')}))  
		this.topButtonRow.push(new UITextButton(this, 0, 0, '', () => {}))  // Empty button to leave empty spot in toolbar (TODO: move the pause button to a real spot lol)
        this.topButtonRow.push(new UIImageButton(this, 0, 0, 'pause', () => {this.fieldScene.togglePause()})) 

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

        for (const buttonIndex in this.topButtonRow) {
            const button = this.topButtonRow[buttonIndex]

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

        // Info boxes on the top left corner
		const textBackgroundTopLeft = [50, 75]
		const textBackgroundDimensions = [175, 75]
		const textBackgroundBorderThickness = 10
		this.textBackground = this.add.graphics()
		this.textBackground.fillStyle(0x974B22, 1);
        this.textBackground.fillRoundedRect(textBackgroundTopLeft[0], textBackgroundTopLeft[1], textBackgroundTopLeft[0] + textBackgroundDimensions[0], textBackgroundTopLeft[1] + textBackgroundDimensions[1], 10);
		this.textBackground.fillStyle(0xB95C2C, 1);
        this.textBackground.fillRoundedRect(textBackgroundTopLeft[0] + textBackgroundBorderThickness, textBackgroundTopLeft[1] + textBackgroundBorderThickness, textBackgroundTopLeft[0] + textBackgroundDimensions[0] - 2 * textBackgroundBorderThickness, textBackgroundTopLeft[1] + textBackgroundDimensions[1] - 2 * textBackgroundBorderThickness, 10);

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
        this.currentDialogueSet
        this.currentDialogueCharacter = 'mayor'

        // Initially add the beginning dialogue
        this.currentDialogueSet = this.roundDialogue.start.speech
        this.currentDialogueCharacter = this.roundDialogue.start.character

		this.dialogueBackground = this.add.image(width/2, 600, `${this.currentDialogueCharacter}_text`)
        this.dialogueBackground.setScale(6.25)
		this.dialogueBackground.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains)  // Make the whole screen interactive for this
		.on('pointerdown', () => {
			this.dialogueIndex += 1  // Increment dialogue
			console.log(this.dialogueIndex)

            // Unpause if we are paused
            if (this.dialogueIndex >= this.currentDialogueSet.length && !this.fieldScene.scene.isActive()) {
                this.fieldScene.togglePause()
            }

		})  // Handle mouse down
        this.dialogueBackground.setVisible(false)

        this.dialogueText = this.add.text(350, 575, '', textStyle)
        this.dialogueText.setScale(2)
        this.dialogueText.setAbove(this.dialogueBackground)
        this.dialogueText.setVisible(false)

        this.moreDialogueIndicator = this.add.image(1000, 700, `${this.currentDialogueCharacter}_more_text`)
        this.moreDialogueIndicator.setScale(4)
        this.moreDialogueIndicator.setVisible(false)

        // Toolbar
        // Make current tool follow the mouse around
        this.toolSprite = this.add.sprite(0, 0, 'watering_can')
        this.toolSprite.setScale(3)
    }

    update() {

        if (!this.fieldScene.scene.isActive()) {
            this.pauseOverlay.setVisible(true)
            this.unpauseButton.setVisible(true)
        } else {
            this.pauseOverlay.setVisible(false)
            this.unpauseButton.setVisible(false)
        }

        // if we are reading dialogue, show the box and force pause the game
        if (this.currentDialogueSet && this.dialogueIndex < this.currentDialogueSet.length) {
            // Keep game paused while we are in the dialogue
            if (this.fieldScene.scene.isActive()) {
                this.fieldScene.togglePause()
            }

            this.dialogueBackground.setVisible(true)
            this.dialogueText.setVisible(true)
            this.unpauseButton.setVisible(false)  // Hide the button if the game is paused due to dialogue

            if (this.dialogueIndex + 1 < this.currentDialogueSet.length) {
                this.moreDialogueIndicator.setVisible(true)
            } else {
                this.moreDialogueIndicator.setVisible(false)
            }

            this.dialogueText.setText(this.currentDialogueSet[this.dialogueIndex])
            this.dialogueBackground.setTexture(`${this.currentDialogueCharacter}_text`)
            this.moreDialogueIndicator.setTexture(`${this.currentDialogueCharacter}_more_text`)

        } else {
            this.dialogueBackground.setVisible(false)
            this.dialogueText.setVisible(false)

            if (!this.fieldScene.roundInProgress) {
                this.fieldScene.closeRound()
            }
        }
		

        // Update our info boxes
        let round = this.registry.get('round')
        this.roundTextBox.setText(`Round: ${round}`)

        // Add a little clock to the left?
        let chosenTimer = this.fieldScene.useTimeRemaining ? this.fieldScene.timeRemaining : this.fieldScene.timer    // choose the right timer
        let timeText = this.formatTime(chosenTimer + 1);  // Add one so that the timer feels more natural and ends when it hits 0 and not a second later
        this.timeTextBox.setText(`Time: ${timeText}`);

        let money = this.registry.get('money')
        this.moneyTextBox.setText(`Money: $${money}`)

        let goal = this.registry.get('goal')
        this.goalTextBox.setText(`Goal: ${goal}`)

        this.roundFoodUnitsTextBox.setText(`Round Food Units: ${this.registry.get('roundFoodUnits')}`)

        // Toolbar
        this.toolSprite.setTexture(this.fieldScene.toolbar.getCurrentToolName())
        this.toolSprite.setPosition(this.game.input.mousePointer.x, this.game.input.mousePointer.y)

        // Update fertilizer left
        const toolbar = this.fieldScene.toolbar;
        this.topButtonRow[2].text.setText(toolbar.getFertilizerLeft());  // Update the fertilizer left text
    }


    // ChatGPT wrote this
    formatTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        let secs = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

}
