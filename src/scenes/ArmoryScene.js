import { CustomCursor } from '../cursor';

export class ArmoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ArmoryScene' });
    }

    preload() {
        // Load assets
        this.load.image('starfield', 'assets/starfield.png');
        this.load.image('spaceship', 'assets/spaceship.png');
        this.load.image('asteroid', 'assets/asteroid.png');
        this.load.audio('backgroundMusic', 'assets/backjazz.mp3');
        this.load.image('coin', 'assets/coin.png');
        this.load.image('coin2', 'assets/coin2.png');
        this.load.image('logo', 'assets/logo.png');
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

        // Add title with Major Mono Display
        this.title = this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.1, 'Armory', {
            fontFamily: 'Major Mono Display',
            fontSize: this.cameras.main.width * 0.06 > 80 ? '80px' : `${this.cameras.main.width * 0.06}px`,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            shadow: { offsetX: 5, offsetY: 5, color: '#000000', blur: 10, fill: true, stroke: true }
        }).setOrigin(0.5);

        // Add Eko display with Poppins
        this.ekoText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.2, 'Eko: 0', {
            fontFamily: 'Poppins',
            fontSize: this.cameras.main.width * 0.02 > 24 ? '24px' : `${this.cameras.main.width * 0.02}px`,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Create upgrade buttons with rounded corners and Poppins
        const buttonWidth = this.cameras.main.width * 0.25;
        const buttonHeight = this.cameras.main.height * 0.1;
        const cornerRadius = buttonHeight * 0.3;
        const buttonY = this.cameras.main.height * 0.4;

        // Speed upgrade button
        this.speedButtonBg = this.add.graphics();
        this.drawRoundedButton(this.speedButtonBg, this.cameras.main.width / 2, buttonY, buttonWidth, buttonHeight, cornerRadius);

        // Create speed button zone
        this.speedButton = this.add.zone(this.cameras.main.width / 2, buttonY, buttonWidth, buttonHeight);
        this.speedButton.setInteractive();

        this.speedText = this.add.text(this.cameras.main.width / 2, buttonY, 'Speed: 1', {
            fontFamily: 'Poppins',
            fontSize: this.cameras.main.width * 0.03 > 30 ? '30px' : `${this.cameras.main.width * 0.03}px`,
            color: '#ffffff'
        }).setOrigin(0.5);

        // Control upgrade button
        this.controlButtonBg = this.add.graphics();
        this.drawRoundedButton(this.controlButtonBg, this.cameras.main.width / 2, buttonY + buttonHeight + 20, buttonWidth, buttonHeight, cornerRadius);

        // Create control button zone
        this.controlButton = this.add.zone(this.cameras.main.width / 2, buttonY + buttonHeight + 20, buttonWidth, buttonHeight);
        this.controlButton.setInteractive();

        this.controlText = this.add.text(this.cameras.main.width / 2, buttonY + buttonHeight + 20, 'Control: 1', {
            fontFamily: 'Poppins',
            fontSize: this.cameras.main.width * 0.03 > 30 ? '30px' : `${this.cameras.main.width * 0.03}px`,
            color: '#ffffff'
        }).setOrigin(0.5);

        // Armor upgrade button
        this.armorButtonBg = this.add.graphics();
        this.drawRoundedButton(this.armorButtonBg, this.cameras.main.width / 2, buttonY + (buttonHeight + 20) * 2, buttonWidth, buttonHeight, cornerRadius);

        // Create armor button zone
        this.armorButton = this.add.zone(this.cameras.main.width / 2, buttonY + (buttonHeight + 20) * 2, buttonWidth, buttonHeight);
        this.armorButton.setInteractive();

        this.armorText = this.add.text(this.cameras.main.width / 2, buttonY + (buttonHeight + 20) * 2, 'Armor: 1', {
            fontFamily: 'Poppins',
            fontSize: this.cameras.main.width * 0.03 > 30 ? '30px' : `${this.cameras.main.width * 0.03}px`,
            color: '#ffffff'
        }).setOrigin(0.5);

        // Add hover effects and click handlers for speed button
        this.speedButton.on('pointerover', () => {
            this.speedButtonBg.clear();
            this.drawRoundedButton(this.speedButtonBg, this.cameras.main.width / 2, buttonY, buttonWidth, buttonHeight, cornerRadius, true);
        });

        this.speedButton.on('pointerout', () => {
            this.speedButtonBg.clear();
            this.drawRoundedButton(this.speedButtonBg, this.cameras.main.width / 2, buttonY, buttonWidth, buttonHeight, cornerRadius, false);
        });

        this.speedButton.on('pointerdown', () => {
            this.upgradeSpeed();
        });

        // Add hover effects and click handlers for control button
        this.controlButton.on('pointerover', () => {
            this.controlButtonBg.clear();
            this.drawRoundedButton(this.controlButtonBg, this.cameras.main.width / 2, buttonY + buttonHeight + 20, buttonWidth, buttonHeight, cornerRadius, true);
        });

        this.controlButton.on('pointerout', () => {
            this.controlButtonBg.clear();
            this.drawRoundedButton(this.controlButtonBg, this.cameras.main.width / 2, buttonY + buttonHeight + 20, buttonWidth, buttonHeight, cornerRadius, false);
        });

        this.controlButton.on('pointerdown', () => {
            this.upgradeControl();
        });

        // Add hover effects and click handlers for armor button
        this.armorButton.on('pointerover', () => {
            this.armorButtonBg.clear();
            this.drawRoundedButton(this.armorButtonBg, this.cameras.main.width / 2, buttonY + (buttonHeight + 20) * 2, buttonWidth, buttonHeight, cornerRadius, true);
        });

        this.armorButton.on('pointerout', () => {
            this.armorButtonBg.clear();
            this.drawRoundedButton(this.armorButtonBg, this.cameras.main.width / 2, buttonY + (buttonHeight + 20) * 2, buttonWidth, buttonHeight, cornerRadius, false);
        });

        this.armorButton.on('pointerdown', () => {
            this.upgradeArmor();
        });

        // Create Back button with rounded corners and Poppins
        const backButtonWidth = this.cameras.main.width * 0.25;
        const backButtonHeight = this.cameras.main.height * 0.1;
        const backButtonY = this.cameras.main.height * 0.9;

        this.backButtonBg = this.add.graphics();
        this.drawRoundedButton(this.backButtonBg, this.cameras.main.width / 2, backButtonY, backButtonWidth, backButtonHeight, cornerRadius);

        // Create back button zone
        this.backButton = this.add.zone(this.cameras.main.width / 2, backButtonY, backButtonWidth, backButtonHeight);
        this.backButton.setInteractive();

        this.backText = this.add.text(this.cameras.main.width / 2, backButtonY, 'Back', {
            fontFamily: 'Poppins',
            fontSize: this.cameras.main.width * 0.03 > 30 ? '30px' : `${this.cameras.main.width * 0.03}px`,
            color: '#ffffff'
        }).setOrigin(0.5);

        // Add hover effects and click handlers for back button
        this.backButton.on('pointerover', () => {
            this.backButtonBg.clear();
            this.drawRoundedButton(this.backButtonBg, this.cameras.main.width / 2, backButtonY, backButtonWidth, backButtonHeight, cornerRadius, true);
        });

        this.backButton.on('pointerout', () => {
            this.backButtonBg.clear();
            this.drawRoundedButton(this.backButtonBg, this.cameras.main.width / 2, backButtonY, backButtonWidth, backButtonHeight, cornerRadius, false);
        });

        this.backButton.on('pointerdown', () => {
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('StartScene');
            });
        });

        // Load saved upgrades and Eko
        this.loadUpgrades();

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

    loadUpgrades() {
        // Load saved upgrades and Eko from localStorage
        this.upgrades = {
            speed: parseInt(localStorage.getItem('speedUpgrade')) || 1,
            control: parseInt(localStorage.getItem('controlUpgrade')) || 1,
            armor: parseInt(localStorage.getItem('armorUpgrade')) || 1
        };
        this.eko = parseInt(localStorage.getItem('eko')) || 0;
        this.updateDisplay();
    }

    saveUpgrades() {
        // Save upgrades and Eko to localStorage
        localStorage.setItem('speedUpgrade', this.upgrades.speed);
        localStorage.setItem('controlUpgrade', this.upgrades.control);
        localStorage.setItem('armorUpgrade', this.upgrades.armor);
        localStorage.setItem('eko', this.eko);
    }

    updateDisplay() {
        // Update all text displays
        this.ekoText.setText(`Eko: ${this.eko}`);
        this.speedText.setText(`Speed: ${this.upgrades.speed} (${this.upgrades.speed * 100} Eko)`);
        this.controlText.setText(`Control: ${this.upgrades.control} (${this.upgrades.control * 100} Eko)`);
        this.armorText.setText(`Armor: ${this.upgrades.armor} (${this.upgrades.armor * 100} Eko)`);

        // Update text colors based on affordability
        this.speedText.setColor(this.eko >= this.upgrades.speed * 100 ? '#ffffff' : '#ff0000');
        this.controlText.setColor(this.eko >= this.upgrades.control * 100 ? '#ffffff' : '#ff0000');
        this.armorText.setColor(this.eko >= this.upgrades.armor * 100 ? '#ffffff' : '#ff0000');
    }

    upgradeSpeed() {
        const cost = this.upgrades.speed * 100;
        if (this.eko >= cost) {
            this.eko -= cost;
            this.upgrades.speed++;
            this.saveUpgrades();
            this.updateDisplay();
        }
    }

    upgradeControl() {
        const cost = this.upgrades.control * 100;
        if (this.eko >= cost) {
            this.eko -= cost;
            this.upgrades.control++;
            this.saveUpgrades();
            this.updateDisplay();
        }
    }

    upgradeArmor() {
        const cost = this.upgrades.armor * 100;
        if (this.eko >= cost) {
            this.eko -= cost;
            this.upgrades.armor++;
            this.saveUpgrades();
            this.updateDisplay();
        }
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
        this.title.setPosition(centerX, gameSize.height * 0.1);
        this.title.setFontSize(gameSize.width * 0.06 > 80 ? '80px' : `${gameSize.width * 0.06}px`);

        this.ekoText.setPosition(centerX, gameSize.height * 0.2);
        this.ekoText.setFontSize(gameSize.width * 0.02 > 24 ? '24px' : `${gameSize.width * 0.02}px`);

        // Update button positions and sizes
        const buttonWidth = gameSize.width * 0.25;
        const buttonHeight = gameSize.height * 0.1;
        const buttonY = gameSize.height * 0.4;

        // Speed button
        this.speedButton.setPosition(centerX, buttonY);
        this.speedButton.setSize(buttonWidth, buttonHeight);
        this.speedText.setPosition(centerX, buttonY);
        this.speedText.setFontSize(gameSize.width * 0.03 > 30 ? '30px' : `${gameSize.width * 0.03}px`);
        this.drawRoundedButton(this.speedButtonBg, centerX, buttonY, buttonWidth, buttonHeight, cornerRadius);

        // Control button
        this.controlButton.setPosition(centerX, buttonY + buttonHeight + 20);
        this.controlButton.setSize(buttonWidth, buttonHeight);
        this.controlText.setPosition(centerX, buttonY + buttonHeight + 20);
        this.controlText.setFontSize(gameSize.width * 0.03 > 30 ? '30px' : `${gameSize.width * 0.03}px`);
        this.drawRoundedButton(this.controlButtonBg, centerX, buttonY + buttonHeight + 20, buttonWidth, buttonHeight, cornerRadius);

        // Armor button
        this.armorButton.setPosition(centerX, buttonY + (buttonHeight + 20) * 2);
        this.armorButton.setSize(buttonWidth, buttonHeight);
        this.armorText.setPosition(centerX, buttonY + (buttonHeight + 20) * 2);
        this.armorText.setFontSize(gameSize.width * 0.03 > 30 ? '30px' : `${gameSize.width * 0.03}px`);
        this.drawRoundedButton(this.armorButtonBg, centerX, buttonY + (buttonHeight + 20) * 2, buttonWidth, buttonHeight, cornerRadius);

        // Back button
        const backButtonY = gameSize.height * 0.9;
        this.backButton.setPosition(centerX, backButtonY);
        this.backButton.setSize(buttonWidth, buttonHeight);
        this.backText.setPosition(centerX, backButtonY);
        this.backText.setFontSize(gameSize.width * 0.03 > 30 ? '30px' : `${gameSize.width * 0.03}px`);
        this.drawRoundedButton(this.backButtonBg, centerX, backButtonY, buttonWidth, buttonHeight, cornerRadius);
    }

    update() {
        // Update custom cursor
        this.customCursor.update();

        // Scroll the starfield background
        this.starfield.tilePositionX += 2;
    }
} 