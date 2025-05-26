import { CustomCursor } from '../cursor';

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.finalScore = data.score || 0;
        this.finalEko = data.eko || 0; // Receive final eko
    }

    create() {
        // Initialize custom cursor
        this.customCursor = new CustomCursor(this);

        // Add scrolling starfield background
        this.starfield = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'starfield');
        this.starfield.setOrigin(0, 0);
        this.starfield.setScale(Math.max(this.cameras.main.width / this.starfield.width, this.cameras.main.height / this.starfield.height));

        // Add a subtle dark overlay
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.6).setOrigin(0);

        // Add "YOU LOSE" text with enhanced styling and animation (keeping Major Mono Display)
        const loseText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.2, 'YOU LOSE', {
            fontFamily: 'Major Mono Display',
            fontSize: this.cameras.main.width * 0.06 > 80 ? '80px' : `${this.cameras.main.width * 0.06}px`,
            color: '#ff0000',
            stroke: '#ffffff',
            strokeThickness: 8,
            shadow: { offsetX: 5, offsetY: 5, color: '#000000', blur: 10, fill: true, stroke: true }
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: loseText,
            alpha: 1,
            ease: 'Power2',
            duration: 1000
        });

        // Add final score text with Poppins
        const scoreText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.35, `Final score: ${this.finalScore}`, {
            fontFamily: 'Poppins',
            fontSize: this.cameras.main.width * 0.025 > 40 ? '40px' : `${this.cameras.main.width * 0.025}px`,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: scoreText,
            alpha: 1,
            ease: 'Power2',
            duration: 1000,
            delay: 500
        });

        // Add final money text with Poppins
        const ekoText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.45, `Eko earned: ${this.finalEko}`, {
            fontFamily: 'Poppins',
            fontSize: this.cameras.main.width * 0.02 > 32 ? '32px' : `${this.cameras.main.width * 0.02}px`,
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: ekoText,
            alpha: 1,
            ease: 'Power2',
            duration: 1000,
            delay: 1000
        });

        // Create Retry button with rounded corners and Poppins
        const retryButtonWidth = this.cameras.main.width * 0.25;
        const retryButtonHeight = this.cameras.main.height * 0.1;
        const cornerRadius = retryButtonHeight * 0.3;
        const retryButtonY = this.cameras.main.height * 0.6;

        this.retryButtonBg = this.add.graphics();
        this.drawRoundedButton(this.retryButtonBg, this.cameras.main.width / 2, retryButtonY, retryButtonWidth, retryButtonHeight, cornerRadius);

        // Create retry button zone
        this.retryButton = this.add.zone(this.cameras.main.width / 2, retryButtonY, retryButtonWidth, retryButtonHeight);
        this.retryButton.setInteractive();

        const retryText = this.add.text(this.cameras.main.width / 2, retryButtonY, 'Retry', {
            fontFamily: 'Poppins',
            fontSize: this.cameras.main.width * 0.03 > 30 ? '30px' : `${this.cameras.main.width * 0.03}px`,
            color: '#ffffff'
        }).setOrigin(0.5).setAlpha(0);

        // Create Main Menu button with rounded corners and Poppins
        const menuButtonWidth = this.cameras.main.width * 0.25;
        const menuButtonHeight = this.cameras.main.height * 0.1;
        const menuButtonY = this.cameras.main.height * 0.73;

        this.menuButtonBg = this.add.graphics();
        this.drawRoundedButton(this.menuButtonBg, this.cameras.main.width / 2, menuButtonY, menuButtonWidth, menuButtonHeight, cornerRadius);

        // Create menu button zone
        this.menuButton = this.add.zone(this.cameras.main.width / 2, menuButtonY, menuButtonWidth, menuButtonHeight);
        this.menuButton.setInteractive();

        const menuText = this.add.text(this.cameras.main.width / 2, menuButtonY, 'Main menu', {
            fontFamily: 'Poppins',
            fontSize: this.cameras.main.width * 0.03 > 30 ? '30px' : `${this.cameras.main.width * 0.03}px`,
            color: '#ffffff'
        }).setOrigin(0.5).setAlpha(0);

        // Animate buttons appearing
        this.tweens.add({
            targets: [this.retryButtonBg, retryText],
            alpha: 1,
            ease: 'Power2',
            duration: 1000,
            delay: 1500
        });

        this.tweens.add({
            targets: [this.menuButtonBg, menuText],
            alpha: 1,
            ease: 'Power2',
            duration: 1000,
            delay: 2000
        });

        // Add hover effects and click handlers for retry button
        this.retryButton.on('pointerover', () => {
            this.retryButtonBg.clear();
            this.drawRoundedButton(this.retryButtonBg, this.cameras.main.width / 2, retryButtonY, retryButtonWidth, retryButtonHeight, cornerRadius, true);
        });

        this.retryButton.on('pointerout', () => {
            this.retryButtonBg.clear();
            this.drawRoundedButton(this.retryButtonBg, this.cameras.main.width / 2, retryButtonY, retryButtonWidth, retryButtonHeight, cornerRadius, false);
        });

        this.retryButton.on('pointerdown', () => {
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.stop('GameOverScene');
                this.scene.start('GameScene');
            });
        });

        // Add hover effects and click handlers for menu button
        this.menuButton.on('pointerover', () => {
            this.menuButtonBg.clear();
            this.drawRoundedButton(this.menuButtonBg, this.cameras.main.width / 2, menuButtonY, menuButtonWidth, menuButtonHeight, cornerRadius, true);
        });

        this.menuButton.on('pointerout', () => {
            this.menuButtonBg.clear();
            this.drawRoundedButton(this.menuButtonBg, this.cameras.main.width / 2, menuButtonY, menuButtonWidth, menuButtonHeight, cornerRadius, false);
        });

        this.menuButton.on('pointerdown', () => {
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.stop('GameOverScene');
                this.scene.start('StartScene');
            });
        });

        // Handle resize
        this.scale.on('resize', this.resize, this);
        this.resize(this.scale.gameSize);
    }

    drawRoundedButton(graphic, x, y, width, height, radius, isHovered = false) {
        graphic.clear();
        if (isHovered) {
            graphic.fillStyle(0x3a3a3a, 0.9);
            graphic.lineStyle(2, 0xffffff, 1);
        } else {
            graphic.fillStyle(0x2a2a2a, 0.9);
            graphic.lineStyle(2, 0xeeeeee, 0.8);
        }
        const rectX = x - width / 2;
        const rectY = y - height / 2;
        graphic.fillRoundedRect(rectX, rectY, width, height, radius);
        graphic.strokeRoundedRect(rectX, rectY, width, height, radius);
    }

    resize(gameSize) {
        // Update camera and background on resize
        this.cameras.main.setSize(gameSize.width, gameSize.height);
        this.starfield.setSize(gameSize.width, gameSize.height);
        this.starfield.setScale(Math.max(gameSize.width / this.starfield.width, gameSize.height / this.starfield.height));

        // Update overlay size
        this.children.each(child => {
            if (child.type === 'Rectangle' && child.width === this.cameras.main.width && child.height === this.cameras.main.height) {
                child.setSize(gameSize.width, gameSize.height);
            }
        });

        // Reposition UI elements based on percentage of screen height/width
        const centerX = gameSize.width / 2;
        const cornerRadius = gameSize.height * 0.1 * 0.3;

        // Adjust positions and sizes based on new game size
        this.children.each(child => {
            if (child.text === 'YOU LOSE') child.setPosition(centerX, gameSize.height * 0.2);
            else if (child.text && child.text.startsWith('Final score:')) child.setPosition(centerX, gameSize.height * 0.35);
            else if (child.text && child.text.startsWith('Eko earned:')) child.setPosition(centerX, gameSize.height * 0.45);
        });

        // Update button positions and sizes
        const retryButtonWidth = gameSize.width * 0.25;
        const retryButtonHeight = gameSize.height * 0.1;
        const retryButtonY = gameSize.height * 0.6;

        this.retryButton.setPosition(centerX, retryButtonY);
        this.retryButton.setSize(retryButtonWidth, retryButtonHeight);
        this.drawRoundedButton(this.retryButtonBg, centerX, retryButtonY, retryButtonWidth, retryButtonHeight, cornerRadius);

        const menuButtonWidth = gameSize.width * 0.25;
        const menuButtonHeight = gameSize.height * 0.1;
        const menuButtonY = gameSize.height * 0.73;

        this.menuButton.setPosition(centerX, menuButtonY);
        this.menuButton.setSize(menuButtonWidth, menuButtonHeight);
        this.drawRoundedButton(this.menuButtonBg, centerX, menuButtonY, menuButtonWidth, menuButtonHeight, cornerRadius);
    }

    update() {
        // Update custom cursor
        this.customCursor.update();

         // Scroll the starfield background
        this.starfield.tilePositionX += 2;
    }
} 