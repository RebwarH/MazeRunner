var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CompassBackground = (function (_super) {
    __extends(CompassBackground, _super);
    function CompassBackground() {
        _super.call(this);
    }
    CompassBackground.prototype.update = function (ctx) {
        var deg = 0;
        var r = 50;
        var s = 360 / 8;
        var dx = ((ctx.canvas.width) - r) - 20;
        var dy = (r) + 20;
        var len = 60;
        ctx.save();
        ctx.translate(dx, dy);
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = 10;
        ctx.fillStyle = "#000000";
        ctx.strokeStyle = "#ffffff";
        ctx.arc(0, 0, r, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#ffffff";
        while (deg < 360) {
            var rad = this.toRadians(deg);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0 + r * Math.cos(this.toRadians(deg)), 0 + r * Math.sin(this.toRadians(deg)));
            ctx.closePath();
            ctx.stroke();
            deg += s;
        }
        ctx.restore();
    };
    return CompassBackground;
}(Noc.GameEngine.NocEntityBase));
//# sourceMappingURL=compass-background.js.map