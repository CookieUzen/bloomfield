import Tiles from './tiles.js';
import Toolbar from './toolbar.js';

export default class FieldScene extends Phaser.Scene {

    timeRemaining;  // Time remaining in seconds
    goalWeight;  // Amount needed to "win"
    roundNum;  // What round we're on

    constructor() {
        super({ key: 'FieldScene' });
        this.toolbar = new Toolbar();   // Create a new toolbar
    }

    preload() {
        // Load assets (replace with actual paths)
        this.load.image('farmland', "./public/assets/farmland.png");
        this.load.image('background', "./public/assets/Background.png");

        // Load seeds
        this.load.image('corn_seed', "./public/assets/corn/Corn_seeds.png");
        this.load.image('soybean_seed', "./public/assets/soybean/Soybean_seeds.png");

        // Load tools
        this.load.image('sickle', "./public/assets/Sickle.png")
        this.load.image('watering_can', "./public/assets/Watering_can.png")

        // Load crops sprites
        for (let i = 1; i <= 4; i++) {
            this.load.image(`corn_${i}`, `./public/assets/corn/Corn_stage_${i}.png`);
            this.load.image(`soybean_${i}`, `./public/assets/soybean/Soybean_stage_${i}.png`);
        }

        this.load.json('cropData', "./crops.json");
    }

    // Start the game here
    create(data) {

        // State setup -----------------------

        // Store money and things
        this.money = 0;
        this.weight = 0;    // TODO: Update to store separate of crop

        this.timeRemaining = data.roundTime ? data.roundTime : 30;  // Time for the round to run. Get from passed data if available
        this.goalWeight = data.goalWeight ? data.goalWeight : 100  // Amount of weight needed to win
        this.roundNum = data.roundNum ? data.roundNum : 1  // What round are we on?

        // -----------------------------------

        // GameObject setup ------------------
        // Get scene to place things in the middle
        let { width, height } = this.sys.game.canvas;

        // Game color
        this.cameras.main.setBackgroundColor(0x22892D)

        const playField = this.add.container(width/2, height/2)
        // Add background
        playField.add(new Phaser.GameObjects.Image(this, 0, 0, 'background'))

        // Create a grid to store the farmland
        // AI DISCLAIMER: I used ChatGPT to help me rewrite this loop because I was too lazy to figure out the
        // math to calculate the positions myself. I also modified what it came up with to clean up the math
        // and make the x and y values both work
        // Define the total grid size
        const gridSize = 450;   // Total width and height of the grid in pixels
        const xTileCount = 7;        // Number of tiles in the x direction
        const yTileCount = 8;        // Number of tiles in the y direction
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
                let newTile = new Tiles(this, x_coord, y_coord, 100).setScale(tileSizeX, tileSizeY);
                playField.add(newTile);
                this.farmland.push(newTile);
            }
        }

        // Make current tool follow the mouse around
        this.toolSprite = this.add.sprite(0, 0, 'watering_can')
        //------------------------------------

        // Engine setup ----------------------
        // Bind keys 1-9 for selecting tools
        const keys = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
        keys.forEach((key, index) => {
            this.input.keyboard.on(`keydown-${key}`, () => {
                this.selectedTool = this.toolbar.selectTool(index + 1);
            });
        });

        // Load UI scene
        this.scene.launch('InputScene');
        this.scene.bringToTop('InputScene')
        //------------------------------------

        

        // TODO: Create a status bar to keep track of money and crops weight

        // // Create a timer to make the crop do things
        // this.time.addEvent({
        //     delay: 1000,
        //     loop: true,
        //     callbackScope: this,
        //     callback: this.updateCrops,
        // });

    }

    // Called on every game frame
    update(time, delta) {
        this.toolSprite.setTexture(this.toolbar.getCurrentTool())
        this.toolSprite.setPosition(this.game.input.mousePointer.x, this.game.input.mousePointer.y)

        this.updateCrops(delta)

        this.timeRemaining -= delta/1000  // This is perhaps not ideal because it is all just relative, but thats fine its close enough
        
        if (this.timeRemaining <= 0) {
            this.endRound()
        }
    }

    // This function handles updating the tiles every second
    // For things such as growing the crops, drying the soil, etc.
    updateCrops(delta) {
        for (let tile of this.farmland) {
            tile.update(delta);
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

    endRound() {
        this.scene.get('InputScene').scene.stop()
        this.scene.start('RoundEndScene', {money: this.money, weight: this.weight, roundNum: this.roundNum})  // Pass point values to next scene
    }

}
