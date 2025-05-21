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

        // Create Start button with Poppins and rounded corners
        const buttonWidth = this.cameras.main.width * 0.25;
        const buttonHeight = this.cameras.main.height * 0.1;
        const cornerRadius = buttonHeight * 0.3;
        const buttonY = this.cameras.main.height * 0.5;
        
        // Start button
        this.startButtonBg = this.add.graphics();
        this.drawRoundedButton(this.startButtonBg, this.cameras.main.width / 2, buttonY, buttonWidth, buttonHeight, cornerRadius);
        
        // Create a container for the start button
        this.startButtonContainer = this.add.container(this.cameras.main.width / 2, buttonY);
        this.startButtonContainer.setSize(buttonWidth, buttonHeight);
        this.startButtonContainer.setInteractive(new Phaser.Geom.Rectangle(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);
        
        this.startText = this.add.text(0, 0, 'Start', {
            fontFamily: 'Poppins',
            fontSize: this.cameras.main.width * 0.03 > 30 ? '30px' : `${this.cameras.main.width * 0.03}px`,
            color: '#ffffff'
        }).setOrigin(0.5);
        this.startButtonContainer.add(this.startText);

        // Armory button
        this.armoryButtonBg = this.add.graphics();
        this.drawRoundedButton(this.armoryButtonBg, this.cameras.main.width / 2, buttonY + buttonHeight + 20, buttonWidth, buttonHeight, cornerRadius);
        
        // Create a container for the armory button
        this.armoryButtonContainer = this.add.container(this.cameras.main.width / 2, buttonY + buttonHeight + 20);
        this.armoryButtonContainer.setSize(buttonWidth, buttonHeight);
        this.armoryButtonContainer.setInteractive(new Phaser.Geom.Rectangle(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);
        
        this.armoryText = this.add.text(0, 0, 'Armory', {
            fontFamily: 'Poppins',
            fontSize: this.cameras.main.width * 0.03 > 30 ? '30px' : `${this.cameras.main.width * 0.03}px`,
            color: '#ffffff'
        }).setOrigin(0.5);
        this.armoryButtonContainer.add(this.armoryText);

        // Add hover effects and click handlers
        this.startButtonContainer.on('pointerover', () => {
            this.startButtonBg.clear();
            this.drawRoundedButton(this.startButtonBg, this.cameras.main.width / 2, buttonY, buttonWidth, buttonHeight, cornerRadius, true);
        });

        this.startButtonContainer.on('pointerout', () => {
            this.startButtonBg.clear();
            this.drawRoundedButton(this.startButtonBg, this.cameras.main.width / 2, buttonY, buttonWidth, buttonHeight, cornerRadius, false);
        });

        this.armoryButtonContainer.on('pointerover', () => {
            this.armoryButtonBg.clear();
            this.drawRoundedButton(this.armoryButtonBg, this.cameras.main.width / 2, buttonY + buttonHeight + 20, buttonWidth, buttonHeight, cornerRadius, true);
        });

        this.armoryButtonContainer.on('pointerout', () => {
            this.armoryButtonBg.clear();
            this.drawRoundedButton(this.armoryButtonBg, this.cameras.main.width / 2, buttonY + buttonHeight + 20, buttonWidth, buttonHeight, cornerRadius, false);
        });

        // Add click handlers
        this.startButtonContainer.on('pointerdown', () => {
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('GameScene');
            });
        });

        this.armoryButtonContainer.on('pointerdown', () => {
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('ArmoryScene');
            });
        });

        // Add instructions with Poppins font
        this.instructions = this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.75, 
            'WS to move T to Echo Stasis\nAvoid obstacles and survive as long as possible!', {
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
        this.backgroundMusic = this.sound.add('backgroundMusic', {
            volume: 0.2,
            loop: true
        });

        this.backgroundMusic.play();

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

        // Reposition text and buttons
        const centerX = gameSize.width / 2;

        this.title.setPosition(centerX, gameSize.height * 0.2);
        this.title.setFontSize(gameSize.width * 0.06 > 80 ? '80px' : `${gameSize.width * 0.06}px`);

        this.subtitle.setPosition(centerX, gameSize.height * 0.3);
        this.subtitle.setFontSize(gameSize.width * 0.02 > 24 ? '24px' : `${gameSize.width * 0.02}px`);

        const buttonWidth = gameSize.width * 0.25;
        const buttonHeight = gameSize.height * 0.1;
        const cornerRadius = buttonHeight * 0.3;
        const buttonY = gameSize.height * 0.5;

        // Update start button
        this.startButtonContainer.setPosition(centerX, buttonY);
        this.startButtonContainer.setSize(buttonWidth, buttonHeight);
        this.startButtonContainer.setInteractive(new Phaser.Geom.Rectangle(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);
        this.startText.setFontSize(gameSize.width * 0.03 > 30 ? '30px' : `${gameSize.width * 0.03}px`);
        this.drawRoundedButton(this.startButtonBg, centerX, buttonY, buttonWidth, buttonHeight, cornerRadius);

        // Update armory button
        this.armoryButtonContainer.setPosition(centerX, buttonY + buttonHeight + 20);
        this.armoryButtonContainer.setSize(buttonWidth, buttonHeight);
        this.armoryButtonContainer.setInteractive(new Phaser.Geom.Rectangle(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);
        this.armoryText.setFontSize(gameSize.width * 0.03 > 30 ? '30px' : `${gameSize.width * 0.03}px`);
        this.drawRoundedButton(this.armoryButtonBg, centerX, buttonY + buttonHeight + 20, buttonWidth, buttonHeight, cornerRadius);

        this.instructions.setPosition(centerX, gameSize.height * 0.75);
        this.instructions.setFontSize(gameSize.width * 0.015 > 18 ? '18px' : `${gameSize.width * 0.015}px`);

        // Reposition logo
        this.logo.setPosition(gameSize.width - 20, 20);
        this.logo.setScale(gameSize.width * 0.0001);
    }

    update() {
        // Scroll the starfield background
        this.starfield.tilePositionX += 2;
    }
} 