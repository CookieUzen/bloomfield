export default class Crop extends Phaser.GameObjects.Sprite {

    // Constructor (for making a new crop)
    constructor(scene, x, y, type) {

        // Add sprites
        let texture = '';
        switch (type) {
            case 'corn':
                texture = 'corn_1';
                break;
            case 'soybean':
                texture = 'soybean_1';
                break;
        }

        if (texture === '') {
            console.error("Texture for "+type+" not found!")
        }

        // Yoink data from crops.json
        const cropData = scene.cache.json.get('cropData');

        // Call the sprite constructor with scene, position, and texture key.
        super(scene, x, y, texture);

        this.type = type;       // type of crop (corn, soybean, etc)
        this.growthStage = 1;   // stage of crop (synced to texture)
        this.grown = false;     // is the crop fully grown
        this.time = 0;          // artificial time since planting in seconds
        this.health = 100;      // health of the crop, TODO: USE THIS

        this.waterDrainRate = cropData[type].waterUsage;   // rate at which water is drained per second
        this.growthTime = cropData[type].growthTime;    // time needed to grow the crop, fixed
        this.moneyValue = cropData[type].value;         // money value of the crop
        this.weight = cropData[type].weight;            // weight of the crop
        this.toNextStage = this.growthTime/4;   // time until next stage

        scene.add.existing(this);
    }

    // Function to grow the crop by how many times
    grow(seconds) {
        this.time += seconds
        this.toNextStage -= seconds

        // console.log(this.type + " has been growing for "+this.time+" seconds");

        // Check if the crop is fully grown
        if (this.growthStage >= 4) {
            this.grown = true;
            return  // Don't grow if the crop is fully grown
        }

        // Update growth stage if we have passed the growth time
        if (this.toNextStage <= 0) {
            this.growthStage += 1;
            this.toNextStage = this.growthTime/4;    // Reset the timer

            // Updaet the texture
            let newTextureName = this.texture.key.slice(0, -1) + this.growthStage;    // Chop off the last number, add new growth stage
            this.setTexture(newTextureName);
            console.log(this.type + " grew to stage "+this.growthStage);
        }

    }

    // Function to modify the health of the crop
    hpModifier(mod) {
        this.health += mod
    }
}
