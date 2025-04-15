import { FancyUITextButton } from './UIButton';

export default class RoundEndScene extends Phaser.Scene {

    constructor() {
        super({
            key : 'RoundEndScene'
        })
    }

    preload() {
        this.load.image('roundEndImage', "./public/assets/Round_end.png")
    }

    create() {

        // move the food units from the round to the
        this.registry.inc("totalFoodUnits", this.registry.get("roundFoodUnits"));

        // Get scene to place things in the middle
        let { width, height } = this.sys.game.canvas;

        let round = this.registry.get("round");

        const backgroundImage = this.add.image(width/2, height/2, 'roundEndImage')

        // Will be joined by \n and displayed
        // TODO put more in here
        const statsValuesText = [
            `You harvested ${this.registry.get("roundFoodUnits")} food units this round!`,
            `You needed ${this.registry.get("goal")} food units to win.`
        ]
        const statsText = this.add.text(500, 300, statsValuesText.join('\n'))

        const startButton = new FancyUITextButton(this, width/2, 500, "Next round!", () => {this.nextRound()})
        this.add.existing(startButton)


    }

    update() {

    }

    nextRound() {
        let fieldScene = this.scene.get('FieldScene');

        // If in infinite mode, check if the player has enough food units to win
        if (fieldScene.useTimeRemaining) {
            let goal = this.registry.get("goal");
            let roundFoodUnits = this.registry.get("roundFoodUnits");
        
            if (roundFoodUnits < goal) {
                this.scene.start("GameOverScene");
                return;
            }
        }

        this.registry.inc("round");

        // Reset the food units and harvest bin
        this.registry.set("roundFoodUnits", 0);
        this.registry.set("harvest_bin", {});

        this.scene.get('FieldScene').startRound();
        this.scene.stop();
    }
}
