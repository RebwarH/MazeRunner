/*
Compass entity
*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CompassNeedle = (function (_super) {
    __extends(CompassNeedle, _super);
    function CompassNeedle(camera) {
        _super.call(this);
        this.camera = camera;
        this.key = "compass";
        this.radius = 50;
    }
    Object.defineProperty(CompassNeedle.prototype, "degree", {
        get: function () {
            return this.toDegrees(this.camera.direction);
        },
        enumerable: true,
        configurable: true
    });
    CompassNeedle.prototype.update = function (ctx) {
        var dx = (ctx.canvas.width - this.radius) - 20;
        var dy = (this.radius) + 20;
        var rad = this.toRadians(this.toDegrees(this.camera.direction) - 90);
        ctx.translate(dx, dy);
        ctx.rotate(rad);
        ctx.beginPath();
        ctx.lineWidth = 10;
        ctx.strokeStyle = "#ff0000";
        ctx.moveTo(0, 0);
        ctx.lineTo(0, this.radius);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.fillStyle = "#ff0000";
        ctx.arc(0, 0, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    };
    return CompassNeedle;
}(Noc.GameEngine.NocEntityBase));
//# sourceMappingURL=compass-needle.js.map