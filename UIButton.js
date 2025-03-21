import { ToolTypes } from './toolbar.js';   // {  } for importing a const


class UIButton extends Phaser.GameObjects.Container {

    constructor(scene, x, y, backgroundSprite, callback) {
        super(scene, x, y)

        
    }
}

export class UITextButton extends Phaser.GameObjects.Container {

    constructor(scene, x, y, text, callback) {
        super(scene, x, y)

        // Create text and position accordingly
        const textSprite = new Phaser.GameObjects.Text(scene, 0, 0, text)
        textSprite.setPosition(-textSprite.width/2, -textSprite.height/2)
        this.add(textSprite)

        // Padding in px
        const padding = 20

        this.buttonWidth = textSprite.width + padding
        this.buttonHeight = textSprite.height + padding

        // The button background
        this.background = new Phaser.GameObjects.Graphics(scene)
        // Draw the box
        this.drawButtonBackground(0x555555)
        // Add to container and reorder
        this.add(this.background)
        this.background.setBelow(textSprite)

        this.setInteractive(new Phaser.Geom.Rectangle(-this.buttonWidth / 2, -this.buttonHeight / 2, this.buttonWidth, this.buttonHeight), Phaser.Geom.Rectangle.Contains)
        .on('pointerdown', () => {if (callback) callback() })  // Handle mouse down
        .on('pointerover', () => {
            this.drawButtonBackground(0x222222)
        })  // Handle hovering and drag
        .on('pointerout', () => {
            this.drawButtonBackground(0x555555)
        })  // Clear tint when mouse leaves


    }

    drawButtonBackground(fillColor) {
        this.background.clear()
        this.background.fillStyle(fillColor, 1);
        this.background.fillRoundedRect(-this.buttonWidth / 2, -this.buttonHeight / 2, this.buttonWidth, this.buttonHeight, 10);
    }

}

export class UIImageButton extends Phaser.GameObjects.Container {

    constructor(scene, x, y, image, callback) {
        super(scene, x, y)

        // Create text and position accordingly
        const imageSprite = new Phaser.GameObjects.Image(scene, 0, 0, image)
        this.add(imageSprite)

        // Padding in px
        const padding = 20

        this.buttonWidth = imageSprite.width + padding
        this.buttonHeight = imageSprite.height + padding

        // The button background
        this.background = new Phaser.GameObjects.Graphics(scene)
        // Draw the box
        this.drawButtonBackground(0x555555)
        // Add to container and reorder
        this.add(this.background)
        this.background.setBelow(imageSprite)

        this.setInteractive(new Phaser.Geom.Rectangle(-this.buttonWidth / 2, -this.buttonHeight / 2, this.buttonWidth, this.buttonHeight), Phaser.Geom.Rectangle.Contains)
        .on('pointerdown', () => {if (callback) callback() })  // Handle mouse down
        .on('pointerover', () => {
            this.drawButtonBackground(0x222222)
        })  // Handle hovering and drag
        .on('pointerout', () => {
            this.drawButtonBackground(0x555555)
        })  // Clear tint when mouse leaves


    }

    drawButtonBackground(fillColor) {
        this.background.clear()
        this.background.fillStyle(fillColor, 1);
        this.background.fillRoundedRect(-this.buttonWidth / 2, -this.buttonHeight / 2, this.buttonWidth, this.buttonHeight, 10);
    }

}

