export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.finalScore = data.score || 0;
        this.finalEko = data.eko || 0; // Receive final eko
    }

    create() {
        // Add scrolling starfield background
        this.starfield = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'starfield');
        this.starfield.setOrigin(0, 0);
        this.starfield.setScale(Math.max(this.cameras.main.width / this.starfield.width, this.cameras.main.height / this.starfield.height));

        // Add a subtle dark overlay
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.6).setOrigin(0);

        // Add "YOU LOSE" text with enhanced styling and animation (keeping Major Mono Display)
        const loseText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.2, 'YOU LOSE', {
            fontFamily: 'Major Mono Display',
            fontSize: '80px',
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
            fontSize: '40px',
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
        const ekoText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.45, `Total eko: ${this.finalEko}`, {
            fontFamily: 'Poppins',
            fontSize: '32px',
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
        this.retryButtonBg = this.add.graphics().setAlpha(0);
        const retryButtonWidth = this.cameras.main.width * 0.2;
        const retryButtonHeight = this.cameras.main.height * 0.08;
        const cornerRadius = retryButtonHeight * 0.2;
        this.drawRoundedButton(this.retryButtonBg, this.cameras.main.width / 2, this.cameras.main.height * 0.6, retryButtonWidth, retryButtonHeight, cornerRadius);

        this.retryButtonBg.setInteractive(new Phaser.Geom.Rectangle(this.cameras.main.width / 2 - retryButtonWidth / 2, this.cameras.main.height * 0.6 - retryButtonHeight / 2, retryButtonWidth, retryButtonHeight), Phaser.Geom.Rectangle.Contains);

        const retryText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.6, 'Retry', {
            fontFamily: 'Poppins',
            fontSize: '30px',
            color: '#ffffff'
        }).setOrigin(0.5).setAlpha(0);

        // Create Main Menu button with rounded corners and Poppins
        this.menuButtonBg = this.add.graphics().setAlpha(0);
        const menuButtonWidth = this.cameras.main.width * 0.2;
        const menuButtonHeight = this.cameras.main.height * 0.08;
        this.drawRoundedButton(this.menuButtonBg, this.cameras.main.width / 2, this.cameras.main.height * 0.73, menuButtonWidth, menuButtonHeight, cornerRadius);

        this.menuButtonBg.setInteractive(new Phaser.Geom.Rectangle(this.cameras.main.width / 2 - menuButtonWidth / 2, this.cameras.main.height * 0.73 - menuButtonHeight / 2, menuButtonWidth, menuButtonHeight), Phaser.Geom.Rectangle.Contains);

        const menuText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.73, 'Main menu', {
            fontFamily: 'Poppins',
            fontSize: '30px',
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

        // Button hover effects
        const buttons = [
            { bg: this.retryButtonBg, text: retryText },
            { bg: this.menuButtonBg, text: menuText }
        ];

        buttons.forEach(button => {
            button.bg.on('pointerover', () => {
                this.tweens.add({
                    targets: [button.bg, button.text],
                    scale: 1.05,
                    duration: 100
                });
                button.bg.lineStyle(2, 0xff0000, 0.5);
            });

            button.bg.on('pointerout', () => {
                this.tweens.add({
                    targets: [button.bg, button.text],
                    scale: 1,
                    duration: 100
                });
                button.bg.lineStyle(2, 0xffffff, 0.5);
            });
        });

        // Button click actions
        this.retryButtonBg.on('pointerdown', () => {
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.stop('GameOverScene');
                this.scene.start('GameScene');
            });
        });

        this.menuButtonBg.on('pointerdown', () => {
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

    drawRoundedButton(graphic, x, y, width, height, radius) {
        graphic.clear();
        graphic.fillStyle(0x1a1a1a, 0.8);
        graphic.lineStyle(2, 0xffffff, 0.5);
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
        const cornerRadius = gameSize.height * 0.08 * 0.2;

        // Adjust positions and sizes based on new game size
        this.children.each(child => {
            if (child.text === 'YOU LOSE') child.setPosition(centerX, gameSize.height * 0.2);
            else if (child.text && child.text.startsWith('Final score:')) child.setPosition(centerX, gameSize.height * 0.35);
            else if (child.text && child.text.startsWith('Total eko:')) child.setPosition(centerX, gameSize.height * 0.45);
            // Reposition rounded button graphics and text
            else if (child === this.retryButtonBg) {
                const buttonWidth = gameSize.width * 0.2;
                const buttonHeight = gameSize.height * 0.08;
                this.drawRoundedButton(this.retryButtonBg, centerX, gameSize.height * 0.6, buttonWidth, buttonHeight, cornerRadius);
                this.retryButtonBg.setInteractive(new Phaser.Geom.Rectangle(centerX - buttonWidth / 2, gameSize.height * 0.6 - buttonHeight / 2, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);
            } else if (child === this.menuButtonBg) {
                const buttonWidth = gameSize.width * 0.2;
                const buttonHeight = gameSize.height * 0.08;
                this.drawRoundedButton(this.menuButtonBg, centerX, gameSize.height * 0.73, buttonWidth, buttonHeight, cornerRadius);
                this.menuButtonBg.setInteractive(new Phaser.Geom.Rectangle(centerX - buttonWidth / 2, gameSize.height * 0.73 - buttonHeight / 2, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);
            } else if (child.text === 'Retry') child.setPosition(centerX, gameSize.height * 0.6);
            else if (child.text === 'Main menu') child.setPosition(centerX, gameSize.height * 0.73);
        });
    }

    update() {
         // Scroll the starfield background
        this.starfield.tilePositionX += 2;
    }
} 