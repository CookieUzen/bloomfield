import AlertIcon from './alertIcon.js';
import Crop from './crops.js';
import { ToolTypes, EquipmentTypes } from './newToolbar.js';   // {  } for importing a const

export default class Tiles extends Phaser.GameObjects.Container {
    // Private variables, use getters and setters!
    tileSprite;
    #crop;
    #prevCropName;
    #prevCropCount;
    #waterLevel;
    #organicMatLevel;
    #fertilizerLevel;
    #defaultTintColor;   // For water level stuff
    #isHovered;         // there's prob a better way to do this but I need sleep

    // Create a new tile
    constructor(scene, x, y, waterLevel) {
        let texture = 'farmland';

        // make a sprite at x, y, using the 'farmland' image
        super(scene, x, y);

        // Make the tile sprite
        this.tileSprite = this.scene.add.sprite(0, 0, texture)
            .setInteractive()                               // Make it interactive to mouse
            .on('pointerdown', () => this.onPointerDown())  // Handle mouse down
            .on('pointerover', () => this.onPointerOver())  // Handle hovering and drag
            .on('pointerout', () => this.onPointerOut())       // Clear tint when mouse leaves
        ;

        console.log("Tile created at " + x + ", " + y);

        // Scale the tile sprite
        this.tileSprite.setScale(1/50); // 1/50 is a magic number

        // Add the tile sprite to the container
        this.add(this.tileSprite);
        
        this.#crop = null;
        this.#waterLevel = waterLevel;
        this.#defaultTintColor = this.getBlueTint();
        this.tileSprite.tint = this.#defaultTintColor; // actually tint the tile
        this.#isHovered = false;

        this.alertIcons = {};  // An object of the active alert icons

        this.#organicMatLevel = 100
        this.#fertilizerLevel = 100
        
        // TODO use icons n stuff for these values
        this.omLevelText;
        this.fertLevelText;
        
    }

    // Method to plant a crop
    plant(cropType) {
        if (this.#crop) return;  // Do nothing if there is already a crop


        // Get the current round config
        const config = this.scene.registry.get('config').round
        const roundNum = this.scene.registry.get('round')     // Get the config for the current round
        const roundConfig = (roundNum > config.roundInfinite) ? config['infinite'] : config[roundNum.toString()]

        if (this.#prevCropName === cropType && !roundConfig.monocroppingDisabled) {
            this.#prevCropCount += 1
        } else {
            this.#prevCropName = cropType
            this.#prevCropCount = 0
        }

        if (this.#prevCropCount > 0) { 
            this.showMonocropAlert()
        }

        // Add a new crop object to the tile
        // Copy our own x and y coordinates to the crop
        this.#crop = new Crop(this.scene, cropType);
        this.#crop.setScale(1/60);          // 1/60 is a magic number
        this.addAt(this.#crop, 0);          // Add the crop to the tile, at the botto1m
        this.sendToBack(this.tileSprite)    // Send the tile sprite to the button

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

    // Method to manage fertilizer levels in the soil
    fertilize(amount) {
        // Increase the level
        this.#fertilizerLevel += amount;

        // Cap the level between 0 and 100
        if (this.#fertilizerLevel > 100) this.#fertilizerLevel = 100;
        if (this.#fertilizerLevel < 0) this.#fertilizerLevel = 0;

        this.fertLevelText.text = Math.floor(this.#fertilizerLevel)
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

            // Earn less if you monocrop
            money *= (Math.max(0.2, 1 - (0.2 * this.#prevCropCount)))
            weight *= (Math.max(0.2, 1 - (0.2 * this.#prevCropCount)))

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
    update(time, delta) {

        // Set these up (doing in the constructor had issues because of the parenting, so we do it here)
        // if (!this.omLevelText) {
        //     this.omLevelText = new Phaser.GameObjects.Text(this.scene, this.x - 25, this.y - 25, "")
        //     this.scene.add.existing(this.omLevelText)
        //     this.parentContainer.add(this.omLevelText)
        // } else {
        //     this.omLevelText.text = Math.floor(this.#organicMatLevel)
        // }
        if (!this.fertLevelText) {
            this.fertLevelText = new Phaser.GameObjects.Text(this.scene, 0, 0, "")
            this.scene.add.text(this.fertLevelText)
            this.fertLevelText.setScale(1/60)
            this.add(this.fertLevelText)
        }

        // Manage water alert
        this.updateAlertAlphas(time)

        if (this.#waterLevel < 10) {  // If the water is critical, show the critical alert
            this.hideWaterAlert()
            this.showWaterCritAlert()
        }
        else if (this.#waterLevel < 50 && this.#crop) {  // If the water is low and we have a crop, show the low alert
            this.showWaterAlert()
            this.hideWaterCritAlert()
        } else {
            this.hideWaterAlert()
            this.hideWaterCritAlert()
        }

        // Don't do anything else if there is no crop
        if (!this.#crop) {
            this.hideWaterAlert()
            this.hideMonocropAlert()
            this.hideHarvestAlert()
            return;
        }

        // Don't do anything if the crop is done 
        // TODO: limit time before harvesting is required?
        if (this.#crop.isGrown()) {
            this.hideWaterAlert()
            this.hideMonocropAlert()
            this.showHarvestAlert()
            return;
        } else {
            this.hideHarvestAlert()
        }

        // Drain the water 
        this.water((delta/1000) * -this.#crop.getWaterDrainRate());

        // Use the fertilizer
        this.fertilize((delta/1000) * (-this.#crop.getFertilizerUsage() / this.#crop.getGrowthTime()));

        // Grow the crop based on the time delta. 
        let cropGrowAmount = delta/1000
        // Slow down growth if we're low on water
        if (this.#waterLevel < 50) {
            cropGrowAmount *= (this.#waterLevel * 1.5) / 100 
        }
        // Slow down growth if we're out of fertilizer
        if (this.#fertilizerLevel <= 0) {
            cropGrowAmount *= 0.5
        }
        
        this.#crop.grow(cropGrowAmount);  

        // Kill the crop if it's too dry
        if (this.#waterLevel <= 0) {
            console.log(this.#crop.type + " died of dehydration");

            this.#crop.destroy();
            this.#crop = null;
        }

        // Make the tile shade based on water level
        this.#defaultTintColor = this.getBlueTint();
        if (!this.#isHovered) this.tileSprite.tint = this.#defaultTintColor

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

    getPrevCrop() {
        return this.#prevCropName;
    }

    getPrevCropCount() {
        return this.#prevCropCount;
    }

    getWaterLevel() {
        return this.#waterLevel;
    }

    updateAlertAlphas(time) {
        for (const key of Object.keys(this.alertIcons)) {
            if (!this.alertIcons[key]) continue;
            this.alertIcons[key].update(time)
        }
    }

    showWaterAlert() {
        // Ensure we have one active.
        const prevWaterIcon = this.alertIcons.waterLow

        if (!prevWaterIcon) {
            let waterLow = new AlertIcon(this.scene, "droplet")
            this.alertIcons.waterLow = waterLow
            waterLow.setScale(1/60)
            this.add(waterLow) // Add the icon to the tile
            this.bringToTop(waterLow) // Bring the icon to the top of the tile
        }
    }

    hideWaterAlert() {
        const prevWaterIcon = this.alertIcons.waterLow
        if (prevWaterIcon) {  // Water not low but we have an icon active
            prevWaterIcon.destroy()
            this.alertIcons.waterLow = null
        }
    }

    showWaterCritAlert() {
        // Ensure we have one active.
        const prevWaterCritIcon = this.alertIcons.waterCritLow

        if (!prevWaterCritIcon) {
            let waterCritLow = new AlertIcon(this.scene, "xDroplet")
            this.alertIcons.waterCritLow = waterCritLow
            waterCritLow.setScale(1/60)
            this.add(waterCritLow) // Add the icon to the tile
            this.bringToTop(waterCritLow) // Bring the icon to the top of the tile
        }
    }

    hideWaterCritAlert() {
        const prevWaterCritIcon = this.alertIcons.waterCritLow
        if (prevWaterCritIcon) {  // Water not critical but we have an icon active
            prevWaterCritIcon.destroy()
            this.alertIcons.waterCritLow = null
        }
    }

    showMonocropAlert() {
        // Ensure we have one active.
        const prevMonocropIcon = this.alertIcons.monocrop
        if (!prevMonocropIcon) {
            let monocrop = new AlertIcon(this.scene, "downArrow")
            this.alertIcons.monocrop = monocrop
            monocrop.setScale(1/60)
            this.add(monocrop) // Add the icon to the tile
            this.bringToTop(monocrop) // Bring the icon to the top of the tile
        }
    }

    hideMonocropAlert() {
        const prevMonocropIcon = this.alertIcons.monocrop
        if (prevMonocropIcon) { 
            prevMonocropIcon.destroy()
            this.alertIcons.monocrop = null
        }
    }

    showHarvestAlert() {
        // Ensure we have one active.
        const prevHarvestIcon = this.alertIcons.harvest
        if (!prevHarvestIcon) {
            let harvest = new AlertIcon(this.scene, "sickle")
            this.alertIcons.harvest = harvest
            harvest.setScale(1/60)
            this.add(harvest) // Add the icon to the tile
            this.bringToTop(harvest) // Bring the icon to the top of the tile
        }
    }

    hideHarvestAlert() {
        const prevHarvestIcon = this.alertIcons.harvest
        if (prevHarvestIcon) {  // Water not low but we have an icon active
            prevHarvestIcon.destroy()
            this.alertIcons.harvest = null
        }
    }

    // Function to handle clicking on the tile
    onPointerDown() {
        // Get the toolbar
        const toolBar = this.scene.toolbar;
        const config = this.scene.registry.get('config').toolbar;

        // check to see what tool is selected
        if (toolBar.currentToolType === ToolTypes.SEED) {   // 1/50 is a magic number
            this.plant(toolBar.currentSeed);
            return
        }
        // By now we know that the current tool is an equipment       
        if (toolBar.currentEquipment === EquipmentTypes.WATERING_CAN) {
            this.water(config.wateringCanAmount);
            return
        }

        if (toolBar.currentEquipment === EquipmentTypes.SICKLE) {
            this.harvest();
            return
        }

        if (toolBar.currentEquipment === EquipmentTypes.FERTILIZER) {
            this.fertilize(config.fertilizerAmount);
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
        this.tileSprite.tint = 0x00ff00;
    }

    // Function to handle when the mouse leaves the tile
    onPointerOut() {
        this.#isHovered = false;
        this.tileSprite.tint = this.#defaultTintColor;
    }
}
