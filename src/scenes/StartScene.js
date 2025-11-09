import { CustomCursor } from '../cursor';

export class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
        this.menuButtons = [];
        this.transitioning = false;
    }

    preload() {
        this.load.image('spaceship', 'assets/spaceship.png');
        this.load.image('asteroid', 'assets/asteroid.png');
        this.load.audio('backgroundMusic', 'assets/backjazz.mp3');
        this.load.image('coin', 'assets/coin.png');
        this.load.image('coin2', 'assets/coin2.png');
        this.load.image('logo', 'assets/logo.png');
    }

    create() {
        this.customCursor = new CustomCursor(this);
        this.menuButtons = [];
        this.transitioning = false;

        this.colors = {
            background: 0x05070b,
            accentHex: 0xf7f8ff,
            accent: '#f7f8ff',
            cyanGlow: 'rgba(64, 225, 255, 0.75)',
            subtitle: 'rgba(247, 248, 255, 0.7)'
        };

        const { width, height } = this.cameras.main;

        this.backgroundRect = this.add.rectangle(0, 0, width, height, this.colors.background, 1).setOrigin(0);
        this.backgroundRect.setDepth(-3);

        this.noiseTexture = this.add.renderTexture(0, 0, width, height).setOrigin(0);
        this.noiseTexture.setAlpha(0.12);
        this.noiseTexture.setDepth(-2);
        this.refreshNoise(width, height);
        this.noiseRefreshEvent = this.time.addEvent({
            delay: 2200,
            loop: true,
            callback: () => this.refreshNoise(this.cameras.main.width, this.cameras.main.height)
        });

        this.horizon = this.add.rectangle(width / 2, height * 0.44, width * 0.6, 1.2, this.colors.accentHex, 0.2).setOrigin(0.5);
        this.horizon.setDepth(-1);

        this.title = this.add.text(width / 2, height * 0.22, 'NIGHT GLIDE', {
            fontFamily: 'Space Grotesk',
            fontSize: `${Math.min(width * 0.075, 96)}px`,
            fontStyle: '600',
            color: this.colors.accent,
            align: 'center'
        }).setOrigin(0.5);
        this.title.setShadow(0, 0, this.colors.cyanGlow, 24, false, true);

        this.subtitle = this.add.text(width / 2, height * 0.3, 'ORBITAL DRIFT PROTOCOL', {
            fontFamily: 'Space Grotesk',
            fontSize: `${Math.min(width * 0.02, 26)}px`,
            fontStyle: '300',
            color: this.colors.subtitle,
            align: 'center'
        }).setOrigin(0.5);

        const menuConfig = [
            { label: 'ENTER SIMULATION', yRatio: 0.55, target: 'GameScene' },
            { label: 'ARMORY', yRatio: 0.65, target: 'ArmoryScene' },
            { label: 'ECHO CHAMBER', yRatio: 0.75, target: 'EchoScene' }
        ];

        menuConfig.forEach(config => this.createMenuButton(config));

        this.musicEnabled = localStorage.getItem('musicEnabled') === 'true';
        this.backgroundMusic = this.sound.add('backgroundMusic', {
            volume: 0.2,
            loop: true
        });

        if (this.musicEnabled) {
            this.backgroundMusic.play();
        }

        this.musicToggleButton = this.add.text(40, height - 40, this.musicEnabled ? 'SOUND: ON' : 'SOUND: OFF', {
            fontFamily: 'Space Grotesk',
            fontSize: '14px',
            color: this.colors.subtitle
        }).setInteractive({ cursor: 'pointer' });
        this.musicToggleButton.setAlpha(0.75);
        this.musicToggleButton.on('pointerover', () => this.musicToggleButton.setAlpha(1));
        this.musicToggleButton.on('pointerout', () => this.musicToggleButton.setAlpha(0.75));
        this.musicToggleButton.on('pointerdown', () => {
            this.musicEnabled = !this.musicEnabled;
            localStorage.setItem('musicEnabled', this.musicEnabled);
            this.musicToggleButton.setText(this.musicEnabled ? 'SOUND: ON' : 'SOUND: OFF');
            if (this.musicEnabled) {
                this.backgroundMusic.play();
            } else {
                this.backgroundMusic.stop();
            }
        });

        this.logo = this.add.image(width - 40, 40, 'logo');
        this.logo.setOrigin(1, 0);
        this.logo.setScale(Math.min(width * 0.00025, 0.3));
        this.logo.setAlpha(0.55);
        this.logo.setTint(this.colors.accentHex);

        this.scale.on('resize', this.resize, this);
        this.resize(this.scale.gameSize);
    }

    createMenuButton({ label, yRatio, target }) {
        const buttonWidth = this.cameras.main.width * 0.28;
        const buttonHeight = this.cameras.main.height * 0.065;

        const outline = this.add.rectangle(0, 0, buttonWidth, buttonHeight, 0x000000, 0);
        outline.setStrokeStyle(1, this.colors.accentHex, 0.5);

        const text = this.add.text(0, 0, label, {
            fontFamily: 'Space Grotesk',
            fontSize: `${Math.min(this.cameras.main.width * 0.018, 24)}px`,
            fontStyle: '500',
            color: this.colors.accent,
            align: 'center'
        }).setOrigin(0.5);

        const container = this.add.container(this.cameras.main.width / 2, this.cameras.main.height * yRatio, [outline, text]);
        container.setSize(buttonWidth, buttonHeight);
        container.setInteractive({ cursor: 'pointer' });

        container.on('pointerover', () => this.setButtonHover(outline, text, true));
        container.on('pointerout', () => this.setButtonHover(outline, text, false));
        container.on('pointerdown', () => this.transitionTo(target));

        this.menuButtons.push({ container, outline, text, yRatio });
    }

    setButtonHover(outline, text, isHovering) {
        if (isHovering) {
            outline.setStrokeStyle(1.5, this.colors.accentHex, 1);
            text.setColor('#ffffff');
            text.setShadow(0, 0, this.colors.cyanGlow, 12, false, true);
        } else {
            outline.setStrokeStyle(1, this.colors.accentHex, 0.5);
            text.setColor(this.colors.accent);
            text.setShadow(0, 0, '#000000', 0, false, false);
        }
    }

    refreshNoise(width, height) {
        if (!this.noiseTexture) {
            return;
        }

        const w = Math.max(1, Math.floor(width));
        const h = Math.max(1, Math.floor(height));

        this.noiseTexture.resize(w, h);
        this.noiseTexture.clear();

        const particleCount = Math.floor((w * h) / 2800);

        for (let i = 0; i < particleCount; i += 1) {
            const size = Phaser.Math.Between(1, 2);
            const gray = Phaser.Math.Between(12, 35);
            const color = Phaser.Display.Color.GetColor(gray, gray + 2, gray + 6);
            const alpha = Phaser.Math.FloatBetween(0.04, 0.12);
            const x = Phaser.Math.Between(0, w);
            const y = Phaser.Math.Between(0, h);
            this.noiseTexture.fill(color, alpha, x, y, size, size);
        }
    }

    transitionTo(targetScene) {
        if (this.transitioning) {
            return;
        }

        this.transitioning = true;
        this.cameras.main.fade(520, 0, 0, 0);
        this.time.delayedCall(520, () => this.scene.start(targetScene));
    }

    resize(gameSize) {
        const { width, height } = gameSize;

        this.cameras.main.setSize(width, height);

        if (this.backgroundRect) {
            this.backgroundRect.setDisplaySize(width, height);
        }

        if (this.noiseTexture) {
            this.noiseTexture.setPosition(0, 0);
            this.refreshNoise(width, height);
        }

        if (this.horizon) {
            this.horizon.setPosition(width / 2, height * 0.44);
            this.horizon.setDisplaySize(width * 0.6, 1.2);
        }

        if (this.title) {
            this.title.setPosition(width / 2, height * 0.22);
            this.title.setFontSize(width * 0.075 > 96 ? '96px' : `${width * 0.075}px`);
        }

        if (this.subtitle) {
            this.subtitle.setPosition(width / 2, height * 0.3);
            this.subtitle.setFontSize(width * 0.02 > 26 ? '26px' : `${width * 0.02}px`);
        }

        const buttonWidth = width * 0.28;
        const buttonHeight = height * 0.065;

        this.menuButtons.forEach(({ container, outline, text, yRatio }) => {
            container.setPosition(width / 2, height * yRatio);
            container.setSize(buttonWidth, buttonHeight);
            outline.setDisplaySize(buttonWidth, buttonHeight);
            text.setFontSize(width * 0.018 > 24 ? '24px' : `${Math.max(width * 0.018, 14)}px`);
        });

        if (this.musicToggleButton) {
            this.musicToggleButton.setPosition(40, height - 40);
        }

        if (this.logo) {
            this.logo.setPosition(width - 40, 40);
            this.logo.setScale(Math.min(width * 0.00025, 0.3));
        }
    }

    update(time) {
        if (this.horizon) {
            const pulse = 0.12 + Math.abs(Math.sin(time * 0.0015)) * 0.08;
            this.horizon.setAlpha(pulse);
        }

        if (this.customCursor) {
            this.customCursor.update();
        }
    }
}
