// Enum like object for tool types
export const ToolTypes = Object.freeze({
    CORN_SEED: 'corn_seed',
    SOYBEAN_SEED: 'wheat_seed',
    WATERING_CAN: 'watering_can',
    SICKLE: 'sickle'
});

// This class manage the toolbar for the main scene
export default class Toolbar {
    // Private variables, use getters and setters!
    #currentTool;    // The current tool selected
    #tools;            // The tools in the toolbar

    constructor() {
        this.#currentTool = '';    // The current tool selected

        this.#tools = [
            ToolTypes.CORN_SEED,        // Slot 1
            ToolTypes.SOYBEAN_SEED,        // Slot 2
            ToolTypes.WATERING_CAN,        // etc...
            ToolTypes.SICKLE,            // Up to 9 slots
        ];

        console.log("Toolbar created");
    }

    // Select a tool from the toolbar
    selectTool(slot) {
        var tool = this.#tools[slot-1];
        if (tool == undefined) {
            // No tool here! Run away!
            return;
        }

        this.#currentTool = tool
        console.log("Selected tool: " + this.#currentTool);
        return this.#currentTool;
    }
    
    // Get the current tool
    getCurrentTool() {
        return this.#currentTool;
    }

    // Add a tool to the toolbar
    addTool(tool) {
        if (this.#tools.includes(tool)) {
            console.log("Tool already in toolbar");
            return;
        }

        if (this.#tools.length >= 9) {
            console.log("Toolbar full");
            return;
        }

        this.#tools.push(tool);
    }

    // Remove a tool from the toolbar
    removeTool(tool) {
        var index = this.#tools.indexOf(tool);
        if (index != -1) {
            this.#tools.splice(index, 1);
        }
    }
}
