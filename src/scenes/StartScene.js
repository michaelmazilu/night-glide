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
    }

    create() {
        // Add scrolling starfield background
        this.starfield = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'starfield');
        this.starfield.setOrigin(0, 0);
        this.starfield.setScale(Math.max(this.cameras.main.width / this.starfield.width, this.cameras.main.height / this.starfield.height));

        // Add title with glow effect
        const title = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 3, 'NIGHT GLIDE', {
            fontFamily: 'Major Mono Display',
            fontSize: '64px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        });
        title.setOrigin(0.5);
        
        // Add title glow animation
        this.tweens.add({
            targets: title,
            alpha: 0.7,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Create start button container
        const startButton = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);

        // Create button background with gradient
        const buttonBg = this.add.rectangle(0, 0, 200, 60, 0x000000, 0.7);
        buttonBg.setStrokeStyle(2, 0xffffff, 0.5);
        startButton.add(buttonBg);

        // Create button text
        const buttonText = this.add.text(0, 0, 'START GAME', {
            fontFamily: 'Major Mono Display',
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        startButton.add(buttonText);

        // Add hover effect
        buttonBg.setInteractive();
        buttonBg.on('pointerover', () => {
            this.tweens.add({
                targets: [buttonBg, buttonText],
                scale: 1.1,
                duration: 100,
                ease: 'Power2'
            });
            buttonBg.setStrokeStyle(2, 0xff0000, 0.8);
        });
        buttonBg.on('pointerout', () => {
            this.tweens.add({
                targets: [buttonBg, buttonText],
                scale: 1,
                duration: 100,
                ease: 'Power2'
            });
            buttonBg.setStrokeStyle(2, 0xffffff, 0.5);
        });

        // Start game on click with animation
        buttonBg.on('pointerdown', () => {
            this.tweens.add({
                targets: [buttonBg, buttonText],
                scale: 0.9,
                duration: 50,
                yoyo: true,
                onComplete: () => {
                    this.scene.start('GameScene');
                }
            });
        });

        // Add instructions with improved styling
        const instructions = this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.7, 
            'WASD to move\nAvoid obstacles and survive as long as possible!', {
            fontFamily: 'Major Mono Display',
            fontSize: '16px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center'
        });
        instructions.setOrigin(0.5);

        // Add background music with delay and lower volume
        this.backgroundMusic = this.sound.add('backgroundMusic', {
            volume: 0.2,
            loop: true
        });

        // Delay music start by 10 seconds
        // this.time.delayedCall(10000, () => {
        this.backgroundMusic.play(); // Play music immediately
        // });

        // Handle resize
        this.scale.on('resize', this.resize, this);
    }

    resize(gameSize) {
        // Update camera and background on resize
        this.cameras.main.setSize(gameSize.width, gameSize.height);
        this.starfield.setSize(gameSize.width, gameSize.height);
        this.starfield.setScale(Math.max(gameSize.width / this.starfield.width, gameSize.height / this.starfield.height));
    }

    update() {
        // Scroll the starfield background
        this.starfield.tilePositionX += 2;
    }
} 