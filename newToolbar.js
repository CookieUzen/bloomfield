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

    constructor() {
        this.currentToolType = ToolTypes.EQUIPMENT
        this.currentEquipment = EquipmentTypes.WATERING_CAN
        this.currentSeed = ''
    }

    getCurrentToolName() {
        return this.currentToolType === ToolTypes.EQUIPMENT ? this.currentEquipment : this.currentSeed + '_seed'
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