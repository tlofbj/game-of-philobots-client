/**
 * Phaser Game Entry Point
 */
import Phaser from 'phaser';
import { serverAPI } from './api/serverAPI.js';
import { MainMenu } from './scenes/MainMenu.js';
import { DialogueScene } from './scenes/DialogueScene.js';
import { GameScene } from './scenes/GameScene.js';

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#2c3e50',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MainMenu, DialogueScene, GameScene]
};

// Initialize Phaser game
const game = new Phaser.Game(config);

// Initialize WebSocket connection
serverAPI.connect();

// Update connection status in UI
serverAPI.onConnectionChange((connected, message) => {
    updateUIStatus(connected, message);
});

/**
 * Update UI status display
 * @param {boolean} connected - Connection state
 * @param {string} message - Optional status message
 */
function updateUIStatus(connected, message = null) {
    const statusEl = document.getElementById('status');
    if (statusEl) {
        if (message) {
            statusEl.textContent = message;
        } else {
            statusEl.textContent = connected 
                ? 'Connected to ws://localhost:4242' 
                : 'Disconnected';
        }
    }
}

// Export for global access
window.serverAPI = serverAPI;
window.sendMessage = (data) => serverAPI.send(data);

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    serverAPI.disconnect();
});

