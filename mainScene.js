import Tiles from './tiles.js';
import Toolbar from './toolbar.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.toolbar = new Toolbar();   // Create a new toolbar
    }

    preload() {
        // Load assets (replace with actual paths)
        this.load.image('farmland', "./public/assets/farmland.png");
        this.load.image('background', "./public/assets/Background.png");

        // Load seeds
        this.load.image('corn_seed', "./public/assets/corn/Corn_seeds.png");
        this.load.image('soybean_seed', "./public/assets/soybean/Soybean_seeds.png");

        // Load crops sprites
        for (let i = 1; i <= 4; i++) {
            this.load.image(`corn_${i}`, `./public/assets/corn/Corn_stage_${i}.png`);
            this.load.image(`soybean_${i}`, `./public/assets/soybean/Soybean_stage_${i}.png`);
        }

        this.load.json('cropData', "./crops.json");
    }

    // Start the game here
    create() {
        // Add background
        const bg = this.add.image(300, 300, 'background');

        // Create a grid to store the farmland
        const x_num = 7;        // Number of tiles in the x direction
        const y_num = 7;        // Number of tiles in the y direction
        const tileSize = 60;    // Size of each tile, in pixels
        const tileSpacing = 10; // Space between tiles, in pixels

        // Do some math to center it
        const xOffset = (600 - x_num * tileSize) / 2 + tileSize/2;
        const yOffset = (600 - y_num * tileSize) / 2 + tileSize/2;
        
        // Loop through the grid and create a new tile at each location
        this.farmland = new Array(x_num*y_num); // This will store all the tiles
                                                // We don't access it directly, but we need to store it 
        for (let i = 0; i < x_num; i++) {
            for (let j = 0; j < y_num; j++) {
                let x_coord = i * tileSize + xOffset;
                let y_coord = j * tileSize + yOffset;
                let newTile = new Tiles(this, x_coord, y_coord, 100).setScale(tileSize-tileSpacing);
                // newTile.setInteractive();
                this.farmland[i*x_num + j] = newTile;
            }
        }

        // TODO: Create a status bar to keep track of money and crops weight

        // Create a timer to make the crop do things
        this.time.addEvent({
            delay: 1000,
            loop: true,
            callbackScope: this,
            callback: this.updateCrops,
        });

        // Store money and things
        this.money = 0;
        this.weight = 0;    // TODO: Update to store separate of crop

        // Bind keys 1-9 for selecting tools
        const keys = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
        keys.forEach((key, index) => {
            this.input.keyboard.on(`keydown-${key}`, () => {
                this.selectedTool = this.toolbar.selectTool(index + 1);
            });
        });
    }

    // Called on every game frame
    update() {

    }

    // This function handles updating the tiles every second
    // For things such as growing the crops, drying the soil, etc.
    updateCrops() {
        for (let tile of this.farmland) {
            tile.update();
        }
    }

    // Function to pause/unpause the main scene
    togglePause() {
        if (this.scene.isActive()) { // if not paused
            this.scene.pause();
            console.log("MainScene paused");
        } else {            // if paused
            this.scene.resume();
            console.log("MainScene resumed");
        }
    }
}
