# game-of-philobots-client

A Phaser 3 game client with WebSocket support for connecting to a Python FastAPI server.

## Architecture

```
game-of-philobots/
├── public/
│   ├── index.html
│   └── assets/
│       ├── sprites/
│       ├── audio/
│       └── ui/
├── src/
│   ├── scenes/
│   │   ├── MainMenu.js
│   │   ├── DialogueScene.js
│   │   └── GameScene.js
│   ├── ui/
│   │   └── DialogueBox.js
│   ├── api/
│   │   └── serverAPI.js      ← handles fetch/WebSocket to backend
│   └── main.js               ← Phaser entry
├── package.json
├── vite.config.js            ← Vite configuration
└── README.md
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   The game will open automatically at `http://localhost:3000`

3. Build for production:
   ```bash
   npm run build
   ```

## WebSocket Connection

The game connects to `ws://localhost:4242` on startup and automatically reconnects if the connection is lost.

## Project Structure

### Scenes
- **MainMenu**: Main menu with navigation buttons
- **DialogueScene**: Scene for displaying dialogue using DialogueBox
- **GameScene**: Main game scene with WebSocket integration

### API
- **serverAPI.js**: Handles WebSocket and HTTP communication with the backend
  - WebSocket for real-time communication
  - Fetch API for REST endpoints

### UI Components
- **DialogueBox**: Reusable dialogue box component for displaying text

## Usage

### Sending Messages

```javascript
import { serverAPI } from './api/serverAPI.js';

// Send via WebSocket
serverAPI.send({ type: 'action', data: 'some data' });

// Or use global function
window.sendMessage({ type: 'action', data: 'some data' });
```

### Receiving Messages

```javascript
import { serverAPI } from './api/serverAPI.js';

serverAPI.onMessage((data) => {
    // Handle incoming messages
    console.log('Received:', data);
});
```

### HTTP Requests

```javascript
import { serverAPI } from './api/serverAPI.js';

// GET request
const data = await serverAPI.fetch('/api/endpoint');

// POST request
const result = await serverAPI.fetch('/api/endpoint', {
    method: 'POST',
    body: JSON.stringify({ key: 'value' })
});
```

### Connection Status

```javascript
import { serverAPI } from './api/serverAPI.js';

serverAPI.onConnectionChange((connected, message) => {
    console.log('Connection status:', connected, message);
});

// Check connection status
if (serverAPI.isConnected()) {
    // WebSocket is connected
}
```

## Customization

### Adding New Scenes

1. Create a new scene file in `src/scenes/`
2. Export a class extending `Phaser.Scene`
3. Add it to the scenes array in `src/main.js`

### Adding Assets

Place assets in `public/assets/`:
- Sprites: `public/assets/sprites/`
- Audio: `public/assets/audio/`
- UI: `public/assets/ui/`

### Modifying WebSocket Configuration

Edit `WS_CONFIG` in `src/api/serverAPI.js`:
```javascript
const WS_CONFIG = {
    url: 'ws://localhost:4242',
    reconnectDelay: 3000,
    autoReconnect: true
};
```
