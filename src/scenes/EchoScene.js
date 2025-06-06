import { CustomCursor } from '../cursor';

export class EchoScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EchoScene' });
    }

    preload() {
        // Load only the essential assets
        this.load.image('starfield', 'assets/starfield.png');
    }

    create() {
        // Initialize custom cursor
        this.customCursor = new CustomCursor(this);

        // Add a solid black background
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000).setOrigin(0);

        // Add a subtle dark overlay
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.2).setOrigin(0);

        // Add title with Major Mono Display
        this.title = this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.1, 'Echo Abilities', {
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

        // Create ability buttons with rounded corners and Poppins
        const buttonWidth = this.cameras.main.width * 0.25;
        const buttonHeight = this.cameras.main.height * 0.1;
        const cornerRadius = buttonHeight * 0.3;
        const buttonY = this.cameras.main.height * 0.4;

        // Phase Shift button
        this.phaseShiftButtonBg = this.add.graphics();
        this.drawRoundedButton(this.phaseShiftButtonBg, this.cameras.main.width / 2, buttonY, buttonWidth, buttonHeight, cornerRadius);

        this.phaseShiftButton = this.add.zone(this.cameras.main.width / 2, buttonY, buttonWidth, buttonHeight);
        this.phaseShiftButton.setInteractive();

        this.phaseShiftText = this.add.text(this.cameras.main.width / 2, buttonY, 'Phase Shift: 500 Eko', {
            fontFamily: 'Poppins',
            fontSize: this.cameras.main.width * 0.03 > 30 ? '30px' : `${this.cameras.main.width * 0.03}px`,
            color: '#ffffff'
        }).setOrigin(0.5);

        // Phase Shift upgrade button
        this.phaseShiftUpgradeButtonBg = this.add.graphics();
        this.drawRoundedButton(this.phaseShiftUpgradeButtonBg, this.cameras.main.width / 2 + buttonWidth + 20, buttonY, buttonWidth * 0.5, buttonHeight, cornerRadius);

        this.phaseShiftUpgradeButton = this.add.zone(this.cameras.main.width / 2 + buttonWidth + 20, buttonY, buttonWidth * 0.5, buttonHeight);
        this.phaseShiftUpgradeButton.setInteractive();

        this.phaseShiftUpgradeText = this.add.text(this.cameras.main.width / 2 + buttonWidth + 20, buttonY, 'Upgrade', {
            fontFamily: 'Poppins',
            fontSize: this.cameras.main.width * 0.02 > 20 ? '20px' : `${this.cameras.main.width * 0.02}px`,
            color: '#ffffff'
        }).setOrigin(0.5);

        // Pulse Wave button
        this.pulseWaveButtonBg = this.add.graphics();
        this.drawRoundedButton(this.pulseWaveButtonBg, this.cameras.main.width / 2, buttonY + buttonHeight + 20, buttonWidth, buttonHeight, cornerRadius);

        this.pulseWaveButton = this.add.zone(this.cameras.main.width / 2, buttonY + buttonHeight + 20, buttonWidth, buttonHeight);
        this.pulseWaveButton.setInteractive();

        this.pulseWaveText = this.add.text(this.cameras.main.width / 2, buttonY + buttonHeight + 20, 'Pulse Wave: 500 Eko', {
            fontFamily: 'Poppins',
            fontSize: this.cameras.main.width * 0.03 > 30 ? '30px' : `${this.cameras.main.width * 0.03}px`,
            color: '#ffffff'
        }).setOrigin(0.5);

        // Pulse Wave upgrade button
        this.pulseWaveUpgradeButtonBg = this.add.graphics();
        this.drawRoundedButton(this.pulseWaveUpgradeButtonBg, this.cameras.main.width / 2 + buttonWidth + 20, buttonY + buttonHeight + 20, buttonWidth * 0.5, buttonHeight, cornerRadius);

        this.pulseWaveUpgradeButton = this.add.zone(this.cameras.main.width / 2 + buttonWidth + 20, buttonY + buttonHeight + 20, buttonWidth * 0.5, buttonHeight);
        this.pulseWaveUpgradeButton.setInteractive();

        this.pulseWaveUpgradeText = this.add.text(this.cameras.main.width / 2 + buttonWidth + 20, buttonY + buttonHeight + 20, 'Upgrade', {
            fontFamily: 'Poppins',
            fontSize: this.cameras.main.width * 0.02 > 20 ? '20px' : `${this.cameras.main.width * 0.02}px`,
            color: '#ffffff'
        }).setOrigin(0.5);

        // Echo Stasis button
        this.echoStasisButtonBg = this.add.graphics();
        this.drawRoundedButton(this.echoStasisButtonBg, this.cameras.main.width / 2, buttonY + (buttonHeight + 20) * 2, buttonWidth, buttonHeight, cornerRadius);

        this.echoStasisButton = this.add.zone(this.cameras.main.width / 2, buttonY + (buttonHeight + 20) * 2, buttonWidth, buttonHeight);
        this.echoStasisButton.setInteractive();

        this.echoStasisText = this.add.text(this.cameras.main.width / 2, buttonY + (buttonHeight + 20) * 2, 'Echo Stasis: 500 Eko', {
            fontFamily: 'Poppins',
            fontSize: this.cameras.main.width * 0.03 > 30 ? '30px' : `${this.cameras.main.width * 0.03}px`,
            color: '#ffffff'
        }).setOrigin(0.5);

        // Echo Stasis upgrade button
        this.echoStasisUpgradeButtonBg = this.add.graphics();
        this.drawRoundedButton(this.echoStasisUpgradeButtonBg, this.cameras.main.width / 2 + buttonWidth + 20, buttonY + (buttonHeight + 20) * 2, buttonWidth * 0.5, buttonHeight, cornerRadius);

        this.echoStasisUpgradeButton = this.add.zone(this.cameras.main.width / 2 + buttonWidth + 20, buttonY + (buttonHeight + 20) * 2, buttonWidth * 0.5, buttonHeight);
        this.echoStasisUpgradeButton.setInteractive();

        this.echoStasisUpgradeText = this.add.text(this.cameras.main.width / 2 + buttonWidth + 20, buttonY + (buttonHeight + 20) * 2, 'Upgrade', {
            fontFamily: 'Poppins',
            fontSize: this.cameras.main.width * 0.02 > 20 ? '20px' : `${this.cameras.main.width * 0.02}px`,
            color: '#ffffff'
        }).setOrigin(0.5);

        // Add hover effects and click handlers for Phase Shift button
        this.phaseShiftButton.on('pointerover', () => {
            this.phaseShiftButtonBg.clear();
            this.drawRoundedButton(this.phaseShiftButtonBg, this.cameras.main.width / 2, buttonY, buttonWidth, buttonHeight, cornerRadius, true);
        });

        this.phaseShiftButton.on('pointerout', () => {
            this.phaseShiftButtonBg.clear();
            this.drawRoundedButton(this.phaseShiftButtonBg, this.cameras.main.width / 2, buttonY, buttonWidth, buttonHeight, cornerRadius, false);
        });

        this.phaseShiftButton.on('pointerdown', () => {
            this.selectAbility('phaseShift');
        });

        // Add hover effects and click handlers for Phase Shift upgrade button
        this.phaseShiftUpgradeButton.on('pointerover', () => {
            this.phaseShiftUpgradeButtonBg.clear();
            this.drawRoundedButton(this.phaseShiftUpgradeButtonBg, this.cameras.main.width / 2 + buttonWidth + 20, buttonY, buttonWidth * 0.5, buttonHeight, cornerRadius, true);
        });

        this.phaseShiftUpgradeButton.on('pointerout', () => {
            this.phaseShiftUpgradeButtonBg.clear();
            this.drawRoundedButton(this.phaseShiftUpgradeButtonBg, this.cameras.main.width / 2 + buttonWidth + 20, buttonY, buttonWidth * 0.5, buttonHeight, cornerRadius, false);
        });

        this.phaseShiftUpgradeButton.on('pointerdown', () => {
            this.upgradeAbility('phaseShift');
        });

        // Add hover effects and click handlers for Pulse Wave button
        this.pulseWaveButton.on('pointerover', () => {
            this.pulseWaveButtonBg.clear();
            this.drawRoundedButton(this.pulseWaveButtonBg, this.cameras.main.width / 2, buttonY + buttonHeight + 20, buttonWidth, buttonHeight, cornerRadius, true);
        });

        this.pulseWaveButton.on('pointerout', () => {
            this.pulseWaveButtonBg.clear();
            this.drawRoundedButton(this.pulseWaveButtonBg, this.cameras.main.width / 2, buttonY + buttonHeight + 20, buttonWidth, buttonHeight, cornerRadius, false);
        });

        this.pulseWaveButton.on('pointerdown', () => {
            this.selectAbility('pulseWave');
        });

        // Add hover effects and click handlers for Pulse Wave upgrade button
        this.pulseWaveUpgradeButton.on('pointerover', () => {
            this.pulseWaveUpgradeButtonBg.clear();
            this.drawRoundedButton(this.pulseWaveUpgradeButtonBg, this.cameras.main.width / 2 + buttonWidth + 20, buttonY + buttonHeight + 20, buttonWidth * 0.5, buttonHeight, cornerRadius, true);
        });

        this.pulseWaveUpgradeButton.on('pointerout', () => {
            this.pulseWaveUpgradeButtonBg.clear();
            this.drawRoundedButton(this.pulseWaveUpgradeButtonBg, this.cameras.main.width / 2 + buttonWidth + 20, buttonY + buttonHeight + 20, buttonWidth * 0.5, buttonHeight, cornerRadius, false);
        });

        this.pulseWaveUpgradeButton.on('pointerdown', () => {
            this.upgradeAbility('pulseWave');
        });

        // Add hover effects and click handlers for Echo Stasis button
        this.echoStasisButton.on('pointerover', () => {
            this.echoStasisButtonBg.clear();
            this.drawRoundedButton(this.echoStasisButtonBg, this.cameras.main.width / 2, buttonY + (buttonHeight + 20) * 2, buttonWidth, buttonHeight, cornerRadius, true);
        });

        this.echoStasisButton.on('pointerout', () => {
            this.echoStasisButtonBg.clear();
            this.drawRoundedButton(this.echoStasisButtonBg, this.cameras.main.width / 2, buttonY + (buttonHeight + 20) * 2, buttonWidth, buttonHeight, cornerRadius, false);
        });

        this.echoStasisButton.on('pointerdown', () => {
            this.selectAbility('echoStasis');
        });

        // Add hover effects and click handlers for Echo Stasis upgrade button
        this.echoStasisUpgradeButton.on('pointerover', () => {
            this.echoStasisUpgradeButtonBg.clear();
            this.drawRoundedButton(this.echoStasisUpgradeButtonBg, this.cameras.main.width / 2 + buttonWidth + 20, buttonY + (buttonHeight + 20) * 2, buttonWidth * 0.5, buttonHeight, cornerRadius, true);
        });

        this.echoStasisUpgradeButton.on('pointerout', () => {
            this.echoStasisUpgradeButtonBg.clear();
            this.drawRoundedButton(this.echoStasisUpgradeButtonBg, this.cameras.main.width / 2 + buttonWidth + 20, buttonY + (buttonHeight + 20) * 2, buttonWidth * 0.5, buttonHeight, cornerRadius, false);
        });

        this.echoStasisUpgradeButton.on('pointerdown', () => {
            this.upgradeAbility('echoStasis');
        });

        // Create Back button
        const backButtonWidth = this.cameras.main.width * 0.25;
        const backButtonHeight = this.cameras.main.height * 0.1;
        const backButtonY = this.cameras.main.height * 0.9;

        this.backButtonBg = this.add.graphics();
        this.drawRoundedButton(this.backButtonBg, this.cameras.main.width / 2, backButtonY, backButtonWidth, backButtonHeight, cornerRadius);

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

        // Load saved abilities and Eko
        this.loadAbilities();

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

    loadAbilities() {
        // Load saved abilities and Eko from localStorage
        const savedPhaseShift = localStorage.getItem('phaseShift');
        const savedPulseWave = localStorage.getItem('pulseWave');
        const savedEchoStasis = localStorage.getItem('echoStasis');

        this.abilities = {
            phaseShift: {
                owned: savedPhaseShift ? savedPhaseShift === 'true' : false,
                level: parseInt(localStorage.getItem('phaseShiftLevel')) || 1,
                equipped: savedPhaseShift ? localStorage.getItem('phaseShiftEquipped') === 'true' : false
            },
            pulseWave: {
                owned: savedPulseWave ? savedPulseWave === 'true' : false,
                level: parseInt(localStorage.getItem('pulseWaveLevel')) || 1,
                equipped: savedPulseWave ? localStorage.getItem('pulseWaveEquipped') === 'true' : false
            },
            echoStasis: {
                owned: savedEchoStasis ? savedEchoStasis === 'true' : true, // Owned by default
                level: parseInt(localStorage.getItem('echoStasisLevel')) || 1,
                equipped: savedEchoStasis ? localStorage.getItem('echoStasisEquipped') === 'true' : true // Equipped by default
            }
        };
        this.eko = parseInt(localStorage.getItem('eko')) || 0;
        this.updateDisplay();
    }

    saveAbilities() {
        // Save abilities to localStorage
        Object.entries(this.abilities).forEach(([ability, data]) => {
            localStorage.setItem(ability, data.owned);
            localStorage.setItem(`${ability}Level`, data.level);
            localStorage.setItem(`${ability}Equipped`, data.equipped);
        });
    }

    updateDisplay() {
        // Update all text displays
        this.ekoText.setText(`Eko: ${this.eko}`);
        
        // Update button texts and colors based on ownership and level
        this.phaseShiftText.setText(`Phase Shift: ${this.abilities.phaseShift.owned ? `Level ${this.abilities.phaseShift.level}${this.abilities.phaseShift.equipped ? ' (Equipped)' : ''}` : '500 Eko'}`);
        this.pulseWaveText.setText(`Pulse Wave: ${this.abilities.pulseWave.owned ? `Level ${this.abilities.pulseWave.level}${this.abilities.pulseWave.equipped ? ' (Equipped)' : ''}` : '500 Eko'}`);
        this.echoStasisText.setText(`Echo Stasis: ${this.abilities.echoStasis.owned ? `Level ${this.abilities.echoStasis.level}${this.abilities.echoStasis.equipped ? ' (Equipped)' : ''}` : '500 Eko'}`);

        // Update upgrade button texts
        this.phaseShiftUpgradeText.setText(this.abilities.phaseShift.owned ? `Upgrade (${this.abilities.phaseShift.level * 500} Eko)` : '');
        this.pulseWaveUpgradeText.setText(this.abilities.pulseWave.owned ? `Upgrade (${this.abilities.pulseWave.level * 500} Eko)` : '');
        this.echoStasisUpgradeText.setText(this.abilities.echoStasis.owned ? `Upgrade (${this.abilities.echoStasis.level * 500} Eko)` : '');

        // Update text colors based on affordability and state
        this.phaseShiftText.setColor(this.getAbilityColor('phaseShift'));
        this.pulseWaveText.setColor(this.getAbilityColor('pulseWave'));
        this.echoStasisText.setColor(this.getAbilityColor('echoStasis'));

        // Update upgrade button colors
        this.phaseShiftUpgradeText.setColor(this.abilities.phaseShift.owned && this.eko >= this.abilities.phaseShift.level * 500 ? '#ffffff' : '#666666');
        this.pulseWaveUpgradeText.setColor(this.abilities.pulseWave.owned && this.eko >= this.abilities.pulseWave.level * 500 ? '#ffffff' : '#666666');
        this.echoStasisUpgradeText.setColor(this.abilities.echoStasis.owned && this.eko >= this.abilities.echoStasis.level * 500 ? '#ffffff' : '#666666');
    }

    getAbilityColor(ability) {
        const data = this.abilities[ability];
        if (data.owned) {
            return data.equipped ? '#00ff00' : '#ffff00';
        }
        return this.eko >= 500 ? '#ffffff' : '#ff0000';
    }

    selectAbility(ability) {
        const data = this.abilities[ability];
        
        if (!data.owned) {
            // Buy ability
            if (this.eko >= 500) {
                this.eko -= 500;
                data.owned = true;
                data.equipped = true; // Auto-equip when bought
                
                // Unequip all other abilities
                Object.entries(this.abilities).forEach(([key, abilityData]) => {
                    if (key !== ability) {
                        abilityData.equipped = false;
                    }
                });
                
                this.saveAbilities();
                this.updateDisplay();
            }
        } else {
            // Toggle equip state
            if (!data.equipped) {
                // Unequip all other abilities first
                Object.entries(this.abilities).forEach(([key, abilityData]) => {
                    abilityData.equipped = false;
                });
                // Then equip the selected ability
                data.equipped = true;
            } else {
                // If already equipped, just unequip it
                data.equipped = false;
            }
            this.saveAbilities();
            this.updateDisplay();
        }
    }

    upgradeAbility(ability) {
        const data = this.abilities[ability];
        if (data.owned) {
            const cost = data.level * 500; // Each level costs 500 Eko
            if (this.eko >= cost) {
                this.eko -= cost;
                data.level++;
                this.saveAbilities();
                this.updateDisplay();
            }
        }
    }

    resize(gameSize) {
        // Update camera and background on resize
        this.cameras.main.setSize(gameSize.width, gameSize.height);
        
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

        // Phase Shift button
        this.phaseShiftButton.setPosition(centerX, buttonY);
        this.phaseShiftButton.setSize(buttonWidth, buttonHeight);
        this.phaseShiftText.setPosition(centerX, buttonY);
        this.phaseShiftText.setFontSize(gameSize.width * 0.03 > 30 ? '30px' : `${gameSize.width * 0.03}px`);
        this.drawRoundedButton(this.phaseShiftButtonBg, centerX, buttonY, buttonWidth, buttonHeight, cornerRadius);

        // Pulse Wave button
        this.pulseWaveButton.setPosition(centerX, buttonY + buttonHeight + 20);
        this.pulseWaveButton.setSize(buttonWidth, buttonHeight);
        this.pulseWaveText.setPosition(centerX, buttonY + buttonHeight + 20);
        this.pulseWaveText.setFontSize(gameSize.width * 0.03 > 30 ? '30px' : `${gameSize.width * 0.03}px`);
        this.drawRoundedButton(this.pulseWaveButtonBg, centerX, buttonY + buttonHeight + 20, buttonWidth, buttonHeight, cornerRadius);

        // Echo Stasis button
        this.echoStasisButton.setPosition(centerX, buttonY + (buttonHeight + 20) * 2);
        this.echoStasisButton.setSize(buttonWidth, buttonHeight);
        this.echoStasisText.setPosition(centerX, buttonY + (buttonHeight + 20) * 2);
        this.echoStasisText.setFontSize(gameSize.width * 0.03 > 30 ? '30px' : `${gameSize.width * 0.03}px`);
        this.drawRoundedButton(this.echoStasisButtonBg, centerX, buttonY + (buttonHeight + 20) * 2, buttonWidth, buttonHeight, cornerRadius);

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
    }
}
