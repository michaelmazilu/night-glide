export class CustomCursor {
    constructor(scene) {
        this.scene = scene;
        this.cursor = scene.add.circle(0, 0, 6, 0xffffff);
        this.cursor.setDepth(9999); // Ensure cursor is always on top
        
        // Hide the default cursor
        scene.input.setDefaultCursor('none');
    }

    update() {
        // Update cursor position to follow the pointer
        const pointer = this.scene.input.activePointer;
        this.cursor.x = pointer.x;
        this.cursor.y = pointer.y;
    }

    hide() {
        this.cursor.setVisible(false);
    }

    show() {
        this.cursor.setVisible(true);
    }
} 