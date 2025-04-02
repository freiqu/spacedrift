class Rectangle {
    /**
     *
     * @param {number} x1 x coordinate of the top left corner
     * @param {number} y1 y coordinate of the top left corner
     * @param {number} x2 x coordinate of the bottom right corner
     * @param {number} y2 y coordinate of the bottom right corner
     */
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    isInside(x, y) {
        return this.x1 <= x && x <= this.x2 && this.y1 <= y && y <= this.y2;
    }
    draw(color, ctx) {
        if (color == undefined) {
            color = "#FFFFFF";
        }
        let thickness = 2;
        let width = this.x2 - this.x1;
        let height = this.y2 - this.y1;
        ctx.fillStyle = color;
        ctx.fillRect(
            this.x1 - thickness,
            this.y1 - thickness,
            width + thickness * 2,
            height + thickness * 2
        );
        ctx.clearRect(this.x1, this.y1, width, height);
    }
}

export default Rectangle;