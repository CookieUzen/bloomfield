export default class RoundEndScene extends Phaser.Scene {

    constructor() {
        super({
            key : 'RoundEndScene'
        })
    }

    preload() {

    }

    create() {

        // move the food units from the round to the
        this.registry.inc("totalFoodUnits", this.registry.get("roundFoodUnits"));

        // Get scene to place things in the middle
        let { width, height } = this.sys.game.canvas;

        let round = this.registry.get("round");

        const startButton = this.add.text(0, 0, `End of round ${round}!`)
        startButton.setStyle({fontSize: 100})
        // Position in center of the screen by offsetting center coords by half the text size
        startButton.setPosition(width/2 - startButton.width/2, height/2 - startButton.height/2)
        startButton.setInteractive()
        .on('pointerdown', () => {this.nextRound()})
        .on('pointerover', () => {startButton.setStyle({fill: '#ff0'})})
        .on('pointerout', () => {startButton.setStyle({fill: '#fff'})})

        // Pause for dialogue overlay
        this.pauseOverlay = this.add.rectangle(width/2, height/2, width, height, '0x000000', 0.5)
        this.pauseOverlay.setInteractive()  // Eat the input before it gets to the rest of the game
        this.pauseOverlay.setVisible(false)

        // Dialogue setup
        const roundNum = this.registry.get('round') 
        const config = this.registry.get('config').round
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

		})  // Handle mouse down
        this.dialogueBackground.setVisible(false)

        const textStyle = { color: 'white', font: '20px Ariel' }

        this.dialogueText = this.add.text(75, 575, '', textStyle)
        this.dialogueText.setAbove(this.dialogueBackground)
        this.dialogueText.setVisible(false)

    }

    update() {

        if (this.roundDialogue.end && this.dialogueIndex < this.roundDialogue.end.speech.length) {

            this.dialogueBackground.setVisible(true)
            this.dialogueText.setVisible(true)
            this.pauseOverlay.setVisible(true)

            this.dialogueText.setText(this.roundDialogue.end.speech[this.dialogueIndex])

        } else {
            this.dialogueBackground.setVisible(false)
            this.dialogueText.setVisible(false)
            this.pauseOverlay.setVisible(false)
        }

    }

    nextRound() {
        // Check if the player has enough food units to win
        let goal = this.registry.get("goal");
        let roundFoodUnits = this.registry.get("roundFoodUnits");
    
        if (roundFoodUnits < goal) {
            this.scene.start("GameOverScene");
            return;
        }

        this.registry.inc("round");

        // Reset the food units and harvest bin
        this.registry.set("roundFoodUnits", 0);
        this.registry.set("harvest_bin", {});

        this.scene.get('FieldScene').startRound();
        this.scene.stop();
    }
}
