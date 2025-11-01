import Phaser from 'phaser';

/**
 * Main Menu Scene
 */
export class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        // Preload menu assets
    }

    create() {
        const { width, height } = this.cameras.main;

        // Title
        this.add.text(width / 2, height / 2 - 100, 'Game of Philobots', {
            fontSize: '48px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Start button
        const startButton = this.add.rectangle(width / 2, height / 2 + 50, 200, 50, 0x3498db)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start('GameScene');
            });

        this.add.text(width / 2, height / 2 + 50, 'Start Game', {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Dialogue button
        const dialogueButton = this.add.rectangle(width / 2, height / 2 + 120, 200, 50, 0x2ecc71)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start('DialogueScene');
            });

        this.add.text(width / 2, height / 2 + 120, 'Dialogue', {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);
    }
}

