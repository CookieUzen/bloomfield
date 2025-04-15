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

        const backgroundImage = this.add.image(width/2, height/2, 'roundEndImage')

        // Will be joined by \n and displayed
        const statsValuesText = [
            `Time: ${formatTime(this.registry.get('prevRoundTime'))}`
        ]

        // get round config
        const config = this.registry.get('config').round
        const roundNum = this.registry.get('round')     // Get the config for the current round
        const roundConfig = (roundNum > config.roundInfinite) ? config['infinite'] : config[roundNum.toString()]
        const cropGoals = roundConfig.cropGoals
        const harvest_bin = this.registry.get('harvest_bin')
        let cropsSet = new Set();

        // Join the harvest bin and goal together
        for (const crop in harvest_bin) {
            cropsSet.add(crop);
        }
        for (const crop in cropGoals) {
            if (crop === 'minFertilizerLvl') {
                continue
            }

            if (crop === 'total') {
                continue
            }

            cropsSet.add(crop);
        }

        const roundFoodUnits = this.registry.get('roundFoodUnits');
        const goal = this.registry.get('goal');
        if (goal > 0) {
            statsValuesText.push(`${roundFoodUnits >= goal ? '✓ ' : '✗ '}Total Food: ${roundFoodUnits}/${goal}`)
        } else {
            statsValuesText.push(`Total Food: ${roundFoodUnits}`)
        }

        for (const crop of cropsSet) {
            const harvest_bin_text = harvest_bin[crop] ? harvest_bin[crop] : 0;  // If the crop is not in the harvest bin, set it to 0
            const cropGoals_text = cropGoals[crop] ? cropGoals[crop] : 0;  // If the crop is not in the goals, set it to 0
            if (cropGoals_text > 0) {
                statsValuesText.push(`${harvest_bin_text >= cropGoals_text ? '✓ ' : '✗ '}${crop.charAt(0).toUpperCase() + crop.slice(1)}: ${harvest_bin_text}/${cropGoals_text}`)
            } else {
                statsValuesText.push(`${crop.charAt(0).toUpperCase() + crop.slice(1)}: ${harvest_bin_text}`)
            }
            // ChatGPT wrote the uppercase thing ^
        }

        const statsText = this.add.text(360, 300, statsValuesText.join('\n'))
        statsText.setFontSize(30)

        const startButton = new FancyUITextButton(this, width/2, 650, "Next round!", () => {this.nextRound()})
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


// ChatGPT wrote this
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}