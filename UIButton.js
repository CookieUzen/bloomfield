import { ToolTypes } from './toolbar.js';   // {  } for importing a const


class UIButton extends Phaser.GameObjects.Container {

    constructor(scene, x, y) {
        super(scene, x, y)

        // background color for button states
        this.backgroundDefault = '0xffffff'
        this.backgroundHover = '0x888888'

        this.textColor = '0x000000'

        // Padding in px
        this.padding = 20
        
    }
}

export class UITextButton extends UIButton {

    constructor(scene, x, y, text, callback) {
        super(scene, x, y)

        // Create text and position accordingly
        const textSprite = new Phaser.GameObjects.Text(scene, 0, 0, text)
        textSprite.setPosition(-textSprite.width/2, -textSprite.height/2)
        textSprite.setColor(this.textColor)
        this.add(textSprite)

        this.buttonWidth = textSprite.width + this.padding
        this.buttonHeight = textSprite.height + this.padding

        // The button background
        this.background = new Phaser.GameObjects.Graphics(scene)
        // Draw the box
        this.drawButtonBackground(this.backgroundDefault)
        // Add to container and reorder
        this.add(this.background)
        this.background.setBelow(textSprite)

        // Create the hitbox manually, because containers and graphics don't have any
        this.setInteractive(new Phaser.Geom.Rectangle(-this.buttonWidth / 2, -this.buttonHeight / 2, this.buttonWidth, this.buttonHeight), Phaser.Geom.Rectangle.Contains)
        .on('pointerdown', () => {if (callback) callback() })  // Handle mouse down
        .on('pointerover', () => {
            this.drawButtonBackground(this.backgroundHover)
        })  // Handle hovering and drag
        .on('pointerout', () => {
            this.drawButtonBackground(this.backgroundDefault)
        })  // Clear tint when mouse leaves


    }

    drawButtonBackground(fillColor) {
        this.background.clear()
        this.background.fillStyle(fillColor, 1);
        this.background.fillRoundedRect(-this.buttonWidth / 2, -this.buttonHeight / 2, this.buttonWidth, this.buttonHeight, 10);
    }

}

export class UIImageButton extends UIButton {

    constructor(scene, x, y, image, callback) {
        super(scene, x, y)

        // Create text and position accordingly
        const imageSprite = new Phaser.GameObjects.Image(scene, 0, 0, image)
        this.add(imageSprite)

        this.buttonWidth = imageSprite.width + this.padding
        this.buttonHeight = imageSprite.height + this.padding

        // The button background
        this.background = new Phaser.GameObjects.Graphics(scene)
        // Draw the box
        this.drawButtonBackground(this.backgroundDefault)
        // Add to container and reorder
        this.add(this.background)
        this.background.setBelow(imageSprite)

        this.setInteractive(new Phaser.Geom.Rectangle(-this.buttonWidth / 2, -this.buttonHeight / 2, this.buttonWidth, this.buttonHeight), Phaser.Geom.Rectangle.Contains)
        .on('pointerdown', () => {if (callback) callback() })  // Handle mouse down
        .on('pointerover', () => {
            this.drawButtonBackground(this.backgroundHover)
        })  // Handle hovering and drag
        .on('pointerout', () => {
            this.drawButtonBackground(this.backgroundDefault)
        })  // Clear tint when mouse leaves


    }

    drawButtonBackground(fillColor) {
        this.background.clear()
        this.background.fillStyle(fillColor, 1);
        this.background.fillRoundedRect(-this.buttonWidth / 2, -this.buttonHeight / 2, this.buttonWidth, this.buttonHeight, 10);
    }

}

