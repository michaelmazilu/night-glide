export class ArmoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ArmoryScene' });
        this.upgrades = {
            speed: { level: 0, maxLevel: 5, baseCost: 1000, costMultiplier: 1.5, effect: '+20% Speed' },
            control: { level: 0, maxLevel: 5, baseCost: 1000, costMultiplier: 1.5, effect: '+15% Control' },
            armor: { level: 0, maxLevel: 5, baseCost: 1000, costMultiplier: 1.5, effect: '+1 Hit Point' }
        };
        this.totalEko = 0;
    }

    preload() {
        // Load assets
        this.load.image('starfield', 'assets/starfield.png');
        this.load.image('spaceship', 'assets/spaceship.png');
        this.load.image('coin', 'assets/coin.png');
    }

    create() {
        // Load saved upgrades and Eko
        this.loadUpgrades();

        // Add scrolling starfield background
        this.starfield = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'starfield');
        this.starfield.setOrigin(0, 0);
        this.starfield.setScale(Math.max(this.cameras.main.width / this.starfield.width, this.cameras.main.height / this.starfield.height));

        // Add a subtle dark overlay
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.6).setOrigin(0);

        // Add title
        this.add.text(this.cameras.main.width / 2, 50, 'Ship Armory', {
            fontFamily: 'Major Mono Display',
            fontSize: '48px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Add Eko display
        this.ekoText = this.add.text(this.cameras.main.width / 2, 100, 'Total Eko: ' + this.totalEko, {
            fontFamily: 'Major Mono Display',
            fontSize: '32px',
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Create upgrade buttons
        const startY = 200;
        const spacing = 150;
        let y = startY;

        for (const [key, upgrade] of Object.entries(this.upgrades)) {
            const cost = this.calculateCost(upgrade);
            const button = this.drawUpgradeButton(
                this.cameras.main.width / 2,
                y,
                key.charAt(0).toUpperCase() + key.slice(1),
                upgrade.level,
                upgrade.maxLevel,
                cost,
                upgrade.effect
            );

            button.on('pointerdown', () => {
                this.upgradeAttribute(key);
            });

            y += spacing;
        }

        // Add back button
        const backButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 50, 'Back', {
            fontFamily: 'Poppins',
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#2a2a2a',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        backButton.on('pointerdown', () => {
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('StartScene');
            });
        });
    }

    loadUpgrades() {
        // Load saved upgrades
        const savedUpgrades = localStorage.getItem('shipUpgrades');
        if (savedUpgrades) {
            const loadedUpgrades = JSON.parse(savedUpgrades);
            for (const [key, upgrade] of Object.entries(loadedUpgrades)) {
                this.upgrades[key].level = upgrade.level;
            }
        }

        // Load saved total Eko
        const savedEko = localStorage.getItem('eko');
        if (savedEko) {
            this.totalEko = parseInt(savedEko);
        }
    }

    saveUpgrades() {
        const upgradesToSave = {};
        for (const [key, upgrade] of Object.entries(this.upgrades)) {
            upgradesToSave[key] = { level: upgrade.level };
        }
        localStorage.setItem('shipUpgrades', JSON.stringify(upgradesToSave));
        localStorage.setItem('eko', this.totalEko.toString());
    }

    drawUpgradeButton(x, y, name, level, maxLevel, cost, effect) {
        const button = this.add.container(x, y);
        const width = 400;
        const height = 100;
        const cornerRadius = 20;

        // Draw button background
        const graphics = this.add.graphics();
        graphics.fillStyle(0x2a2a2a, 0.9);
        graphics.lineStyle(2, 0xeeeeee, 0.8);
        graphics.fillRoundedRect(-width/2, -height/2, width, height, cornerRadius);
        graphics.strokeRoundedRect(-width/2, -height/2, width, height, cornerRadius);
        button.add(graphics);

        // Add upgrade name and level
        const nameText = this.add.text(-width/2 + 20, -height/2 + 20, `${name} (Level ${level}/${maxLevel})`, {
            fontFamily: 'Poppins',
            fontSize: '24px',
            color: '#ffffff'
        });
        button.add(nameText);

        // Add effect description
        const effectText = this.add.text(-width/2 + 20, -height/2 + 50, effect, {
            fontFamily: 'Poppins',
            fontSize: '18px',
            color: '#aaaaaa'
        });
        button.add(effectText);

        // Add cost
        const costText = this.add.text(width/2 - 20, 0, `${cost} Eko`, {
            fontFamily: 'Poppins',
            fontSize: '24px',
            color: this.totalEko >= cost ? '#00ff00' : '#ff0000'
        }).setOrigin(1, 0.5);
        button.add(costText);

        // Make button interactive
        button.setSize(width, height);
        button.setInteractive(new Phaser.Geom.Rectangle(-width/2, -height/2, width, height), Phaser.Geom.Rectangle.Contains);

        return button;
    }

    calculateCost(upgrade) {
        return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level));
    }

    upgradeAttribute(attribute) {
        const upgrade = this.upgrades[attribute];
        const cost = this.calculateCost(upgrade);

        if (upgrade.level < upgrade.maxLevel && this.totalEko >= cost) {
            this.totalEko -= cost;
            upgrade.level++;
            this.saveUpgrades();
            this.scene.restart();
        }
    }

    update() {
        // Scroll the starfield background
        this.starfield.tilePositionX += 2;
    }
} 