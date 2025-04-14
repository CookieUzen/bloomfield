


class UIButton extends Phaser.GameObjects.Container {

    constructor(scene, x, y) {
        super(scene, x, y)

        // background color for button states
        this.backgroundDefault = '0xffffff'
        this.backgroundHover = '0x888888'

        this.textColor = '0x000000'

        // Padding in px
        this.padding = 16
        
    }
}

export class UITextButton extends UIButton {

    constructor(scene, x, y, text, callback) {
        super(scene, x, y)

        if (text === '') {
            return
        }

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

    drawButtonBackground(fillColor, alpha = 1) {
        this.background.clear()
        this.background.alpha = alpha
        this.background.fillStyle(fillColor, 1);
        this.background.fillRoundedRect(-this.buttonWidth / 2, -this.buttonHeight / 2, this.buttonWidth, this.buttonHeight, 10);
    }

}

export class UIImageButton extends UIButton {

    constructor(scene, x, y, image, callback) {
        super(scene, x, y)

        // Create text and position accordingly
        const imageSprite = new Phaser.GameObjects.Image(scene, 0, 0, image)
        imageSprite.scale = 2
        this.add(imageSprite)

        this.buttonWidth = imageSprite.width * 2 + this.padding
        this.buttonHeight = imageSprite.height * 2 + this.padding

        // The button background
        this.background = new Phaser.GameObjects.Graphics(scene)
        this.background.setAbove(this.imageSprite)
        // Draw the box
        this.drawButtonBackground(this.backgroundDefault, 0)
        // Add to container and reorder
        this.add(this.background)
        this.background.setBelow(imageSprite)

        this.setInteractive(new Phaser.Geom.Rectangle(-this.buttonWidth / 2, -this.buttonHeight / 2, this.buttonWidth, this.buttonHeight), Phaser.Geom.Rectangle.Contains)
        .on('pointerdown', () => {
            if (callback) { 
                callback()
            } 
            this.drawButtonBackground(this.backgroundHover, 0.5) 
        })  // Handle mouse down
        .on('pointerup', () => {
            this.drawButtonBackground(this.backgroundDefault, 0.5)
        })  // Handle mouse up
        .on('pointerover', () => {
            this.drawButtonBackground(this.backgroundDefault, 0.5)
        })  // Handle hovering and drag
        .on('pointerout', () => {
            this.drawButtonBackground(this.backgroundDefault, 0)
        })  // Clear tint when mouse leaves


    }

    drawButtonBackground(fillColor, alpha = 1) {
        this.background.clear()
        this.background.alpha = alpha
        this.background.fillStyle(fillColor, 1);
        this.background.fillRect(-this.buttonWidth / 2, -this.buttonHeight / 2, this.buttonWidth, this.buttonHeight);
    }

}

export class UIImageButtonWithText extends UIImageButton {
    text;

    constructor (scene, x, y, image, text, callback) {
        super(scene, x, y, image, callback)

        // Create text and position accordingly
        this.text = new Phaser.GameObjects.Text(scene, 0, 0, text)
        this.text.setOrigin(0, 0)
        // Place the text on the bottom right
        this.text.setPosition(15, 20)   // magic numbers
        this.text.setColor(this.textColor)
        this.add(this.text)
        this.buttonWidth = Math.max(this.buttonWidth, this.text.width + this.padding)
        this.buttonHeight = Math.max(this.buttonHeight, this.text.height + this.padding)
    }
}
