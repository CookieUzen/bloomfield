import Crop from './crops.js';
import { ToolTypes } from './toolbar.js';   // {  } for importing a const

// TODO: move these to a config file
const waterAmount = 30;     // How much water to add when watering

export default class Tiles extends Phaser.GameObjects.Sprite {
    // Private variables, use getters and setters!
    #crop;
    #waterLevel;
    #defaultTintColor;   // For water level stuff
    #isHovered;         // there's prob a better way to do this but I need sleep

    // Create a new tile
    constructor(scene, x, y, waterLevel) {
        let texture = 'farmland';
        // make a sprite at x, y, using the 'farmland' image
        super(scene, x, y, texture)
            .setInteractive()                               // Make it interactive to mouse
            .on('pointerdown', () => this.onPointerDown())  // Handle mouse down
            .on('pointerover', () => this.onPointerOver())  // Handle hovering and drag
            .on('pointerout', () => this.onPointerOut())       // Clear tint when mouse leaves
        ;

        this.scene = scene; // Scene that this tile is in
        this.#crop = null;
        this.#waterLevel = waterLevel;
        this.#defaultTintColor = this.getBlueTint();
        this.tint = this.#defaultTintColor; // actually tint the tile
        this.#isHovered = false;
        
        // Add this object to the scene
        // scene.add.existing(this);
    }

    // Method to plant a crop
    plant(cropType) {
        if (this.#crop) return;  // Do nothing if there is already a crop

        // Add a new crop object to the tile
        // Copy our own x and y coordinates to the crop
        this.#crop = new Crop(this.scene, this, cropType);
        console.log(cropType + " planted");
    }

    // Method to water the soil
    water(amount) {
        // Increase the water level
        this.#waterLevel += amount;

        // Cap the water level between 0 and 100
        if (this.#waterLevel > 100) this.#waterLevel = 100;
        if (this.#waterLevel < 0) this.#waterLevel = 0;

        this.#defaultTintColor = this.getBlueTint();
    }

    // Method to harvest the cro
    harvest(discard = false) {  // Don't throw away the crop by default
        // Do nothing if there is no crop
        if (!this.#crop) return;

        console.log(this.#crop.getType() + " harvested");
        
        // If the crop is grown, harvest it
        if (!discard && this.#crop.isGrown()) {
            // Crop specific data
            let money = this.#crop.getMoneyValue();
            let weight = this.#crop.getWeight();

            this.scene.registry.inc('money', money);

            // Add the crop to the harvest bin
            let harvest_bin = this.scene.registry.get('harvest_bin');
            if (!harvest_bin[this.#crop.getType()]) {
                harvest_bin[this.#crop.getType()] = 0;
            }

            harvest_bin[this.#crop.getType()] += 1; // increment by 1, not weight
                                                    // weight will be accounted when summing up all the crops

            this.scene.registry.inc('roundFoodUnits', weight);  // Add the weight to round food units
        }


        // Destroy the crop to free up resources
        this.#crop.destroy();
        this.#crop = null;
    }

    // Method to update the tile (ie. dehydrate the soil, grow the crop, etc.)
    // called every frame
    // delta is in ms
    update(delta) {
        // Don't do anything if there is no crop
        if (!this.#crop) return;

        // Don't do anything if the crop is done 
        // TODO: limit time before harvesting is required?
        if (this.#crop.isGrown()) return;

        // Drain the water 
        this.water((delta/1000) * -this.#crop.getWaterDrainRate());

        // Grow the crop based on the time delta. 
        this.#crop.grow(delta/1000);  // TODO: Grow speed based on water level

        // Kill the crop if it's too dry
        if (this.#waterLevel <= 0) {
            console.log(this.#crop.type + " died of dehydration");

            this.#crop.destroy();
            this.#crop = null;
        }

        // Make the tile shade based on water level
        this.#defaultTintColor = this.getBlueTint();
        if (!this.#isHovered) this.tint = this.#defaultTintColor

        // TODO: Warning if the water level too low
    }

    // Random function to make soil not blue or something i'm not sure uhh
    // TODO: NEED CHANGE!!!!
    getBlueTint() {
        const factor = this.#waterLevel / 100; // Interpolation factor: 0 (white) to 1 (blue)
        const r = Math.floor((1 - factor) * 255); // Red goes from 255 to 0
        const g = Math.floor((1 - factor) * 255); // Green goes from 255 to 0
        const b = 255; // Blue remains 255
        return (r << 16) | (g << 8) | b;
    }

    // Getters
    getCrop() {
        return this.#crop;
    }

    getWaterLevel() {
        return this.#waterLevel;
    }

    // Function to handle clicking on the tile
    onPointerDown() {
        // Get the selected tool from the toolbar
        var tool = this.scene.toolbar.getCurrentTool();

        // check to see what tool is selected
        if (tool === ToolTypes.CORN_SEED) {
            this.plant('corn');
            return
        }

        if (tool === ToolTypes.SOYBEAN_SEED) {
            this.plant('soybean');
            return
        }
                
        if (tool === ToolTypes.WATERING_CAN) {
            this.water(30);
            return
        }

        if (tool === ToolTypes.SICKLE) {
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
        
        this.#isHovered = true;

        // Highlight the tile if we are hovering over it
        this.tint = 0x00ff00;
    }

    // Function to handle when the mouse leaves the tile
    onPointerOut() {
        this.#isHovered = false;
        this.tint = this.#defaultTintColor;
    }
}
