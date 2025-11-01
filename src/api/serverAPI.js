/**
 * Server API
 * Handles WebSocket and HTTP communication with the backend
 */

const WS_CONFIG = {
    url: 'ws://localhost:4242',
    reconnectDelay: 3000,
    autoReconnect: true
};

/**
 * WebSocket Service for real-time communication
 */
export class ServerAPI {
    constructor() {
        this.ws = null;
        this.connected = false;
        this.reconnectTimeout = null;
        this.messageHandlers = [];
        this.connectionCallbacks = [];
    }

    /**
     * Connect to WebSocket server
     */
    connect() {
        try {
            this.ws = new WebSocket(WS_CONFIG.url);

            this.ws.onopen = (event) => {
                console.log('WebSocket connected to', WS_CONFIG.url);
                this.connected = true;
                this.notifyConnectionChange(true);
                this.send({ type: 'connect', message: 'Client connected' });
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleMessage(data);
                } catch (e) {
                    // Handle non-JSON messages
                    this.handleMessage(event.data);
                }
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.notifyConnectionChange(false, 'Error occurred');
            };

            this.ws.onclose = (event) => {
                console.log('WebSocket closed');
                this.connected = false;
                this.notifyConnectionChange(false, 'Disconnected. Reconnecting...');
                
                if (WS_CONFIG.autoReconnect) {
                    this.scheduleReconnect();
                }
            };
        } catch (error) {
            console.error('Failed to create WebSocket:', error);
            this.notifyConnectionChange(false, 'Failed to connect');
        }
    }

    /**
     * Schedule reconnection attempt
     */
    scheduleReconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }
        
        this.reconnectTimeout = setTimeout(() => {
            console.log('Attempting to reconnect...');
            this.connect();
        }, WS_CONFIG.reconnectDelay);
    }

    /**
     * Send message to server via WebSocket
     * @param {Object|string} data - Data to send
     */
    send(data) {
        if (this.ws && this.connected && this.ws.readyState === WebSocket.OPEN) {
            const message = typeof data === 'object' ? JSON.stringify(data) : data;
            this.ws.send(message);
            console.log('Sent message:', data);
            return true;
        } else {
            console.warn('WebSocket not connected. Cannot send message.');
            return false;
        }
    }

    /**
     * Send HTTP request to server (for REST endpoints)
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Fetch options
     */
    async fetch(endpoint, options = {}) {
        const baseURL = 'http://localhost:4242';
        const url = `${baseURL}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        try {
            const response = await window.fetch(url, { ...defaultOptions, ...options });
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    /**
     * Handle incoming WebSocket message
     * @param {Object|string} data - Received data
     */
    handleMessage(data) {
        console.log('Received message:', data);
        
        // Notify all registered handlers
        this.messageHandlers.forEach(handler => {
            try {
                handler(data);
            } catch (error) {
                console.error('Error in message handler:', error);
            }
        });
    }

    /**
     * Register a message handler
     * @param {Function} handler - Function to call when message is received
     */
    onMessage(handler) {
        if (typeof handler === 'function') {
            this.messageHandlers.push(handler);
        }
    }

    /**
     * Remove a message handler
     * @param {Function} handler - Handler function to remove
     */
    offMessage(handler) {
        const index = this.messageHandlers.indexOf(handler);
        if (index > -1) {
            this.messageHandlers.splice(index, 1);
        }
    }

    /**
     * Register connection state change callback
     * @param {Function} callback - Callback function
     */
    onConnectionChange(callback) {
        if (typeof callback === 'function') {
            this.connectionCallbacks.push(callback);
        }
    }

    /**
     * Notify all connection change callbacks
     * @param {boolean} connected - Connection state
     * @param {string} message - Optional status message
     */
    notifyConnectionChange(connected, message = null) {
        this.connectionCallbacks.forEach(callback => {
            try {
                callback(connected, message);
            } catch (error) {
                console.error('Error in connection callback:', error);
            }
        });
    }

    /**
     * Check if WebSocket is connected
     * @returns {boolean}
     */
    isConnected() {
        return this.connected;
    }

    /**
     * Disconnect WebSocket
     */
    disconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        
        this.connected = false;
    }
}

// Export singleton instance
export const serverAPI = new ServerAPI();

