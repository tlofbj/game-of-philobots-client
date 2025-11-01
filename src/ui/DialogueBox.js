/**
 * Dialogue Box UI Component
 */
export class DialogueBox {
    constructor(scene, x, y, width, height) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.container = null;
        this.text = null;
        this.speakerText = null;
        this.currentDialogue = null;
        this.isVisible = false;

        this.create();
    }

    create() {
        // Create container
        this.container = this.scene.add.container(this.x, this.y);

        // Background
        const bg = this.scene.add.rectangle(0, 0, this.width, this.height, 0x000000, 0.8);
        bg.setStrokeStyle(2, 0xffffff);

        // Speaker name text
        this.speakerText = this.scene.add.text(
            -this.width / 2 + 20,
            -this.height / 2 + 20,
            '',
            {
                fontSize: '18px',
                fill: '#ffd700',
                fontStyle: 'bold'
            }
        );

        // Dialogue text
        this.text = this.scene.add.text(
            -this.width / 2 + 20,
            -this.height / 2 + 50,
            '',
            {
                fontSize: '20px',
                fill: '#ffffff',
                wordWrap: { width: this.width - 40 }
            }
        );

        this.container.add([bg, this.speakerText, this.text]);
        this.container.setVisible(false);
    }

    /**
     * Show dialogue
     * @param {string} text - Dialogue text
     * @param {string} speaker - Speaker name
     */
    showDialogue(text, speaker = '') {
        this.currentDialogue = { text, speaker };
        this.speakerText.setText(speaker);
        this.text.setText(text);
        this.container.setVisible(true);
        this.isVisible = true;
    }

    /**
     * Hide dialogue box
     */
    hide() {
        this.container.setVisible(false);
        this.isVisible = false;
        this.currentDialogue = null;
    }

    /**
     * Update dialogue box (for animations, etc.)
     */
    update() {
        // Add any update logic here
    }

    /**
     * Check if dialogue box is visible
     * @returns {boolean}
     */
    isDialogueVisible() {
        return this.isVisible;
    }
}

