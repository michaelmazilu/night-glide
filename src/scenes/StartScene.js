export class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        // Load assets
        this.load.image('starfield', 'assets/starfield.png');
        this.load.image('spaceship', 'assets/spaceship.png');
    }

    create() {
        // Add scrolling starfield background
        this.starfield = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'starfield');
        this.starfield.setOrigin(0, 0);

        // Add title
        const title = this.add.text(this.game.config.width / 2, this.game.config.height / 3, 'NIGHT GLIDE', {
            fontFamily: 'Major Mono Display',
            fontSize: '64px',
            color: '#ffffff'
        });
        title.setOrigin(0.5);

        // Add start button
        const startButton = this.add.text(this.game.config.width / 2, this.game.config.height / 2, 'START GAME', {
            fontFamily: 'Major Mono Display',
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#333333',
            padding: {
                x: 20,
                y: 10
            }
        });
        startButton.setOrigin(0.5);
        startButton.setInteractive();

        // Button hover effect
        startButton.on('pointerover', () => {
            startButton.setStyle({ backgroundColor: '#444444' });
        });
        startButton.on('pointerout', () => {
            startButton.setStyle({ backgroundColor: '#333333' });
        });

        // Start game on click
        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // Add instructions
        const instructions = this.add.text(this.game.config.width / 2, this.game.config.height * 0.7, 
            'Use ↑ and ↓ arrows to navigate\nAvoid obstacles and survive as long as possible!', {
            fontFamily: 'Major Mono Display',
            fontSize: '16px',
            color: '#ffffff',
            align: 'center'
        });
        instructions.setOrigin(0.5);
    }

    update() {
        // Scroll the starfield background
        this.starfield.tilePositionX += 2;
    }
} 