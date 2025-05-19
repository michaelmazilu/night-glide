export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
        this.gameSpeed = 5;
        this.windDirection = 0;
        this.windStrength = 2;
        this.windChangeTimer = 0;
        this.spawnDelay = 1000;
        this.minSpawnDelay = 200;
        this.uiElements = new Map();
        this.trailPoints = [];
        this.maxTrailLength = 20;
        this.scoreAccumulator = 0;
    }

    preload() {
        // Assets are already loaded in StartScene
    }

    create() {
        this.score = 0;

        // Add scrolling starfield background with parallax effect
        this.starfield = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'starfield');
        this.starfield.setOrigin(0, 0);
        this.starfield.setScale(Math.max(this.cameras.main.width / this.starfield.width, this.cameras.main.height / this.starfield.height));

        // Create player with smooth movement
        this.player = this.physics.add.sprite(100, this.cameras.main.height / 2, 'spaceship');
        this.player.setCollideWorldBounds(true);
        this.player.setScale(0.1);
        this.player.setOrigin(0.5, 0.5);
        this.player.setAlpha(0);
        this.tweens.add({
            targets: this.player,
            alpha: 1,
            duration: 1000,
            ease: 'Power2'
        });

        // Set up more accurate hitbox for player
        this.player.body.setSize(this.player.width * 0.7, this.player.height * 0.7);
        this.player.body.setOffset(this.player.width * 0.15, this.player.height * 0.15);

        // Create trail graphics
        this.trailGraphics = this.add.graphics();
        this.trailGraphics.setDepth(-1);

        // Create asteroid group
        this.asteroids = this.physics.add.group();

        // Create UI container for better organization
        this.uiContainer = this.add.container(0, 0);

        // Create score panel with modern design
        const scorePanel = this.add.rectangle(120, 40, 200, 60, 0x000000, 0.5);
        scorePanel.setOrigin(0.5);
        scorePanel.setStrokeStyle(2, 0xffffff, 0.5);
        this.uiContainer.add(scorePanel);

        // Create score text with improved styling
        this.scoreText = this.add.text(120, 40, 'SCORE: 0', {
            fontFamily: 'Major Mono Display',
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        this.uiContainer.add(this.scoreText);

        // Create compass with improved design
        this.createCompass();

        // Create music control button
        this.createMusicControls();

        // Set up collision detection
        this.physics.add.collider(this.player, this.asteroids, this.gameOver, null, this);

        // Set up asteroid spawning
        this.spawnTimer = this.time.addEvent({
            delay: this.spawnDelay,
            callback: this.spawnAsteroid,
            callbackScope: this,
            loop: true
        });

        // Set up score timer to update score by 1 per millisecond
        this.time.addEvent({
            delay: 1,
            callback: () => {
                this.score += 1;
                this.scoreText.setText('SCORE: ' + this.score);
            },
            callbackScope: this,
            loop: true
        });

        // Handle resize
        this.scale.on('resize', this.resize, this);
    }

    createCompass() {
        // Create compass container with improved positioning
        this.compass = this.add.container(this.cameras.main.width - 80, 50);

        // Create compass background with gradient effect
        const compassBg = this.add.circle(0, 0, 35, 0x000000, 0.7);
        compassBg.setStrokeStyle(2, 0xffffff, 0.5);
        this.compass.add(compassBg);

        // Create compass needle with improved visibility
        this.compassNeedle = this.add.line(0, 0, 0, -30, 0, 30, 0xffffff, 1.5);
        this.compass.add(this.compassNeedle);

        // Create compass label with improved styling
        const compassLabel = this.add.text(0, 45, 'WIND', {
            fontFamily: 'Major Mono Display',
            fontSize: '16px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        this.compass.add(compassLabel);

        // Add compass to UI container
        this.uiContainer.add(this.compass);
    }

    createMusicControls() {
        // Create music control button
        const musicButton = this.add.container(this.cameras.main.width - 40, 40);
        
        // Create button background
        const buttonBg = this.add.circle(0, 0, 20, 0x000000, 0.7);
        buttonBg.setStrokeStyle(2, 0xffffff, 0.5);
        musicButton.add(buttonBg);

        // Create music icon
        this.musicIcon = this.add.text(0, 0, '♪', {
            fontFamily: 'Major Mono Display',
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);
        musicButton.add(this.musicIcon);

        // Make button interactive
        buttonBg.setInteractive();
        buttonBg.on('pointerdown', () => {
            if (this.sound.mute) {
                this.sound.mute = false;
                this.musicIcon.setColor('#ffffff');
            } else {
                this.sound.mute = true;
                this.musicIcon.setColor('#666666');
            }
        });

        this.uiContainer.add(musicButton);
    }

    resize(gameSize) {
        this.cameras.main.setSize(gameSize.width, gameSize.height);
        this.starfield.setSize(gameSize.width, gameSize.height);
        this.starfield.setScale(Math.max(gameSize.width / this.starfield.width, gameSize.height / this.starfield.height));
        
        // Update compass position
        if (this.compass) {
            this.compass.setPosition(gameSize.width - 80, 50);
        }
    }

    updateWind() {
        // Gradually change wind direction with smoother transitions
        this.windChangeTimer += 0.005;
        this.windDirection = Math.sin(this.windChangeTimer) * Math.PI / 4;

        // Update compass needle rotation with smooth interpolation
        if (this.compassNeedle) {
            this.tweens.add({
                targets: this.compassNeedle,
                rotation: this.windDirection,
                duration: 100,
                ease: 'Power1'
            });
        }
    }

    updateTrail() {
        // Add current position to trail points
        this.trailPoints.unshift({
            x: this.player.x,
            y: this.player.y
        });

        // Keep trail at maximum length
        if (this.trailPoints.length > this.maxTrailLength) {
            this.trailPoints.pop();
        }

        // Draw trail
        this.trailGraphics.clear();
        this.trailGraphics.lineStyle(2, 0xffffff, 0.5);
        this.trailGraphics.beginPath();

        // Draw line through all points
        for (let i = 0; i < this.trailPoints.length; i++) {
            const point = this.trailPoints[i];
            if (i === 0) {
                this.trailGraphics.moveTo(point.x, point.y);
            } else {
                this.trailGraphics.lineTo(point.x, point.y);
            }
        }

        this.trailGraphics.strokePath();
    }

    update() {
        // Scroll the starfield background with parallax effect
        this.starfield.tilePositionX += 2;

        // Update wind direction
        this.updateWind();

        // Handle player movement with WASD controls (re-enabled left movement)
        const cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A, // Re-enabled left movement
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Calculate movement velocity
        let velocityX = 0;
        let velocityY = 0;
        const moveSpeed = 300;

        if (cursors.up.isDown) velocityY -= moveSpeed;
        if (cursors.down.isDown) velocityY += moveSpeed;
        if (cursors.left.isDown) velocityX -= moveSpeed; // Apply left movement
        if (cursors.right.isDown) velocityX += moveSpeed;

        // Normalize diagonal movement
        if (velocityX !== 0 && velocityY !== 0) {
            const factor = 1 / Math.sqrt(2);
            velocityX *= factor;
            velocityY *= factor;
        }

        // Apply smooth movement
        this.player.setVelocityX(Phaser.Math.Linear(this.player.body.velocity.x, velocityX, 0.1));
        this.player.setVelocityY(Phaser.Math.Linear(this.player.body.velocity.y, velocityY, 0.1));

        // Update trail
        this.updateTrail();

        // Rotate player based on movement direction (allow 360 rotation and increased speed)
        if (velocityX !== 0 || velocityY !== 0) {
            const targetAngle = Math.atan2(velocityY, velocityX);
            // Increase rotation speed by increasing the smoothing factor
            this.player.rotation = Phaser.Math.Linear(this.player.rotation, targetAngle, 0.3); // Increased smoothing for faster rotation
        }

        // Move asteroids with wind effect
        this.asteroids.getChildren().forEach(asteroid => {
            const windX = Math.cos(this.windDirection) * this.windStrength;
            const windY = Math.sin(this.windDirection) * this.windStrength;

            asteroid.x -= this.gameSpeed;
            asteroid.y += windY;
            asteroid.rotation += 0.02;

            // Remove if off screen (increased buffer)
            if (asteroid.x < -asteroid.width * 2) {
                asteroid.destroy();
            }
        });
    }

    spawnAsteroid() {
        const size = Phaser.Math.Between(50, 80);
        const y = Phaser.Math.Between(size, this.cameras.main.height - size);

        const asteroid = this.asteroids.create(
            this.cameras.main.width + size,
            y,
            'asteroid'
        );
        
        asteroid.setScale(size / asteroid.width);
        asteroid.setRotation(Phaser.Math.FloatBetween(0, Math.PI * 2));
        asteroid.setAlpha(0);
        
        // Fade in animation for new asteroids
        this.tweens.add({
            targets: asteroid,
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });
        
        // Set up more accurate hitbox for asteroid
        const hitboxSize = size * 0.8;
        asteroid.body.setCircle(hitboxSize / 2);
        asteroid.body.setOffset((asteroid.width - hitboxSize) / 2, (asteroid.height - hitboxSize) / 2);
        asteroid.body.setCollideWorldBounds(true);
    }

    gameOver() {
        // Stop the game and go to GameOverScene, passing the score
        this.scene.start('GameOverScene', { score: this.score });
    }
} 