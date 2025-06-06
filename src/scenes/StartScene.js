import { CustomCursor } from '../cursor';

export class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
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
        this.title = this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.2, 'NiGht Glide', {
            fontFamily: 'Major Mono Display',
            fontSize: this.cameras.main.width * 0.06 > 80 ? '80px' : `${this.cameras.main.width * 0.06}px`,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            shadow: { offsetX: 5, offsetY: 5, color: '#000000', blur: 10, fill: true, stroke: true }
        }).setOrigin(0.5);

        // Add subtitle with Poppins
        this.subtitle = this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.3, 'Navigate through the stars', {
            fontFamily: 'Poppins',
            fontSize: this.cameras.main.width * 0.02 > 24 ? '24px' : `${this.cameras.main.width * 0.02}px`,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Define button dimensions and spacing
        const buttonWidth = this.cameras.main.width * 0.125; // Half the previous width
        const buttonHeight = this.cameras.main.height * 0.05; // Half the previous height
        const verticalSpacing = this.cameras.main.height * 0.03;
        const cornerRadius = buttonHeight * 0.3;
        const startButtonY = this.cameras.main.height * 0.5;
        
        // Start button
        this.startButtonBg = this.add.graphics();
        this.drawRoundedButton(this.startButtonBg, this.cameras.main.width / 2, startButtonY, buttonWidth, buttonHeight, cornerRadius);

        // Create start button with proper hitbox
        this.startButton = this.add.zone(this.cameras.main.width / 2, startButtonY, buttonWidth, buttonHeight);
        this.startButton.setInteractive();

        this.startText = this.add.text(this.cameras.main.width / 2, startButtonY, 'Start', {
            fontFamily: 'Poppins',
            fontSize: this.cameras.main.width * 0.03 > 30 ? '30px' : `${this.cameras.main.width * 0.03}px`,
            color: '#ffffff'
        }).setOrigin(0.5);

        // Armory button
        const armoryButtonY = startButtonY + buttonHeight + verticalSpacing;
        this.armoryButtonBg = this.add.graphics();
        this.drawRoundedButton(this.armoryButtonBg, this.cameras.main.width / 2, armoryButtonY, buttonWidth, buttonHeight, cornerRadius);

        // Create armory button zone
        this.armoryButton = this.add.zone(this.cameras.main.width / 2, armoryButtonY, buttonWidth, buttonHeight);
        this.armoryButton.setInteractive();

        const armoryText = this.add.text(this.cameras.main.width / 2, armoryButtonY, 'Armory', {
            fontFamily: 'Poppins',
            fontSize: this.cameras.main.width * 0.03 > 30 ? '30px' : `${this.cameras.main.width * 0.03}px`,
            color: '#ffffff'
        }).setOrigin(0.5);

        // Echo button
        const echoButtonY = armoryButtonY + buttonHeight + verticalSpacing;
        this.echoButtonBg = this.add.graphics();
        this.drawRoundedButton(this.echoButtonBg, this.cameras.main.width / 2, echoButtonY, buttonWidth, buttonHeight, cornerRadius);

        // Create echo button zone
        this.echoButton = this.add.zone(this.cameras.main.width / 2, echoButtonY, buttonWidth, buttonHeight);
        this.echoButton.setInteractive();

        const echoText = this.add.text(this.cameras.main.width / 2, echoButtonY, 'Echo Chamber', {
            fontFamily: 'Poppins',
            fontSize: this.cameras.main.width * 0.03 > 30 ? '30px' : `${this.cameras.main.width * 0.03}px`,
            color: '#ffffff'
        }).setOrigin(0.5);

        // Add hover effects and click handlers for start button
        this.startButton.on('pointerover', () => {
            this.startButtonBg.clear();
            this.drawRoundedButton(this.startButtonBg, this.cameras.main.width / 2, startButtonY, buttonWidth, buttonHeight, cornerRadius, true);
        });

        this.startButton.on('pointerout', () => {
            this.startButtonBg.clear();
            this.drawRoundedButton(this.startButtonBg, this.cameras.main.width / 2, startButtonY, buttonWidth, buttonHeight, cornerRadius, false);
        });

        this.startButton.on('pointerdown', () => {
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('GameScene');
            });
        });

        // Add hover effects and click handlers for armory button
        this.armoryButton.on('pointerover', () => {
            this.armoryButtonBg.clear();
            this.drawRoundedButton(this.armoryButtonBg, this.cameras.main.width / 2, armoryButtonY, buttonWidth, buttonHeight, cornerRadius, true);
        });

        this.armoryButton.on('pointerout', () => {
            this.armoryButtonBg.clear();
            this.drawRoundedButton(this.armoryButtonBg, this.cameras.main.width / 2, armoryButtonY, buttonWidth, buttonHeight, cornerRadius, false);
        });

        this.armoryButton.on('pointerdown', () => {
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('ArmoryScene');
            });
        });

        // Add hover effects and click handlers for echo button
        this.echoButton.on('pointerover', () => {
            this.echoButtonBg.clear();
            this.drawRoundedButton(this.echoButtonBg, this.cameras.main.width / 2, echoButtonY, buttonWidth, buttonHeight, cornerRadius, true);
        });

        this.echoButton.on('pointerout', () => {
            this.echoButtonBg.clear();
            this.drawRoundedButton(this.echoButtonBg, this.cameras.main.width / 2, echoButtonY, buttonWidth, buttonHeight, cornerRadius, false);
        });

        this.echoButton.on('pointerdown', () => {
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('EchoScene');
            });
        });

        // Add instructions with Poppins font
        this.instructions = this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.75, 
            'WS to move T to use Echo \nAvoid obstacles and survive as long as possible!', {
            fontFamily: 'Poppins',
            fontSize: this.cameras.main.width * 0.015 > 18 ? '18px' : `${this.cameras.main.width * 0.015}px`,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2,
            align: 'center'
        });
        this.instructions.setOrigin(0.5);

        // Add logo to the top right
        this.logo = this.add.image(this.cameras.main.width - 20, 20, 'logo');
        this.logo.setOrigin(1, 0);
        this.logo.setScale(this.cameras.main.width * 0.0001);

        // Add background music with delay and lower volume
        this.musicEnabled = localStorage.getItem('musicEnabled') === 'true';
        this.backgroundMusic = this.sound.add('backgroundMusic', {
            volume: 0.2,
            loop: true
        });
        if (this.musicEnabled) {
            this.backgroundMusic.play();
        }

        // Add music toggle button
        this.musicToggleButton = this.add.text(30, 30, this.musicEnabled ? '🔊' : '🔇', {
            fontFamily: 'Poppins',
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#222',
            padding: { left: 10, right: 10, top: 5, bottom: 5 },
            borderRadius: 8
        }).setInteractive();
        this.musicToggleButton.on('pointerdown', () => {
            this.musicEnabled = !this.musicEnabled;
            localStorage.setItem('musicEnabled', this.musicEnabled);
            this.musicToggleButton.setText(this.musicEnabled ? '🔊' : '🔇');
            if (this.musicEnabled) {
                this.backgroundMusic.play();
            } else {
                this.backgroundMusic.stop();
            }
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
        this.starfield.setScale(Math.max(gameSize.width / this.starfield.width, this.starfield.height));

        // Update overlay size
        this.children.each(child => {
            if (child.type === 'Rectangle' && child.width === this.cameras.main.width && child.height === this.cameras.main.height) {
                child.setSize(gameSize.width, gameSize.height);
            }
        });

        // Reposition text and buttons
        const centerX = gameSize.width / 2;

        this.title.setPosition(centerX, gameSize.height * 0.2);
        this.title.setFontSize(gameSize.width * 0.06 > 80 ? '80px' : `${gameSize.width * 0.06}px`);

        this.subtitle.setPosition(centerX, gameSize.height * 0.3);
        this.subtitle.setFontSize(gameSize.width * 0.02 > 24 ? '24px' : `${gameSize.width * 0.02}px`);

        // Define button dimensions and spacing based on new game size
        const buttonWidth = gameSize.width * 0.125; // Half the previous width
        const buttonHeight = gameSize.height * 0.05; // Half the previous height
        const verticalSpacing = gameSize.height * 0.03;
        const cornerRadius = buttonHeight * 0.3;
        const startButtonY = gameSize.height * 0.5;

        // Update start button
        this.startButton.setPosition(centerX, startButtonY);
        this.startButton.setSize(buttonWidth, buttonHeight);
        this.startText.setPosition(centerX, startButtonY);
        this.startText.setFontSize(gameSize.width * 0.03 > 30 ? '30px' : `${gameSize.width * 0.03}px`);
        this.drawRoundedButton(this.startButtonBg, centerX, startButtonY, buttonWidth, buttonHeight, cornerRadius);

        // Update armory button
        const armoryButtonY = startButtonY + buttonHeight + verticalSpacing;
        this.armoryButton.setPosition(centerX, armoryButtonY);
        this.armoryButton.setSize(buttonWidth, buttonHeight);
        // armoryText position is handled implicitly if it was added as a child of the button or container.
        // Assuming text is separate and needs repositioning:
        // this.armoryText.setPosition(centerX, armoryButtonY); 
        // this.armoryText.setFontSize(gameSize.width * 0.03 > 30 ? '30px' : `${gameSize.width * 0.03}px`); // Re-evaluate font size
        this.drawRoundedButton(this.armoryButtonBg, centerX, armoryButtonY, buttonWidth, buttonHeight, cornerRadius);

        // Update echo button
        const echoButtonY = armoryButtonY + buttonHeight + verticalSpacing;
        this.echoButton.setPosition(centerX, echoButtonY);
        this.echoButton.setSize(buttonWidth, buttonHeight);
        // echoText position is handled implicitly or needs repositioning:
        // this.echoText.setPosition(centerX, echoButtonY);
        // this.echoText.setFontSize(gameSize.width * 0.03 > 30 ? '30px' : `${gameSize.width * 0.03}px`); // Re-evaluate font size
        this.drawRoundedButton(this.echoButtonBg, centerX, echoButtonY, buttonWidth, buttonHeight, cornerRadius);

        this.instructions.setPosition(centerX, echoButtonY + buttonHeight + verticalSpacing);
        this.instructions.setFontSize(gameSize.width * 0.015 > 18 ? '18px' : `${gameSize.width * 0.015}px`);

        // Reposition logo
        this.logo.setPosition(gameSize.width - 20, 20);
        this.logo.setScale(gameSize.width * 0.0001);
    }

    update() {
        // Scroll the starfield background
        this.starfield.tilePositionX += 2;

        // Update custom cursor
        this.customCursor.update();
    }
} 