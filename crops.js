export default class Crop extends Phaser.GameObjects.Sprite {

    // Private variables, use getters and setters!
    #type;          // type of crop (corn, soybean, etc)
    #growthStage;   // stage of crop (synced to texture)
    #grown;         // is the crop fully grown
    #time;          // artificial time since planting in seconds
    #health;        // health of the crop, TODO: USE THIS
    #waterDrainRate;   // rate at which water is drained per second
    #fertilizerUsage;   // rate at which fertilizer is drained per complete growth cycle
    #growthTime;    // time needed to grow the crop, fixed
    #moneyValue;    // money value of the crop
    #weight;        // weight of the crop
    #toNextStage;   // time until next stage

    // Constructor (for making a new crop)
    constructor(scene, type) {

        // Add sprites
        let texture = `${type}_1`

        // Yoink data from crops.json
        const cropData = scene.registry.get('config').crops

        // Call the sprite constructor with scene, position, and texture key.
        super(scene, 0, 0, texture);

        this.#type = type;
        this.#growthStage = 1;
        this.#grown = false;
        this.#time = 0;
        this.#health = 100;

        this.#waterDrainRate = cropData[type].waterUsage;
        this.#fertilizerUsage = cropData[type].fertilizerUsage;
        this.#growthTime = cropData[type].growthTime;
        this.#moneyValue = cropData[type].value;
        this.#weight = cropData[type].weight;
        this.#toNextStage = this.#growthTime / 4;
    }

    // Function to grow the crop by how many times
    grow(seconds) {
        this.#time += seconds
        this.#toNextStage -= seconds

        // Check if the crop is fully grown
        if (this.#growthStage >= 4) {
            this.#grown = true;
            return  // Don't grow if the crop is fully grown
        }

        // Update growth stage if we have passed the growth time
        if (this.#toNextStage <= 0) {
            this.#growthStage += 1;
            this.#toNextStage = this.#growthTime / 3;    // Reset the timer

            // Update the texture
            let newTextureName = this.texture.key.slice(0, -1) + this.#growthStage;    // Chop off the last number, add new growth stage
            this.setTexture(newTextureName);
        }

    }

    // Function to modify the health of the crop
    hpModifier(mod) {
        this.#health += mod
    }

    // Getter methods
    getType() {
        return this.#type;
    }

    getGrowthStage() {
        return this.#growthStage;
    }

    isGrown() {
        return this.#grown;
    }

    getTime() {
        return this.#time;
    }

    getHealth() {
        return this.#health;
    }

    getWaterDrainRate() {
        return this.#waterDrainRate;
    }

    getFertilizerUsage() {
        return this.#fertilizerUsage;
    }

    getGrowthTime() {
        return this.#growthTime;
    }

    getMoneyValue() {
        return this.#moneyValue;
    }

    getWeight() {
        return this.#weight;
    }

    getToNextStage() {
        return this.#toNextStage;
    }

    // Static function to calculate the total food units from harvest_bin dictionary
    static calculateTotalFoodUnits(scene, harvest_bin=null) {
        let total = 0;

        // Get cropData and harvest_bin
        let cropData = scene.cache.json.get('cropData')
        if (null == harvest_bin)
            harvest_bin = scene.registry.get('harvest_bin')

        // Loop over the harvest_bin
        for (let cropType in harvest_bin) {
            let weight = cropData[cropType].weight;
            total += weight;
        }

        return total;
    }
}
