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

    }

    update() {

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
