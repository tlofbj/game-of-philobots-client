import Phaser from 'phaser';
import { serverAPI } from '../api/serverAPI.js';

/**
 * Main Game Scene
 */
export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.serverAPI = null;
        this.statusText = null;
    }

    preload() {
        // Preload game assets
    }

    create() {
        const { width, height } = this.cameras.main;

        // Get server API instance
        this.serverAPI = serverAPI;

        // Create status text
        this.statusText = this.add.text(width / 2, height / 2, 
            'Game Scene\nWebSocket Connected: ' + (this.serverAPI ? this.serverAPI.isConnected() : false), {
            fontSize: '24px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        // Add visual feedback
        const wsIndicator = this.add.rectangle(width / 2, height / 2 - 100, 100, 100, 0x3498db);
        this.add.text(width / 2, height / 2 - 100, 'WS', {
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5);

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

        // Register for WebSocket messages
        if (this.serverAPI) {
            this.serverAPI.onMessage((data) => {
                this.handleServerMessage(data);
            });
        }

        // Update status periodically
        this.time.addEvent({
            delay: 1000,
            callback: this.updateStatus,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        // Game update loop
    }

    /**
     * Update connection status display
     */
    updateStatus() {
        if (this.statusText && this.serverAPI) {
            const connected = this.serverAPI.isConnected();
            this.statusText.setText('Game Scene\nWebSocket Connected: ' + connected);
        }
    }

    /**
     * Handle server message
     * @param {Object|string} data - Message data
     */
    handleServerMessage(data) {
        console.log('GameScene received message:', data);
        // Handle game-specific messages here
    }
}

