import toml from 'toml'; // Import toml parser
import { FancyUITextButton } from './UIButton';

// This is the start scene. It will be the first scene to load and will handle the loading of the other scenes.
// This is also the Title Screen of the game.
export default class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        this.load.image('titleImage', "./public/assets/Title.png")
    }

    create() {
        // Scary code to load config.toml
        const tomlField = document.getElementById('tomlInput'); // From debug.html
        if (tomlField) {
            this.registry.set('debug', true);
            try {
                const config = toml.parse(tomlField.value);
                this.registry.set('config', config);
            } catch (err) {
                console.error('Error parsing config.toml:', err);
            }       
        } else {
            this.registry.set('debug', false);
			
            // Yoink it from ./config.toml
			fetch('./config.toml')
                .then(response => { // Fetch the config.toml file
                    if (!response.ok) {
                        throw new Error('Could not get config.toml');
                    }
                    return response.text();
                })
                .then(text => { // Parse the config.toml file
                    try {
                        const config = toml.parse(text);
                        this.registry.set('config', config);
                    } catch (err) {
                        console.error('Error parsing config.toml:', err);
                    }
                })
                .catch(err => { // Log any errors
                    console.error(err);
                });
        }

        // Also load dialogue similarly
        const dialogueField = document.getElementById('dialogueInput'); // From debug.html
        if (dialogueField) {
            this.registry.set('debug', true);
            try {
                const dialogue = toml.parse(dialogueField.value);
                this.registry.set('dialogue', dialogue);
            } catch (err) {
                console.error('Error parsing dialogue.toml:', err);
            }
        } else {
            fetch('./dialogue.toml')
                .then(response => { // Fetch the config.toml file
                    if (!response.ok) {
                        throw new Error('Could not get dialogue.toml');
                    }
                    return response.text();
                })
                .then(text => { // Parse the config.toml file
                    try {
                        const dialogue = toml.parse(text);
                        this.registry.set('dialogue', dialogue);
                    } catch (err) {
                        console.error('Error parsing dialogue.toml:', err);
                    }
                })
                .catch(err => { // Log any errors
                    console.error(err);
                });
        }


        // TODO: Load background and add start button
        console.log("Start Scene triggered");

        // Init some basic variables
        this.registry.set('money', 0);          // how much money the player has
        this.registry.set('harvest_bin', {});   // what crops and food units the player had harvested
        this.registry.set('round', 1);
        this.registry.set('roundTime', 120);    // how long each round lasts in seconds
        this.registry.set('goal', 1000);        // how much money the player needs to win
        this.registry.set('totalFoodUnits', 0); // how much food the player has harvested in total
        this.registry.set('roundFoodUnits', 0); // food harvested in the current round

        this.registry.set('currentTileX', 0);   // current #x tiles
        this.registry.set('currentTileY', 0);   // current #y tiles

        // Get scene to place things in the middle
        let { width, height } = this.sys.game.canvas;
    

        const titleImage = this.add.image(width/2, height/2, 'titleImage')

        const startButton = new FancyUITextButton(this, width/2, 500, "Start!", () => {this.scene.start('FieldScene')})
        this.add.existing(startButton)
    }

    update() {

    }
}
