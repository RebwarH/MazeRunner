var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CountDown = (function (_super) {
    __extends(CountDown, _super);
    function CountDown() {
        _super.call(this);
        this.text = ["CREATING MAZE!", "GET READY!", "GO!"];
        this.key = "countDown";
        this.alpha = 1;
        this.p = 0;
        this.isHidden = true;
    }
    ;
    CountDown.prototype.update = function (ctx, ts) {
        var text = this.text[this.p];
        if (!text) {
            this.onEnded(ts);
            this.isHidden = true;
            return;
        }
        var dx = ctx.canvas.width / 2;
        var dy = ctx.canvas.height / 2;
        var h = ctx.canvas.height;
        //  ctx.save();
        ctx.translate(dx, dy);
        ctx.font = "bold 70px Arial";
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = 1 - this.alpha;
        ctx.fillText(text, -0 -
            (ctx.measureText(text).width) / 2, 0);
        this.alpha -= 0.025;
        if (this.alpha < 0) {
            this.alpha = 1;
            this.p = this.p + 1;
        }
        //      ctx.restore();
    };
    return CountDown;
}(Noc.GameEngine.NocEntityBase));
//# sourceMappingURL=count-down.js.map