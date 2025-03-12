import Crop from './crops.js';

// TODO: move these to a config file
const waterAmount = 30;     // How much water to add when watering

export default class Tiles extends Phaser.GameObjects.Sprite {
    // Create a new tile
    constructor(scene, x, y, waterLevel) {
        let texture = 'farmland';
        // make a sprite at x, y, using the 'farmland' image
        super(scene, x, y, texture)
            .setInteractive()                               // Make it interactive to mouse
            .on('pointerdown', () => this.onPointerDown())  // Handle mouse down
            .on('pointerover', () => this.onPointerOver())  // Handle hovering and drag
            .on('pointerout', () => this.clearTint())       // Clear tint when mouse leaves
        ;

        this.scene = scene;
        this.crop = null;
        this.waterLevel = waterLevel;
        
        // Add this object to the scene
        scene.add.existing(this);
    }

    // Method to plant a crop
    plant(cropType) {
        if (this.crop) return;  // Do nothing if there is already a crop

        // Add a new crop object to the tile
        // Copy our own x and y coordinates to the crop
        this.crop = new Crop(this.scene, this.x, this.y, cropType);
    }

    // Method to water the soil
    water(amount) {
        // Increase the water level
        this.waterLevel += amount;

        // Cap the water level between 0 and 100
        if (this.waterLevel > 100) this.waterLevel = 100;
        if (this.waterLevel < 0) this.waterLevel = 0;

        // TODO: Shade the tile based on water level
    }

    // Method to harvest the cro
    harvest() {
        // Do nothing if there is no crop
        if (!this.crop) return;
        
        // If the crop is grown, harvest it
        if (this.crop.grown)  {
            let money = this.crop.moneyValue;
            let weight = this.crop.weight;

            this.scene.money += money;
            this.scene.weight += weight;
        }

        // Destroy the crop to free up resources
        this.crop.destroy();
        this.crop = null;
    }

    // Method to update the tile (ie. dehydrate the soil, grow the crop, etc.)
    // called every second
    update() {
        // Don't do anything if there is no crop
        if (!this.crop) return;

        // Drain the water
        this.water(-this.crop.waterDrainRate);

        // Grow the crop 1 artificial second per real second
        this.crop.grow(1);  // TODO: Grow speed based on water level

        // Kill the crop if it's too dry
        if (this.waterLevel <= 0) {
            console.log(this.crop.type + " died of dehydration");

            this.crop.destroy();
            this.crop = null;
        }

        // TODO: Warning if the water level too low
    }

    // Function to handle clicking on the tile
    onPointerDown() {
        // check to see what tool is selected
        if (this.scene.selectedTool === 'corn_seed') {
            this.plant('corn');
            return
        }

        if (this.scene.selectedTool === 'soybean_seed') {
            this.plant('soybean');
            return
        }
                
        if (this.scene.selectedTool === 'water') {
            this.water(30);
            return
        }

        if (this.scene.selectedTool === 'sickle') {
            this.harvest();
            return
        }
    }

    // Function to handle hovering and dragging over the tile
    onPointerOver() {
        // Run onPointerDown if the mouse is down: enables dragging
        if (this.scene.input.activePointer.isDown) {
            this.onPointerDown();
        }

        // Highlight the tile if we are hovering over it
        this.tint = 0x00ff00;
    }
}
