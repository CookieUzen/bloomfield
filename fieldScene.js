import Tiles from './tiles.js';
import {NewToolbar, ToolTypes, EquipmentTypes} from './newToolbar.js';

export default class FieldScene extends Phaser.Scene {

    timer;              // timer in seconds
    timeRemaining;      // time remaining in seconds
    useTimeRemaining;   // If we are counting down or up, true for counting down
    roundInProgress;    // Stores if a round is over or not, checked by input scene
    notebookShowing;    // Stores the state of the notebook display

    constructor() {
        super({ key: 'FieldScene' });
        this.toolbar = new NewToolbar();   // Create a new toolbar
        this.farmland = []; // Store all tiles in a 2D array
        this.sizeX = 0; // current number of tiles in the x direction
        this.sizeY = 0; // current number of tiles in the y direction
        this.playField; // The container for the playfield
    }

    preload() {
        // Load assets (replace with actual paths)
        this.load.image('farmland', "./public/assets/brighter_tile.png");
        this.load.image('background', "./public/assets/Background.png");

        // Load UI images
        this.load.image('backgroundCenter', "./public/assets/Center.png")
        this.load.image('backgroundTopBar', "./public/assets/Top.png")
        this.load.image('backgroundRightBar', "./public/assets/Right.png")

        // Load tools
        this.load.image('sickle', "./public/assets/Sickle.png")
        this.load.image('watering_can', "./public/assets/Watering_can.png")
        this.load.image('fertilizer', "./public/assets/Fertilizer.png")

        // Load icons
        this.load.image('droplet', "./public/assets/Droplet.png")
        this.load.image('xDroplet', "./public/assets/XDroplet.png")
        this.load.image('downArrow', "./public/assets/Down_arrow.png")

        const cropData = this.registry.get('config').crops;
        // Load crops sprites

        for (const cropName of Object.keys(cropData)) {
            // ChatGPT wrote the uppercase thing
            this.load.image(`${cropName}_seed`, `./public/assets/${cropName}/${cropName.charAt(0).toUpperCase() + cropName.slice(1)}_seeds.png`);

            for (let i = 1; i <= 4; i++) {
                this.load.image(`${cropName}_${i}`, `./public/assets/${cropName}/${cropName.charAt(0).toUpperCase() + cropName.slice(1)}_stage_${i}.png`);
            }

        }
        
    }

    // Start the game here
    create() {

        // -----------------------------------

        // GameObject setup ------------------
        // Get scene to place things in the middle
        let { width, height } = this.sys.game.canvas;

        // Game color
        this.cameras.main.setBackgroundColor(0xF2E9DC)

        // Game background setup
        this.add.sprite(width/2, height/2 + 50, "backgroundCenter")
        this.add.sprite(width/2, 75, "backgroundTopBar")
        this.add.sprite(975, height/2 + 50, "backgroundRightBar")

        // Container to store the stuff in the main game screen
        this.playField = this.add.container(width/2, height/2 + 50)

        // Add background
        this.playField.add(new Phaser.GameObjects.Image(this, 0, 0, 'background'))

        //------------------------------------

        // Engine setup ----------------------
        

        // Load UI scene
        this.scene.launch('InputScene');
        //------------------------------------

        // State setup -----------------------
        this.startRound();
    }

    // Called on every game frame
    update(time, delta) {

        if (!this.roundInProgress) {
            return
        }

        this.updateCrops(time, delta)

        // Infinite round
        if (this.useTimeRemaining && this.timeRemaining <= 0) {
            this.timeRemaining = -1
            this.endRound()
        }

        // Timer ticks up, check requirement is met
        if (!this.useTimeRemaining) {
            let foodUnits = this.registry.get('roundFoodUnits');
            const config = this.registry.get('config');
            const roundNum = this.registry.get('round')
            const roundGoal = config.round[roundNum.toString()]   // Assume non infinite since useTimeRemaining is false

            let cropGoals = roundGoal.cropGoals;
            let harvest_bin = this.registry.get('harvest_bin');

            let allCropsMet = true; // Flag to check if all crops are met
            for (let cropName in cropGoals) {
                if (cropName === 'total' || cropName === 'minFertilizerLvl') {
                    continue; // Skip the total key
                }

                // Loop over the crop goals and check if they are met
                let cropGoal = cropGoals[cropName];
                if (!harvest_bin[cropName] || harvest_bin[cropName] < cropGoal) {
                    allCropsMet = false; // If any crop goal is not met, set the flag to false
                    break;
                }
            }

            // Check total food units
            if (harvest_bin['total'] < roundGoal.total) {
                allCropsMet = false; // If total food units are not met, set the flag to false
            }

            // Check if fertilizer level is met
            if (cropGoals.minFertilizerLvl && cropGoals.minFertilizerLvl > 0) {
                for (let row of this.farmland) {   // Loop through all tiles
                    for (let tile of row) {
                        const fertilizerLevel = tile.getFertilizerLevel();
                        if (fertilizerLevel < cropGoals.minFertilizerLvl) {
                            allCropsMet = false; // If fertilizer level is not met, set the flag to false
                            break;

                            // TODO: If everything except the fertilizer level have been met, 
                            //       put a dialog box telling the user to fertilize?
                        }
                    }
                }
            }

            if (allCropsMet) {
                this.endRound()
            }
        }

        this.timer += delta/1000  // Increment timer
        this.timeRemaining -= delta/1000  // Decrement time remaining
    }

    // This function handles updating the tiles every second
    // For things such as growing the crops, drying the soil, etc.
    updateCrops(time, delta) {
        for (let row of this.farmland) {
            for (let tile of row) {
                tile.update(time, delta);
            }
        }
    }

    // Function to pause/unpause the main scene
    togglePause() {
        if (this.scene.isActive()) { // if not paused
            this.scene.pause();
            console.log("Field Scene paused");
        } else {            // if paused
            this.scene.resume();
            console.log("Field Scene resumed");
        }
    }

    // Function to show the notebook
    // TODO
    triggerNotebook() {

    }

    // This function is called when the starts
    startRound() {
        this.roundInProgress = true
        // Temporarily disable input for a bit
        this.input.enabled = false;

        this.time.delayedCall(200, () => {
            this.input.enabled = true;
        })

        // Skip to round if cheats are enabled
        const cheats = this.registry.get('config').cheats;
        if (cheats.enable) {
            this.registry.set('round', Math.floor(cheats.skipToRound, 1));
        }

        // Set all the variables according to the configs
        const config = this.registry.get('config').round
        const roundNum = this.registry.get('round')     // Get the config for the current round
        const roundConfig = (roundNum > config.roundInfinite) ? config['infinite'] : config[roundNum.toString()]

        const goals = roundConfig.cropGoals;

        this.updateFarmlandGrid(roundConfig);  // Update the farmland grid

        this.registry.set('roundTime', roundConfig.time);   // how long each round lasts in seconds
        this.registry.set('goal', goals.total);             // how much money the player needs to win
        this.registry.set('cropGoals', goals.cropGoals);    // how much of each crop the player needs to win

        // For infinite rounds, multiply the goal
        if (roundNum > config.roundInfinite) {
            this.registry.set('goal', goals.total * roundConfig.goalMultiplier ** (roundNum - config.roundInfinite))
        }

        this.timer = 0; // timer in seconds
        this.timeRemaining = roundConfig.time; // time remaining in seconds
        if (roundConfig.time < 0) {
            this.useTimeRemaining = false; // If the time is negative, we don't use it
        }

        // Add fertilizer to the toolbar
        this.toolbar.addFertilizer(roundConfig.fertilizerNum); // Add fertilizer to the toolbar

        // Start the scene again!
        this.scene.wake();
        this.scene.launch('InputScene');  // Restart this scene so it rebuilds the buttons (easiest way to go about it tbh)
        this.scene.bringToTop('InputScene')
    }

    // Function to modify the field
    updateFarmlandGrid(roundConfig) {

        // Create a grid to store the farmland
        // AI DISCLAIMER: I used ChatGPT to help me rewrite this loop because I was too lazy to figure out the
        // math to calculate the positions myself. I also modified what it came up with to clean up the math
        // and make the x and y values both work
        // Define the total grid size
        const gridSize = 450;   // Total width and height of the grid in pixels
        const xTileCount = roundConfig.gridSizeX;        // Number of tiles in the x direction
        const yTileCount = roundConfig.gridSizeY;        // Number of tiles in the y direction
        const tileSpacing = 5; // Space between tiles, in pixels

        // Calculate the actual tile size so that they fit within gridSize, accounting for spacing
        const tileSizeX = (gridSize - (xTileCount - 1) * tileSpacing) / xTileCount;
        const tileSizeY = (gridSize - (yTileCount - 1) * tileSpacing) / yTileCount;

        // Calculate the step size (total space each tile occupies, including spacing)
        const stepSizeX = gridSize / xTileCount;
        const stepSizeY = gridSize / yTileCount;

        // Calculate the offset to center the grid at (0,0)
        const offsetX = -gridSize / 2;
        const offsetY = -gridSize / 2;

        // Set up the field
        let new_farmland = []   // Make a new array first
        const new_sizeX = roundConfig.gridSizeX;  // Number of tiles in the x direction
        const new_sizeY = roundConfig.gridSizeY;  // Number of tiles in the y direction

        // Loop over old array and copy the tiles over
        for (let i = 0; i < Math.min(this.sizeX, new_sizeX); i++) { // Copy, but don't go out of bounds
            // Create a new row array for each i
            new_farmland[i] = [];
            for (let j = 0; j < this.sizeY; j++) {
                // Calculate coords
                let x_coord = i * stepSizeX + offsetX + tileSizeX / 2;
                let y_coord = j * stepSizeY + offsetY + tileSizeY / 2;

                // Update the tile's position
                this.farmland[i][j].setPosition(x_coord, y_coord);

                // Update the tile's size
                this.farmland[i][j].setScale(tileSizeX, tileSizeY);

                // Place the new tile in the 2D array
                new_farmland[i][j] = this.farmland[i][j];
            }
        }

        // Create the rest of the tiles
        for (let i = 0; i < new_sizeX; i++) {
            // Create a new row array for each i
            if (!new_farmland[i]) {
                // If the row doesn't exist, create it
                new_farmland[i] = [];
            }

            for (let j = 0; j < new_sizeY; j++) {
                // If the tile already exists, skip it
                if (new_farmland[i][j]) {
                    continue;
                }

                // Calculate coords
                let x_coord = i * stepSizeX + offsetX + tileSizeX / 2;
                let y_coord = j * stepSizeY + offsetY + tileSizeY / 2;

                // Create a new tile and add it to the scene
                const tile = new Tiles(this, x_coord, y_coord, 100)
                    .setScale(tileSizeX, tileSizeY);

                // Add the tile to the array
                new_farmland[i][j] = tile;
                this.playField.add(tile);
            }
        }

        // Update the farmland array
        this.farmland = new_farmland;
        this.sizeX = new_sizeX;
        this.sizeY = new_sizeY;

        // Clean up the crops if needed
        if (roundConfig.cleanCropsAfterRound) {
            for (let row of this.farmland) {
                for (let tile of row) {
                    tile.harvest(true);  // Remove all crops
                }
            }
        }

    }

    endRound() {

        const inputScene = this.scene.get('InputScene')

        inputScene.currentDialogueSet = inputScene.roundDialogue?.end?.speech
        inputScene.currentDialogueCharacter = inputScene.roundDialogue?.end?.character
        inputScene.dialogueIndex = 0

        this.roundInProgress = false
    }

    // This gets called by InputScene. It's a little scuffed, but that scene handles the dialogue so
    // it needs to decide when we're done
    closeRound() {
        this.scene.get('InputScene').scene.stop()  // Stop this one because we want to restart it later
        this.scene.sleep(); // We don't destroy the scene because we want to keep tiles data intact
        this.scene.launch('RoundEndScene');
    }

}
