// Enum like object for tool types
export const ToolTypes = Object.freeze({
    EQUIPMENT: 'equipment',
    SEED: 'seed',
});

export const EquipmentTypes = Object.freeze({
    WATERING_CAN: 'watering_can',
    SICKLE: 'sickle',
    FERTILIZER: 'fertilizer'
})

export class NewToolbar {

    currentToolType;
    currentEquipment;
    currentSeed;
    fertilizerLeft; // How many fertilizers usages left

    constructor() {
        this.currentToolType = ToolTypes.EQUIPMENT
        this.currentEquipment = EquipmentTypes.WATERING_CAN
        this.currentSeed = ''
        this.fertilizerLeft = 0
    }

    getCurrentToolName() {
        return this.currentToolType === ToolTypes.EQUIPMENT ? this.currentEquipment : this.currentSeed + '_seed'
    }

    getFertilizerLeft() {
        return this.fertilizerLeft
    }

    useFertilizer() {
        if (this.fertilizerLeft > 0) {
            this.fertilizerLeft -= 1
            return true
        }

        return false
    }

    addFertilizer(amount) {
        this.fertilizerLeft += amount
    }

    setToolEquipment(equipment) {
        this.currentToolType = ToolTypes.EQUIPMENT
        this.currentEquipment = equipment
    }

    setToolSeed(seed) {
        this.currentToolType = ToolTypes.SEED
        this.currentSeed = seed
    }

}
