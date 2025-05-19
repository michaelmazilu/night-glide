export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.finalScore = data.score || 0;
    }

    create() {
        // Add scrolling starfield background
        this.starfield = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'starfield');
        this.starfield.setOrigin(0, 0);
        this.starfield.setScale(Math.max(this.cameras.main.width / this.starfield.width, this.cameras.main.height / this.starfield.height));

        // Add a subtle dark overlay
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.6).setOrigin(0);

        // Add "YOU LOSE" text with enhanced styling and animation
        const loseText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.3, 'YOU LOSE', {
            fontFamily: 'Major Mono Display',
            fontSize: '80px', // Increased font size
            color: '#ff0000',
            stroke: '#ffffff', // White stroke for contrast
            strokeThickness: 8,
            shadow: { offsetX: 5, offsetY: 5, color: '#000000', blur: 10, fill: true, stroke: true }
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: loseText,
            alpha: 1,
            y: this.cameras.main.height * 0.25, // Move slightly up
            ease: 'Power2',
            duration: 1000
        });

        // Add final score text with enhanced styling and animation
        const scoreText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.45, `FINAL SCORE: ${this.finalScore}`, {
            fontFamily: 'Major Mono Display',
            fontSize: '40px', // Increased font size
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setAlpha(0);

         this.tweens.add({
            targets: scoreText,
            alpha: 1,
            y: this.cameras.main.height * 0.4, // Move slightly up
            ease: 'Power2',
            duration: 1000,
            delay: 500 // Delayed animation
        });

        // Create Retry button with modern styling and animation
        const retryButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.6, 'RETRY', {
            fontFamily: 'Major Mono Display',
            fontSize: '30px', // Increased font size
            color: '#ffffff',
            backgroundColor: '#1a1a1a', // Darker background
            padding: { x: 30, y: 15 },
            stroke: '#ffffff',
            strokeThickness: 2
        }).setOrigin(0.5).setInteractive().setAlpha(0);

         this.tweens.add({
            targets: retryButton,
            alpha: 1,
            y: this.cameras.main.height * 0.58, // Move slightly up
            ease: 'Power2',
            duration: 1000,
            delay: 1000 // Delayed animation
        });

        // Create Main Menu button with modern styling and animation
        const menuButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.75, 'MAIN MENU', {
            fontFamily: 'Major Mono Display',
            fontSize: '30px', // Increased font size
            color: '#ffffff',
            backgroundColor: '#1a1a1a', // Darker background
            padding: { x: 30, y: 15 },
            stroke: '#ffffff',
            strokeThickness: 2
        }).setOrigin(0.5).setInteractive().setAlpha(0);

         this.tweens.add({
            targets: menuButton,
            alpha: 1,
            y: this.cameras.main.height * 0.73, // Move slightly up
            ease: 'Power2',
            duration: 1000,
            delay: 1500 // Delayed animation
        });

        // Button hover effects with color and scale change
        const buttons = [retryButton, menuButton];
        buttons.forEach(button => {
            button.on('pointerover', () => {
                this.tweens.add({
                    targets: button,
                    scale: 1.05,
                    duration: 100
                });
                 button.setStyle({ stroke: '#ff0000' }); // Red stroke on hover
            });
            button.on('pointerout', () => {
                 this.tweens.add({
                    targets: button,
                    scale: 1,
                    duration: 100
                });
                button.setStyle({ stroke: '#ffffff' }); // White stroke on rest
            });
        });

        // Button click actions
        retryButton.on('pointerdown', () => {
             this.cameras.main.fade(500, 0, 0, 0); // Fade out on click
             this.time.delayedCall(500, () => {
                this.scene.stop('GameOverScene'); // Stop this scene
                this.scene.start('GameScene');
            });
        });

        menuButton.on('pointerdown', () => {
             this.cameras.main.fade(500, 0, 0, 0); // Fade out on click
             this.time.delayedCall(500, () => {
                this.scene.stop('GameOverScene'); // Stop this scene
                this.scene.start('StartScene');
            });
        });

         // Handle resize - improved repositioning
        this.scale.on('resize', this.resize, this);
    }

     resize(gameSize) {
        // Update camera and background on resize
        this.cameras.main.setSize(gameSize.width, gameSize.height);
        this.starfield.setSize(gameSize.width, gameSize.height);
        this.starfield.setScale(Math.max(gameSize.width / this.starfield.width, this.starfield.height / this.starfield.height));

         // Update overlay size
        this.children.each(child => {
            if (child.type === 'Rectangle' && child.width === this.cameras.main.width && child.height === this.cameras.main.height) {
                child.setSize(gameSize.width, gameSize.height);
            }
        });

         // Reposition UI elements based on percentage of screen height/width
        const centerX = gameSize.width / 2;

        // Adjust positions based on new game size
        this.children.each(child => {
            if (child.text === 'YOU LOSE') child.setPosition(centerX, gameSize.height * 0.25);
            else if (child.text && child.text.startsWith('FINAL SCORE:')) child.setPosition(centerX, gameSize.height * 0.4);
            else if (child.text === 'RETRY') child.setPosition(centerX, gameSize.height * 0.58);
            else if (child.text === 'MAIN MENU') child.setPosition(centerX, gameSize.height * 0.73);
        });
    }

    update() {
         // Scroll the starfield background
        this.starfield.tilePositionX += 2;
    }
} 