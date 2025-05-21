import Phaser from 'phaser';
import config from './config';
import { StartScene } from './scenes/StartScene';
import { GameScene } from './scenes/GameScene';
import { GameOverScene } from './scenes/GameOverScene';
import { ArmoryScene } from './scenes/ArmoryScene';

// Add ArmoryScene to the scenes array in config
config.scene = [StartScene, GameScene, GameOverScene, ArmoryScene];

// Create the game instance
const game = new Phaser.Game(config);

// Handle window resize
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});

function preload() {}

function create() {
  this.add.text(400, 300, 'Space Runner', {
    fontFamily: 'Major Mono Display',
    fontSize: '32px',
    color: '#ffffff'
  }).setOrigin(0.5);
}

function update() {}
