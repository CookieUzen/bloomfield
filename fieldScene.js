import Tiles from './tiles.js';
import {NewToolbar, ToolTypes, EquipmentTypes} from './newToolbar.js';

export default class FieldScene extends Phaser.Scene {

    timeRemaining;  // Time remaining in seconds

    constructor() {
        super({ key: 'FieldScene' });
        this.toolbar = new NewToolbar();   // Create a new toolbar
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

        const playField = this.add.container(width/2, height/2 + 50)
        // Add background
        playField.add(new Phaser.GameObjects.Image(this, 0, 0, 'background'))

        // Create a grid to store the farmland
        // AI DISCLAIMER: I used ChatGPT to help me rewrite this loop because I was too lazy to figure out the
        // math to calculate the positions myself. I also modified what it came up with to clean up the math
        // and make the x and y values both work
        // Define the total grid size
        const round1Config = this.registry.get('config').round['1']
        const gridSize = 450;   // Total width and height of the grid in pixels
        const xTileCount = round1Config.gridSizeX;        // Number of tiles in the x direction
        const yTileCount = round1Config.gridSizeY;        // Number of tiles in the y direction
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

        // Loop through the grid and create a new tile at each location
        this.farmland = []; // Store all tiles

        for (let i = 0; i < xTileCount; i++) {
            for (let j = 0; j < yTileCount; j++) {
                let x_coord = i * stepSizeX + offsetX + tileSizeX/2;
                let y_coord = j * stepSizeY + offsetY + tileSizeY/2;
                let newTile = new Tiles(this, x_coord, y_coord, 100).setScale(tileSizeX/50, tileSizeY/50);  // 50 is a magic number
                playField.add(newTile);
                this.farmland.push(newTile);
            }
        }

        //------------------------------------

        // Engine setup ----------------------
        // Bind keys 1-9 for selecting tools
        const keys = ['Q', 'W', 'E', 'ONE', 'TWO', 'THREE', 'FOUR'];
        const tools = [{type: ToolTypes.EQUIPMENT, toolName: 'watering_can'}, {type: ToolTypes.EQUIPMENT, toolName: 'sickle'}, {type: ToolTypes.EQUIPMENT, toolName: 'fertilizer'}, 
            {type: ToolTypes.SEED, toolName: 'corn'}, {type: ToolTypes.SEED, toolName: 'soybean'}, {type: ToolTypes.SEED, toolName: 'potato'}, {type: ToolTypes.SEED, toolName: 'wheat'}
        ]
        keys.forEach((key, index) => {
            this.input.keyboard.on(`keydown-${key}`, () => {
                if (tools[index].type === ToolTypes.EQUIPMENT) {
                    this.toolbar.setToolEquipment(tools[index].toolName)
                } else {
                    this.toolbar.setToolSeed(tools[index].toolName)
                }
            });
        });
        

        // Load UI scene
        this.scene.launch('InputScene');
        //------------------------------------

        // State setup -----------------------
        this.startRound();
    }

    // Called on every game frame
    update(time, delta) {
        this.updateCrops(time, delta)

        this.timeRemaining -= delta/1000  // This is perhaps not ideal because it is all just relative, but thats fine its close enough
        
        if (this.timeRemaining <= 0) {
            this.endRound()
        }
    }

    // This function handles updating the tiles every second
    // For things such as growing the crops, drying the soil, etc.
    updateCrops(time, delta) {
        for (let tile of this.farmland) {
            tile.update(time, delta);
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

        this.registry.set('roundTime', roundConfig.time);    // how long each round lasts in seconds
        this.registry.set('goal', roundConfig.goal);         // how much money the player needs to win
        
        // For infinite rounds, multiply the goal
        if (roundNum > config.roundInfinite) {
            this.registry.set('goal', roundConfig.goal * roundConfig.goalMultiplier ** (roundNum - config.roundInfinite))
        }

        this.timeRemaining = this.registry.get('roundTime');  // Time remaining in seconds

        // Don't Clear out all the crops
        // TODO: Decay mechanic?
        // for (let tile of this.farmland) {
        //     tile.harvest(true);   // Throw away the crop instead of earning money/food units
        // }

        // Start the scene again!
        this.scene.wake();
        this.scene.get('InputScene').scene.wake()
        this.scene.bringToTop('InputScene')
    }

    endRound() {
        this.scene.get('InputScene').scene.sleep()
        this.scene.sleep(); // We don't destroy the scene because we want to keep tiles data intact
        this.scene.launch('RoundEndScene');
    }

}
