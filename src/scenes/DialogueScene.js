import Phaser from 'phaser';
import { DialogueBox } from '../ui/DialogueBox.js';

/**
 * Dialogue Scene
 */
export class DialogueScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DialogueScene' });
        this.dialogueBox = null;
    }

    preload() {
        // Preload dialogue assets
    }

    create() {
        const { width, height } = this.cameras.main;

        // Background
        this.add.rectangle(width / 2, height / 2, width, height, 0x2c3e50);

        // Create dialogue box
        this.dialogueBox = new DialogueBox(this, width / 2, height - 100, width - 100, 150);

        // Example dialogue
        this.dialogueBox.showDialogue(
            'Hello! This is a dialogue scene.',
            'Character Name'
        );

        // Back button
        const backButton = this.add.rectangle(100, 50, 150, 40, 0x95a5a6)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start('MainMenu');
            });

        this.add.text(100, 50, 'Back to Menu', {
            fontSize: '18px',
            fill: '#ffffff'
        }).setOrigin(0.5);
    }

    update() {
        // Update dialogue box if needed
        if (this.dialogueBox) {
            this.dialogueBox.update();
        }
    }
}

