export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
        this.gameSpeed = 5;
    }

    preload() {
        // Assets are already loaded in StartScene
    }

    create() {
        // Add scrolling starfield background
        this.starfield = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'starfield');
        this.starfield.setOrigin(0, 0);

        // Create player
        this.player = this.physics.add.sprite(100, this.game.config.height / 2, 'spaceship');
        this.player.setCollideWorldBounds(true);

        // Create obstacle group
        this.obstacles = this.physics.add.group();

        // Create score text
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontFamily: 'Major Mono Display',
            fontSize: '24px',
            color: '#ffffff'
        });

        // Set up collision detection
        this.physics.add.collider(this.player, this.obstacles, this.gameOver, null, this);

        // Set up obstacle spawning
        this.time.addEvent({
            delay: 2000,
            callback: this.spawnObstacle,
            callbackScope: this,
            loop: true
        });

        // Set up score timer
        this.time.addEvent({
            delay: 1000,
            callback: this.updateScore,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        // Scroll the starfield background
        this.starfield.tilePositionX += 2;

        // Handle player movement
        const cursors = this.input.keyboard.createCursorKeys();
        if (cursors.up.isDown) {
            this.player.setVelocityY(-300);
        } else if (cursors.down.isDown) {
            this.player.setVelocityY(300);
        } else {
            this.player.setVelocityY(0);
        }

        // Move obstacles
        this.obstacles.getChildren().forEach(obstacle => {
            obstacle.x -= this.gameSpeed;
            if (obstacle.x < -obstacle.width) {
                obstacle.destroy();
            }
        });
    }

    spawnObstacle() {
        const height = Phaser.Math.Between(100, 300);
        const y = Phaser.Math.Between(0, this.game.config.height - height);

        const obstacle = this.obstacles.create(
            this.game.config.width,
            y,
            'spaceship' // Temporary using spaceship as obstacle
        );
        obstacle.setTint(0xff0000);
        obstacle.setScale(0.5);
        obstacle.body.setSize(obstacle.width * 0.5, height);
    }

    updateScore() {
        this.score += 1;
        this.scoreText.setText('Score: ' + this.score);
        
        // Increase game speed every 10 points
        if (this.score % 10 === 0) {
            this.gameSpeed += 0.5;
        }
    }

    gameOver() {
        this.scene.start('StartScene');
    }
} 