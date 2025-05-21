export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
        this.currentRunEko = 0;  // Eko earned in current run
        this.totalEko = 0;       // Total Eko across all runs
        this.initialGameSpeed = 2; // Start with a much lower speed
        this.initialTargetSpeed = 8; // Lower target speed after 10 seconds
        this.maxGameSpeed = 25; // Keep the same max speed
        this.gameSpeed = this.initialGameSpeed; // Current game speed
        this.accelerationDuration1 = 10000; // Duration of the first acceleration phase (10 seconds)
        this.speedAcceleration2 = 0.02; // Slower acceleration rate after the first phase
        this.maxSpeedTime = 180000; // Time to reach max speed (3 minutes)
        this.accelerationTimer = 0; // Timer for tracking acceleration duration
        this.windDirection = 0;
        this.windStrength = 3;
        this.windChangeTimer = 0;
        this.spawnDelay = 300;
        this.minSpawnDelay = 100;
        this.uiElements = new Map();
        this.trailPoints = [];
        this.maxTrailLength = 60;
        this.scoreAccumulator = 0;
        this.coinGroupTimer = 0;
        this.coinGroupInterval = 3000;
        
        // Time stop ability properties
        this.timeStopCooldown = 30000;
        this.timeStopDuration = 6000;
        this.timeStopActive = false;
        this.timeStopAvailable = true;
        this.timeStopEffect = null;
        this.normalGameSpeed = 10; // This might need adjustment based on the new speed curve
        this.slowGameSpeed = 6; // 40% slower relative to what?

        // Load upgrades
        this.loadUpgrades();
    }

    loadUpgrades() {
        // Load saved upgrades from localStorage
        const savedUpgrades = localStorage.getItem('shipUpgrades');
        if (savedUpgrades) {
            this.upgrades = JSON.parse(savedUpgrades);
        } else {
            this.upgrades = {
                speed: { level: 0 },
                control: { level: 0 },
                armor: { level: 0 }
            };
        }

        // Load saved total Eko
        const savedEko = localStorage.getItem('eko');
        if (savedEko) {
            this.totalEko = parseInt(savedEko);
        }
    }

    preload() {
        // Assets are already loaded in StartScene
    }

    create() {
        this.score = 0;
        this.currentRunEko = 0;  // Reset current run Eko
        this.gameSpeed = this.initialGameSpeed; // Reset speed on create
        this.accelerationTimer = 0; // Reset acceleration timer

        // Apply speed upgrade
        const speedMultiplier = 1 + (this.upgrades.speed.level * 0.2); // 20% increase per level
        this.initialGameSpeed *= speedMultiplier;
        this.initialTargetSpeed *= speedMultiplier;
        this.maxGameSpeed *= speedMultiplier;
        this.gameSpeed = this.initialGameSpeed;

        // Apply control upgrade
        const controlMultiplier = 1 + (this.upgrades.control.level * 0.15); // 15% increase per level
        this.verticalSpeed = 350 * controlMultiplier;

        // Apply armor upgrade
        this.hitPoints = 1 + this.upgrades.armor.level; // +1 hit point per level

        // Add scrolling starfield background
        this.starfield = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'starfield');
        this.starfield.setOrigin(0, 0);
        this.starfield.setScale(Math.max(this.cameras.main.width / this.starfield.width, this.cameras.main.height / this.starfield.height));

        // Create player
        this.player = this.physics.add.sprite(this.cameras.main.width * 0.2, this.cameras.main.height / 2, 'spaceship');
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

        // Set up player hitbox
        this.player.body.setSize(this.player.width * 0.7, this.player.height * 0.7);
        this.player.body.setOffset(this.player.width * 0.15, this.player.height * 0.15);

        // Create trail graphics
        if (this.trailGraphics) {
            this.trailGraphics.destroy();
        }
        this.trailGraphics = this.add.graphics();
        this.trailGraphics.setDepth(-1);

        // Create asteroid and coin groups
        this.asteroids = this.physics.add.group();
        this.coins = this.physics.add.group();

        // Create UI container
        this.uiContainer = this.add.container(0, 0);

        // Create score panel with rounded corners (responsive)
        this.scorePanel = this.add.graphics();
        this.uiContainer.add(this.scorePanel);
        const panelWidth = this.cameras.main.width * 0.15; // Responsive width
        const panelHeight = this.cameras.main.height * 0.06; // Responsive height
        const panelX = this.cameras.main.width * 0.05 + panelWidth / 2; // Responsive X position, increased left padding
        const panelY = this.cameras.main.height * 0.05 + panelHeight / 2; // Responsive Y position
        const cornerRadius = panelHeight * 0.2; // Responsive corner radius
        this.drawRoundedPanel(this.scorePanel, panelX, panelY, panelWidth, panelHeight, cornerRadius);

        // Create score text (responsive)
        this.scoreText = this.add.text(panelX, panelY, 'Score: 0', { // Position relative to panel
            fontFamily: 'Poppins',
            fontSize: `${Math.max(16, this.cameras.main.height * 0.03)}px`, // Responsive font size
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        this.uiContainer.add(this.scoreText);

        // Create Eko text (responsive)
        this.ekoText = this.add.text(this.cameras.main.width * 0.95 - panelWidth/2, panelY, 'Eko: 0', { // Responsive X position, relative Y to panel, increased right padding
            fontFamily: 'Major Mono Display',
            fontSize: `${Math.max(16, this.cameras.main.height * 0.03)}px`, // Responsive font size
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        this.uiContainer.add(this.ekoText);

        // Create time stop cooldown indicator (responsive)
        const indicatorSize = this.cameras.main.height * 0.04; // Responsive size
        this.timeStopIndicator = this.add.circle(this.cameras.main.width * 0.95 - indicatorSize/2 - 10, panelY, indicatorSize / 2, 0x000000, 0.7); // Responsive position, next to Eko
        this.timeStopIndicator.setStrokeStyle(2, 0xffffff, 0.5);
        this.uiContainer.add(this.timeStopIndicator);

        // Create time stop icon (responsive)
        this.timeStopIcon = this.add.text(this.timeStopIndicator.x, panelY, '⏱', { // Position relative to indicator
            fontFamily: 'Poppins',
            fontSize: `${Math.max(16, this.cameras.main.height * 0.03)}px`, // Responsive font size
            color: '#ffffff'
        }).setOrigin(0.5);
        this.uiContainer.add(this.timeStopIcon);

        // Set up collision detection
        this.physics.add.collider(this.player, this.asteroids, this.gameOver, null, this);
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);

        // Set up asteroid spawning
        this.spawnTimer = this.time.addEvent({
            delay: this.spawnDelay,
            callback: this.spawnAsteroid,
            callbackScope: this,
            loop: true
        });

        // Set up coin group spawning
        this.coinGroupTimer = this.time.addEvent({
            delay: this.coinGroupInterval,
            callback: this.spawnCoinGroup,
            callbackScope: this,
            loop: true
        });

        // Spawn first coin group immediately
        this.spawnCoinGroup();

        // Set up score timer
        this.time.addEvent({
            delay: 1,
            callback: () => {
                this.score += 1;
                this.scoreText.setText('Score: ' + this.score);
            },
            callbackScope: this,
            loop: true
        });

        // Handle resize
        this.scale.on('resize', this.resize, this);
        this.resize(this.scale.gameSize); // Initial resize call
    }

    drawRoundedPanel(graphic, x, y, width, height, radius) {
        graphic.clear();
        graphic.fillStyle(0x2a2a2a, 0.9); // Slightly lighter fill, more opaque
        graphic.lineStyle(2, 0xeeeeee, 0.8); // Lighter, more opaque stroke
        const rectX = x - width / 2;
        const rectY = y - height / 2;
        graphic.fillRoundedRect(rectX, rectY, width, height, radius);
        graphic.strokeRoundedRect(rectX, rectY, width, height, radius);
    }

    resize(gameSize) {
        this.cameras.main.setSize(gameSize.width, gameSize.height);
        this.starfield.setSize(gameSize.width, gameSize.height);
        this.starfield.setScale(Math.max(gameSize.width / this.starfield.width, gameSize.height / this.starfield.height));

        // Reposition UI elements (responsive)
        const panelWidth = gameSize.width * 0.15;
        const panelHeight = gameSize.height * 0.06;
        const panelX = gameSize.width * 0.05 + panelWidth / 2; // Increased left padding
        const panelY = gameSize.height * 0.05 + panelHeight / 2;
        const cornerRadius = panelHeight * 0.2;
        const indicatorSize = gameSize.height * 0.04;

        // Reposition score panel graphic and text
        this.drawRoundedPanel(this.scorePanel, panelX, panelY, panelWidth, panelHeight, cornerRadius);
        this.scoreText.setPosition(panelX, panelY);
        this.scoreText.setFontSize(Math.max(16, gameSize.height * 0.03));

        // Reposition Eko text
        this.ekoText.setPosition(gameSize.width * 0.95 - panelWidth/2, panelY); // Increased right padding
        this.ekoText.setFontSize(Math.max(16, gameSize.height * 0.03));

        // Reposition time stop indicator and icon
        this.timeStopIndicator.setPosition(gameSize.width * 0.95 - indicatorSize/2 - 10, panelY); // Next to Eko
        this.timeStopIndicator.setRadius(indicatorSize / 2);
        this.timeStopIcon.setPosition(this.timeStopIndicator.x, panelY); // Relative to indicator
        this.timeStopIcon.setFontSize(Math.max(16, gameSize.height * 0.03));
    }

    update() {
        // Scroll the starfield background
        this.starfield.tilePositionX += this.gameSpeed;

        // Update acceleration timer
        this.accelerationTimer += this.game.loop.delta;

        // Gradually increase game speed based on timer
        if (this.accelerationTimer < this.accelerationDuration1) {
            // Phase 1: Accelerate to initialTargetSpeed over accelerationDuration1 (10 seconds)
            const progress = this.accelerationTimer / this.accelerationDuration1;
            this.gameSpeed = Phaser.Math.Linear(this.initialGameSpeed, this.initialTargetSpeed, progress);
        } else if (this.accelerationTimer < this.maxSpeedTime) {
            // Phase 2: Slowly accelerate towards maxGameSpeed over 3 minutes
            const progress = (this.accelerationTimer - this.accelerationDuration1) / (this.maxSpeedTime - this.accelerationDuration1);
            this.gameSpeed = Phaser.Math.Linear(this.initialTargetSpeed, this.maxGameSpeed, progress);
        } else {
            // Phase 3: Maintain max speed
            this.gameSpeed = this.maxGameSpeed;
        }

        // Update wind direction
        this.updateWind();

        // Update time stop effect position if active
        if (this.timeStopActive && this.timeStopEffect) {
            this.timeStopEffect.x = this.player.x;
            this.timeStopEffect.y = this.player.y;
        }

        // Handle player movement
        const cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            timeStop: Phaser.Input.Keyboard.KeyCodes.T
        });

        // Handle time stop ability
        if (cursors.timeStop.isDown && this.timeStopAvailable && !this.timeStopActive) {
            this.activateTimeStop();
        }

        // Calculate vertical movement
        let velocityY = 0;

        if (cursors.up.isDown) velocityY -= this.verticalSpeed;
        else if (cursors.down.isDown) velocityY += this.verticalSpeed;

        // Apply movement
        this.player.setVelocityX(0);
        this.player.setVelocityY(Phaser.Math.Linear(this.player.body.velocity.y, velocityY, 0.1));

        // Update trail
        this.updateTrail();

        // Rotate player based on movement
        if (velocityY < 0) {
            this.player.rotation = Phaser.Math.Linear(this.player.rotation, -Math.PI / 4, 0.1);
        } else if (velocityY > 0) {
            this.player.rotation = Phaser.Math.Linear(this.player.rotation, Math.PI / 4, 0.1);
        } else {
            this.player.rotation = Phaser.Math.Linear(this.player.rotation, 0, 0.1);
        }

        // Move asteroids
        this.asteroids.getChildren().forEach(asteroid => {
            const windX = Math.cos(this.windDirection) * this.windStrength;
            const windY = Math.sin(this.windDirection) * this.windStrength;

            asteroid.x -= this.gameSpeed; // Use accelerating gameSpeed
            // Only apply vertical movement and rotation if time stop is not active
            if (!this.timeStopActive) {
                asteroid.y += windY;
                asteroid.rotation += 0.03;
            }

            if (asteroid.x < -asteroid.width * 2) {
                asteroid.destroy();
            }
        });

        // Update coin group spawning
        this.coinGroupTimer += this.game.deltaTime;
        if (this.coinGroupTimer >= this.coinGroupInterval) {
            this.spawnCoinGroup();
            this.coinGroupTimer = 0;
        }

        // Move coins
        this.coins.getChildren().forEach(coin => {
            coin.x -= this.gameSpeed; // Use accelerating gameSpeed

            if (coin.x < -coin.width * 2) {
                coin.destroy();
            }
        });

        // Check game over condition
        if (this.player.x < this.cameras.main.width * 0.1) {
            this.gameOver();
        }
    }

    updateWind() {
        // Gradually change wind direction with smoother transitions
        this.windChangeTimer += 0.005;
        this.windDirection = Math.sin(this.windChangeTimer) * Math.PI / 4;
    }

    updateTrail() {
        // Ensure player exists before adding points
        if (!this.player || !this.player.body) {
            return;
        }
        
        // Add current position to trail points. Offset slightly to the back of the ship
        const trailOffsetX = -this.player.width * 0.4 * Math.cos(this.player.rotation);
        const trailOffsetY = -this.player.width * 0.4 * Math.sin(this.player.rotation);

        this.trailPoints.unshift({
            x: this.player.x + trailOffsetX,
            y: this.player.y + trailOffsetY
        });

        // Keep trail at maximum length
        if (this.trailPoints.length > this.maxTrailLength) {
            this.trailPoints.pop();
        }

        // Draw trail
        this.trailGraphics.clear();

        if (this.trailPoints.length < 2) {
            // Need at least two points to draw a line
            return;
        }

        // Draw the trail as a single line with fading segments
        for (let i = 0; i < this.trailPoints.length - 1; i++) { // Loop up to second to last point
            const point1 = this.trailPoints[i];
            const point2 = this.trailPoints[i + 1];

            // Calculate alpha for the segment based on its age
            // The oldest segments (higher index) will have lower alpha
            const alpha = 1.0 - (i / (this.maxTrailLength - 1)); // Alpha from 1.0 to approximately 0.0
            const clampedAlpha = Phaser.Math.Clamp(alpha, 0, 1); // Ensure alpha is between 0 and 1

            this.trailGraphics.lineStyle(2, 0xffffff, clampedAlpha); // White color, calculated alpha
            this.trailGraphics.beginPath();
            this.trailGraphics.moveTo(point1.x, point1.y);
            this.trailGraphics.lineTo(point2.x, point2.y);
            this.trailGraphics.strokePath();
        }
    }

    spawnAsteroid() {
        const size = Phaser.Math.Between(40, 70);
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
            duration: 300,
            ease: 'Power2'
        });
        
        // Set up more accurate hitbox for asteroid
        const hitboxSize = size * 0.8;
        asteroid.body.setCircle(hitboxSize / 2);
        asteroid.body.setOffset((asteroid.width - hitboxSize) / 2, (asteroid.height - hitboxSize) / 2);
    }

    collectCoin(player, coin) {
        if (!coin.active) return;

        const value = coin.isSpecial ? 500 : 150;
        this.currentRunEko += value;
        this.ekoText.setText('Eko: ' + this.currentRunEko);

        // Show floating text for collected value
        const text = this.add.text(coin.x, coin.y, '+' + value, {
            fontFamily: 'Poppins',
            fontSize: '20px',
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Animate the floating text
        this.tweens.add({
            targets: text,
            y: text.y - 50,
            alpha: 0,
            duration: 1000,
            onComplete: () => text.destroy()
        });

        coin.destroy();
    }

    spawnCoinGroup() {
        const groupSize = Phaser.Math.Between(3, 6);
        const startY = Phaser.Math.Between(100, this.cameras.main.height - 100);
        const spacing = 40; // Reduced spacing for smaller coins

        // Randomly choose a formation pattern
        const patterns = ['vertical', 'diagonal', 'horizontal', 'vShape'];
        const pattern = patterns[Phaser.Math.Between(0, patterns.length - 1)];

        // 20% chance to spawn a special coin
        const hasSpecialCoin = Math.random() < 0.2;
        let specialCoinIndex = hasSpecialCoin ? Phaser.Math.Between(0, groupSize - 1) : -1;

        for (let i = 0; i < groupSize; i++) {
            const isSpecialCoin = i === specialCoinIndex;
            const coinType = isSpecialCoin ? 'coin2' : 'coin';
            
            // Calculate position based on pattern
            let x, y;
            switch(pattern) {
                case 'vertical':
                    x = this.cameras.main.width + 50;
                    y = startY + (i * spacing);
                    break;
                case 'diagonal':
                    x = this.cameras.main.width + 50 + (i * spacing * 0.5);
                    y = startY + (i * spacing);
                    break;
                case 'horizontal':
                    x = this.cameras.main.width + 50 + (i * spacing);
                    y = startY;
                    break;
                case 'vShape':
                    const center = Math.floor(groupSize / 2);
                    const distance = Math.abs(i - center);
                    x = this.cameras.main.width + 50 + (distance * spacing * 0.5);
                    y = startY + (distance * spacing);
                    break;
            }

            const coin = this.coins.create(x, y, coinType);

            coin.setScale(0.15); // Made coins even smaller
            coin.setAlpha(0);
            coin.isSpecial = isSpecialCoin;

            // Fade in animation
            this.tweens.add({
                targets: coin,
                alpha: 1,
                duration: 300,
                ease: 'Power2'
            });

            // Set physics properties with proper hitbox
            const hitboxSize = coin.width * 0.6;
            coin.body.setCircle(hitboxSize / 2);
            coin.body.setOffset((coin.width - hitboxSize) / 2, (coin.height - hitboxSize) / 2);
        }
    }

    activateTimeStop() {
        this.timeStopActive = true;
        this.timeStopAvailable = false;

        // Create time stop effect with red color and smaller size
        this.timeStopEffect = this.add.circle(this.player.x, this.player.y, 60, 0xff0000, 0.3); // Reduced from 100 to 60
        this.timeStopEffect.setStrokeStyle(2, 0xff0000, 0.5);
        
        // Animate the effect
        this.tweens.add({
            targets: this.timeStopEffect,
            scale: 1.5,
            alpha: 0,
            duration: 1000,
            yoyo: true,
            repeat: 9
        });

        // Update time stop icon
        this.timeStopIcon.setColor('#ff0000');

        // End time stop after duration
        this.time.delayedCall(this.timeStopDuration, () => {
            this.timeStopActive = false;
            if (this.timeStopEffect) {
                this.timeStopEffect.destroy();
                this.timeStopEffect = null;
            }
        });

        // Start cooldown
        this.time.delayedCall(this.timeStopCooldown, () => {
            this.timeStopAvailable = true;
            this.timeStopIcon.setColor('#ffffff');
        });
    }

    gameOver() {
        // Add current run Eko to total Eko and save
        this.totalEko += this.currentRunEko;
        localStorage.setItem('eko', this.totalEko.toString());
        
        // Stop all game systems
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.player.anims.play('turn');

        // Show game over scene
        this.scene.start('GameOverScene', {
            score: this.score,
            eko: this.currentRunEko,
            totalEko: this.totalEko
        });
    }
} 