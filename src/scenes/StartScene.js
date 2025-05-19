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
        this.title = this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.25, 'NIGHT GLIDE', {
            fontFamily: 'Major Mono Display',
            fontSize: '80px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            shadow: { offsetX: 5, offsetY: 5, color: '#000000', blur: 10, fill: true, stroke: true }
        }).setOrigin(0.5);

        // Add subtitle with Poppins
        this.subtitle = this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.35, 'Navigate through the stars', {
            fontFamily: 'Poppins',
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Create Start button with Poppins and rounded corners
        this.startButtonBg = this.add.graphics();
        const buttonWidth = this.cameras.main.width * 0.2;
        const buttonHeight = this.cameras.main.height * 0.08;
        const cornerRadius = buttonHeight * 0.2;
        this.drawRoundedButton(this.startButtonBg, this.cameras.main.width / 2, this.cameras.main.height * 0.55, buttonWidth, buttonHeight, cornerRadius);

        this.startButtonBg.setInteractive(new Phaser.Geom.Rectangle(this.cameras.main.width / 2 - buttonWidth / 2, this.cameras.main.height * 0.55 - buttonHeight / 2, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);

        this.startText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.55, 'Start', {
            fontFamily: 'Poppins',
            fontSize: '30px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Add click handler
        this.startButtonBg.on('pointerdown', () => {
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('GameScene');
            });
        });

        // Add instructions with Poppins font
        this.instructions = this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.65, 
            'WASD to move\nAvoid obstacles and survive as long as possible!', {
            fontFamily: 'Poppins',
            fontSize: '18px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center'
        });
        this.instructions.setOrigin(0.5);

        // Add logo to the top right
        this.logo = this.add.image(this.cameras.main.width - 40, 40, 'logo');
        this.logo.setOrigin(1, 0);
        this.logo.setScale(0.1);

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

        // Reposition text and buttons
        const centerX = gameSize.width / 2;

        this.title.setPosition(centerX, gameSize.height * 0.25);
        this.subtitle.setPosition(centerX, gameSize.height * 0.35);

        const buttonWidth = gameSize.width * 0.2;
        const buttonHeight = gameSize.height * 0.08;
        const cornerRadius = buttonHeight * 0.2;
        this.drawRoundedButton(this.startButtonBg, centerX, gameSize.height * 0.55, buttonWidth, buttonHeight, cornerRadius);
        this.startButtonBg.setInteractive(new Phaser.Geom.Rectangle(centerX - buttonWidth / 2, gameSize.height * 0.55 - buttonHeight / 2, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);
        this.startText.setPosition(centerX, gameSize.height * 0.55);

        this.instructions.setPosition(centerX, gameSize.height * 0.65);

        // Reposition logo
        this.logo.setPosition(gameSize.width - 40, 40);
    }

    update() {
        // Scroll the starfield background
        this.starfield.tilePositionX += 2;
    }
} 