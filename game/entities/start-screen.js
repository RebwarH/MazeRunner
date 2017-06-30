var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StartScreen = (function (_super) {
    __extends(StartScreen, _super);
    function StartScreen(texture) {
        var _this = this;
        _super.call(this);
        this.texture = texture;
        this.key = "startScreen";
        this.collision = new Noc.GameEngine.CollitionDetector();
        this.addEventListener("touchend", function (evt) {
            if (_this.isHidden)
                return;
            var ct = evt.changedTouches[0];
            var ctRect = new Noc.GameEngine.Circle(new Noc.GameEngine.Point2D(ct.clientX, ct.clientY), 50);
            var hit = _this.collision.circularDetection(new Noc.GameEngine.Circle(new Noc.GameEngine.Point2D(_this.dx, _this.dy), 50), ctRect);
            if (hit)
                _this.onStart(evt);
        });
        this.addEventListener("touchstart", function (evt) {
        });
    }
    StartScreen.prototype.update = function (ctx) {
        // draw the bg Image  -> will do a video - > canvas 
        ctx.save();
        ctx.drawImage(this.texture, 0, 0, this.dx * 2, this.dy * 2);
        ctx.restore();
        this.dx = ctx.canvas.width / 2;
        this.dy = ctx.canvas.height / 2;
        ctx.save();
        ctx.translate(this.dx, this.dy);
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(-200 / 2, -50 / 2, 200, 50);
        ctx.fill();
        ctx.restore();
    };
    return StartScreen;
}(Noc.GameEngine.NocEntityBase));
//# sourceMappingURL=start-screen.js.map